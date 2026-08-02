import { RegisterUserDto, UserEntity } from "../index.js";

export abstract class AuthDatasource {
	//todo: completar mas adelante
	//abstract login(loginUserDto:LoginUserDto):Promise<UserEntity>;
	abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;
}
