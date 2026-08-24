import { LoginUserDto, RegisterUserDto, UserEntity } from "../index.js";

export abstract class AuthDatasource {
	abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>;
	abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;
}
