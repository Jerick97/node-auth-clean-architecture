import { UserModel } from "../../data/mongodb/index.js";
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
			const emailExist = await UserModel.findOne({
				email: email,
			});
			if (emailExist) {
				throw CustomError.badRequest("El usuario ya existe");
			}

			const user = await UserModel.create({
				name,
				email,
				password,
			});
			// hash de contraseña

			await user.save();

			// mapear la respuesta a nuestra entidad
			return new UserEntity(
				user.id,
				user.name,
				user.email,
				user.password,
				user.roles,
			);
		} catch (error) {
			if (error instanceof CustomError) {
				throw error;
			}
			throw CustomError.internalServerError();
		}
	}
}
