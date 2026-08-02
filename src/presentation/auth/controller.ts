import { Request, Response } from "express";
import type { RequestHandler } from "express";
import { RegisterUserDto } from "../../domain/index.js";

export class AuthController {
	// Inyección de Dependencias
	constructor() {}

	registerUser: RequestHandler = (req: Request, res: Response) => {
		const [error, registerUserDto] = RegisterUserDto.create(req.body);

		if (error) return res.status(400).json({ error });
		return res.json(registerUserDto);
	};

	loginUser: RequestHandler = (req: Request, res: Response) => {
		return res.json(req.body);
	};
}
