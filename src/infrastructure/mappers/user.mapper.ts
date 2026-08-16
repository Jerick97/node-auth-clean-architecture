import { CustomError, UserEntity } from "../../domain/index.js";

export class UserMapper {
	static userEntityFromOnject(object: { [key: string]: any }) {
		const { _id, id, name, email, password, roles } = object;

		if (!id || !_id) {
			throw CustomError.badRequest("Id is required");
		}
		if (!name || !email) {
			throw CustomError.badRequest("Name and email are required");
		}
		if (!password) {
			throw CustomError.badRequest("Password is required");
		}
		if (!roles || !Array.isArray(roles) || roles.length < 1) {
			throw CustomError.badRequest("Roles is required");
		}
		return new UserEntity(id || _id, name, email, password, roles);
	}
}
