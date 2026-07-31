import { Validators } from "../../../config/validators.js";

export class RegisterUserDto {
	private constructor(
		public name: string,
		public email: string,
		public password: string,
	) {}

	static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
		const { name, email, password } = object;
		if (!name || name.length < 3) return ["Nombre es requerido"];
		if (!email || !Validators.email.test(email)) return ["Email no es valido"];
		if (!password || password.length < 8)
			return ["Password debe tener al menos 8 caracteres"];
		return [undefined, new RegisterUserDto(name, email, password)];
	}
}
