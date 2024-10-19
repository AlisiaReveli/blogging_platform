import { Injectable, Inject } from '@nestjs/common';
import { User } from './types/user.types';
import { UserDto } from './dto/user.dto';
import { USER_REPOSITORY } from '../../../constants';
import { UserModel} from "../../core/database/entities/user.entity";
import { Types } from 'mongoose';
@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof UserModel,
  ) {}

  async create(user: UserDto): Promise<User> {
    return await this.userRepository.create<User>(user);
  }

  async findOneByEmail(email: string): Promise<User|null> {
    const user = await this.userRepository.findOne<User>({ email });
    return user||null;
  }

  async findOneById(id: number): Promise<User> {
    const userId = new Types.ObjectId(id);
    const user = await this.userRepository.findOne<User>({ _id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
