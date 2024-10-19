import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from '../users/users.service';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
import {LoginDto} from './dto/login.dto';
import {UserDto} from '../users/dto/user.dto';
import {TokenDto} from "./dto/token.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    // find if user exist with this email
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      return null;
    }

    // find if user password match
    const match = await this.comparePassword(pass, user.password);
    if (!match) {
      throw new Error('Wrong credentials');
    }

    return user;
  }

  public async login(user: LoginDto) {
    const token_details = await this.userService.findOneByEmail(user.email);
    if (!token_details) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { email, _id} = token_details;
    const token = await this.generateToken({email, _id});
    return { token };
  }

  public async create(user: UserDto): Promise<{token: string}> {
    // hash the password
    const pass = await this.hashPassword(user.password);

    // create the user
    const newUser = await this.userService.create({ ...user, password: pass });

    const { email, _id,  } = newUser;
    // generate token
    const token = await this.generateToken({email, _id});
   return {token};
  }

  private async generateToken(user : TokenDto) {
    return await this.jwtService.signAsync(user);
  }

  private async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  private async comparePassword(enteredPassword, dbPassword) {
    return await bcrypt.compare(enteredPassword, dbPassword);
  }
}
