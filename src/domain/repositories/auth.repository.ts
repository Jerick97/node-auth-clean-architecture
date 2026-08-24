import { LoginUserDto, RegisterUserDto, UserEntity } from "../index.js";

export abstract class AuthRepository {
	abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>;
	abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;
}
