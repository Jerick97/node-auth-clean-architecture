import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config/index.js";
import { UserModel } from "../../data/mongodb/index.js";

export class AuthMiddleware {
	static readonly validateJWT = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		const authorization = req.header("Authorization");
		if (!authorization) {
			return res.status(401).json({ error: "No token provided" });
		}
		if (!authorization.startsWith("Bearer ")) {
			return res
				.status(401)
				.json({ error: "Invalid token format. Expected 'Bearer token'" });
		}
		const token = authorization.split(" ")[1];
		const payload = await JwtAdapter.validateToken<{ id: string }>(token);
		if (!payload) {
			return res.status(401).json({
				error: "Invalid or expired token",
			});
		}
		const user = await UserModel.findById(payload.id);
		if (!user) return res.status(401).json({ error: "User not found" });

		res.locals.user = user;
		next();
	};
}
