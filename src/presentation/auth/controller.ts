import { Request, Response } from "express";
import type { RequestHandler } from "express";

export class AuthController {
	// Inyección de Dependencias
	constructor() {}

	registerUser: RequestHandler = (req: Request, res: Response) => {
		return res.json("register controller");
	};

	loginUser: RequestHandler = (req: Request, res: Response) => {
		return res.json("login controller");
	};
}
