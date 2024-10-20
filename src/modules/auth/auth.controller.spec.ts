import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';
import { UserDto } from '../users/dto/user.dto';
import { Gender } from '../../../constants';
import { UsersService } from '../users/users.service'; // Import UsersService
import { DoesUserExist } from '../../core/guards/doesUserExist.guard'; // Import the guard

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        login: jest.fn(),
        create: jest.fn(),
    };

    const mockUsersService = {
        findOneByEmail: jest.fn(),
        create: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide: DoesUserExist,
                    useValue: {},
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('login', () => {
        it('should return a token on successful login', async () => {
            const loginDto: LoginDto = { email: 'test@example.com', password: 'password' };
            const result = { token: 'token123' };

            mockAuthService.login.mockResolvedValue(result);

            expect(await authController.login(loginDto)).toEqual(result);
            expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
        });

        it('should throw UnauthorizedException if login fails', async () => {
            const loginDto: LoginDto = { email: 'wrong@example.com', password: 'wrongpassword' };
            mockAuthService.login.mockRejectedValue(new UnauthorizedException());

            await expect(authController.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('signUp', () => {
        it('should create a new user and return a token', async () => {
            const userDto: UserDto = { email: 'new@example.com', password: 'password', name: 'Test User', gender: Gender.FEMALE };
            const result = { token: 'token123' };

            mockAuthService.create.mockResolvedValue(result);
            mockUsersService.create.mockResolvedValue(userDto); // Mock create behavior

            expect(await authController.signUp(userDto)).toEqual(result);
            expect(mockAuthService.create).toHaveBeenCalledWith(userDto);
        });
    });
});
