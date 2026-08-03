import { Request, Response } from "express";
import type { RequestHandler } from "express";
import { AuthRepository, RegisterUserDto } from "../../domain/index.js";

export class AuthController {
	// Inyección de Dependencias
	constructor(private readonly authRepository: AuthRepository) {}

	registerUser: RequestHandler = (req: Request, res: Response) => {
		const [error, registerUserDto] = RegisterUserDto.create(req.body);

		if (error) return res.status(400).json({ error });
		this.authRepository
			.register(registerUserDto!)
			.then((user) => res.status(201).json(user))
			.catch((error) => res.status(500).json(error));
	};

	loginUser: RequestHandler = (req: Request, res: Response) => {
		return res.json(req.body);
	};
}
