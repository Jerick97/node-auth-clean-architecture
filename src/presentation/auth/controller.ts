import { Request, Response } from "express";
import type { RequestHandler } from "express";
import {
	AuthRepository,
	CustomError,
	RegisterUser,
	RegisterUserDto,
	LoginUser,
	LoginUserDto,
} from "../../domain/index.js";
import { UserModel } from "../../data/mongodb/index.js";

export class AuthController {
	// Inyección de Dependencias
	constructor(private readonly authRepository: AuthRepository) {}

	private readonly handleError = (error: unknown, res: Response) => {
		if (error instanceof CustomError) {
			return res.status(error.statusCode).json({ error: error.message });
		}
		console.error("Error Inesperado:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	};

	registerUser: RequestHandler = (req: Request, res: Response) => {
		const [error, registerUserDto] = RegisterUserDto.create(req.body);

		if (error) return res.status(400).json({ error });
		new RegisterUser(this.authRepository)
			.execute(registerUserDto!)
			.then((data) => res.json(data))
			.catch((error) => this.handleError(error, res));
	};

	loginUser: RequestHandler = (req: Request, res: Response) => {
		const [error, loginUserDto] = LoginUserDto.create(req.body);
		if (error) return res.status(400).json({ error });
		new LoginUser(this.authRepository)
			.execute(loginUserDto!)
			.then((data) => res.json(data))
			.catch((error) => this.handleError(error, res));
	};

	getUsers = (req: Request, res: Response) => {
		UserModel.find()
			.then((users) => {
				return res.json({
					//users,
					user: res.locals.user,
				});
			})
			.catch((error) => {
				console.error(error);
				return res.status(500).json({ error: "Internal Server Error" });
			});
	};
}
