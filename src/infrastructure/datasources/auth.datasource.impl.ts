import {
	AuthDatasource,
	CustomError,
	RegisterUserDto,
	UserEntity,
} from "../../domain/index.js";

export class AuthDatasourceImpl implements AuthDatasource {
	async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
		const { name, email, password } = registerUserDto;
		try {
			// verificar si el email existe
			if ("jerick@ludik.pe" === email) {
				throw CustomError.badRequest("El email ya existe");
			}
			// hash de contraseña
			// mapear la respuesta a nuestra entidad
			return new UserEntity(crypto.randomUUID(), name, email, password, [
				"ADMIN_ROLE",
			]);
		} catch (error) {
			if (error instanceof CustomError) {
				throw error;
			}
			throw CustomError.internalServerError();
		}
	}
}
