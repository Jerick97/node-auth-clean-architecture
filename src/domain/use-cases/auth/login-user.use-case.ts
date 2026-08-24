import jwt from "jsonwebtoken";
import { JwtAdapter } from "../../../config/jwt.js";
import { AuthRepository, CustomError, LoginUserDto } from "../../index.js";

interface UserToken {
	token: string;
	user: {
		id: string;
		name: string;
		email: string;
		roles: string[];
	};
}

type SignToken = (
	payload: object,
	duration?: jwt.SignOptions["expiresIn"],
) => Promise<string | null>;

interface LoginUserUseCase {
	execute(loginUserDto: LoginUserDto): Promise<UserToken>;
}

export class LoginUser implements LoginUserUseCase {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly signToken: SignToken = JwtAdapter.generateToken,
	) {}

	async execute(loginUserDto: LoginUserDto): Promise<UserToken> {
		const user = await this.authRepository.login(loginUserDto);
		const token = await this.signToken({ id: user.id }, "2h");
		if (!token)
			throw CustomError.internalServerError("Error al generar el token");
		return {
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				roles: user.role,
			},
		};
	}
}
