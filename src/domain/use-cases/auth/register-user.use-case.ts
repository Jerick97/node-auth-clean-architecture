import { AuthRepository, RegisterUserDto } from "../../index.js";

interface UserToken {
	token: string;
	user: {
		id: string;
		name: string;
		email: string;
		roles: string[];
	};
}

type SignToken = (payload: Object, duration?: string) => Promise<string | null>;

interface RegisterUserUseCase {
	execute(registerUserDtp: RegisterUserDto): Promise<any>;
}

export class RegisterUser implements RegisterUserUseCase {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly signToken: SignToken,
	) {}

	async execute(registerUserDtp: RegisterUserDto): Promise<UserToken> {
		// Crear usuario
		const user = await this.authRepository.register(registerUserDtp);

		// token
		const token = this.signToken({ id: user.id }, "2h");
		return {
			token: "token",
			user: {
				id: "id",
				name: "name",
				email: "email",
				roles: ["roles"],
			},
		};
	}
}
