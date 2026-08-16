import { Request, Response } from "express";
import type { RequestHandler } from "express";
import {
	AuthRepository,
	CustomError,
	RegisterUserDto,
} from "../../domain/index.js";

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
		this.authRepository
			.register(registerUserDto!)
			.then((user) => res.status(201).json(user))
			.catch((error) => this.handleError(error, res));
	};

	loginUser: RequestHandler = (req: Request, res: Response) => {
		return res.json(req.body);
	};
}
