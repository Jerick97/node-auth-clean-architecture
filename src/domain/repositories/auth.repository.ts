import { RegisterUserDto, UserEntity } from "../index.js";

export abstract class AuthRepository {
	abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;
}
