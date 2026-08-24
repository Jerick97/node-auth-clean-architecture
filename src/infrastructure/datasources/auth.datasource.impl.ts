import { BcryptAdapter } from "../../config/bcrypt.js";
import { UserModel } from "../../data/mongodb/index.js";
import {
	AuthDatasource,
	CustomError,
	RegisterUserDto,
	LoginUserDto,
	UserEntity,
} from "../../domain/index.js";
import { UserMapper } from "../index.js";

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class AuthDatasourceImpl implements AuthDatasource {
	constructor(
		private readonly hashPassword: HashFunction = BcryptAdapter.hash,
		private readonly comparePassword: CompareFunction = BcryptAdapter.compare,
	) {}
	async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
		const { name, email, password } = registerUserDto;
		try {
			// verificar si el email existe
			const emailExist = await UserModel.findOne({
				email: email,
			});
			if (emailExist) {
				throw CustomError.badRequest(
					"No se pudo completar el registro con los datos proporcionados.",
				);
			}

			const user = await UserModel.create({
				name: name,
				email: email,
				password: this.hashPassword(password),
			});
			// hash de contraseña

			await user.save();

			// mapear la respuesta a nuestra entidad
			return UserMapper.userEntityFromOnject(user);
		} catch (error) {
			if (error instanceof CustomError) {
				throw error;
			}
			throw CustomError.internalServerError();
		}
	}
	async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
		const { email, password } = loginUserDto;
		try {
			// verificar si el email existe
			const user = await UserModel.findOne({
				email: email,
			});
			if (!user) {
				throw CustomError.badRequest(
					"No se pudo completar el inicio de sesión con los datos proporcionados.",
				);
			}

			// verificar la contraseña
			const isPasswordValid = this.comparePassword(password, user.password);
			if (!isPasswordValid) {
				throw CustomError.badRequest(
					"No se pudo completar el inicio de sesión con los datos proporcionados.",
				);
			}

			// mapear la respuesta a nuestra entidad
			return UserMapper.userEntityFromOnject(user);
		} catch (error) {
			if (error instanceof CustomError) {
				throw error;
			}
			throw CustomError.internalServerError();
		}
	}
}
