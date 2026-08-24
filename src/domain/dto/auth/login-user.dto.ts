import { Validators } from "../../../config/index.js";

export class LoginUserDto {
	constructor(
		public readonly email: string,
		public readonly password: string,
	) {}

	static create(object: any): [string?, LoginUserDto?] {
		const { email, password } = object;
		if (!email) return ["Email es requerido"];
		if (!Validators.email.test(email)) return ["Email no es valido"];
		if (!password || password.length < 8)
			return ["Password debe tener al menos 8 caracteres"];
		return [undefined, new LoginUserDto(email, password)];
	}
}
