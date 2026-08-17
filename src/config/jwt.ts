import jwt from "jsonwebtoken";
export class JwtAdapter {
	static async generateToken(
		payload: object,
		duration: jwt.SignOptions["expiresIn"] = "2h",
	): Promise<string | null> {
		// TODO: generación del seed dinámico
		return new Promise((resolve) => {
			jwt.sign(payload, "SEED", { expiresIn: duration }, (err, token) => {
				if (err) return resolve(null);
				resolve(token!);
			});
		});
	}
}
