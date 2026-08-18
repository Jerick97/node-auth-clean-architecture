import jwt from "jsonwebtoken";
import { envs } from "./envs.js";

const JWT_SEED = envs.JWT_SEED;
export class JwtAdapter {
	static async generateToken(
		payload: object,
		duration: jwt.SignOptions["expiresIn"] = "2h",
	): Promise<string | null> {
		return new Promise((resolve) => {
			jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
				if (err) return resolve(null);
				resolve(token!);
			});
		});
	}

	static validateToken<T extends object = jwt.JwtPayload>(
		token: string,
	): Promise<T | null> {
		return new Promise((resolve) => {
			jwt.verify(token, JWT_SEED, (error, decoded) => {
				if (error || !decoded || typeof decoded === "string") {
					return resolve(null);
				}

				resolve(decoded as T);
			});
		});
	}
}
