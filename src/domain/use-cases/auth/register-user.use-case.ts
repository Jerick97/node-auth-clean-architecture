import jwt from "jsonwebtoken";
import { JwtAdapter } from "../../../config/jwt.js";
import { AuthRepository, CustomError, RegisterUserDto } from "../../index.js";

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

interface RegisterUserUseCase {
	execute(registerUserDtp: RegisterUserDto): Promise<any>;
}

export class RegisterUser implements RegisterUserUseCase {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly signToken: SignToken = JwtAdapter.generateToken,
	) {}

	async execute(registerUserDtp: RegisterUserDto): Promise<UserToken> {
		// Crear usuario
		const user = await this.authRepository.register(registerUserDtp);

		// token
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
