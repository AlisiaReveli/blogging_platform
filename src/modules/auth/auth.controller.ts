import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Res
} from '@nestjs/common'
import { User } from '../users/types/user.types';
import { AuthService } from './auth.service'
import { AuthGuard } from '@nestjs/passport'
import { UserDto } from '../users/dto/user.dto'
import { DoesUserExist } from '../../core/guards/doesUserExist.guard'
import { CurrentUser } from '../../core/decorators/currentUser.decorator'
import {ApiResponse, ApiTags, ApiBody, ApiBearerAuth} from '@nestjs/swagger'
import { LoginDto } from './dto/login.dto'
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Returns authentication token' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login (@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto)
  }

  @UseGuards(DoesUserExist)
  @Post('signup')
  @ApiBody({ type: UserDto })
  async signUp (@Body() user: UserDto) {
    return await this.authService.create(user)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  @ApiBearerAuth()
  async getMe (@CurrentUser() user: User, @Res() res) {
    if (user) {
      return res.status(200).json({
        name: user.name,
        email: user.email
      })
    } else {
      return res.status(500).json({
        message: 'Something went wrong'
      })
    }
  }
}
