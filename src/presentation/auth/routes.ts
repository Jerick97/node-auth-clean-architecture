import { Router } from "express";
import { AuthController } from "./controller.js";
import {
	AuthDatasourceImpl,
	AuthRepositoryImpl,
} from "../../infrastructure/index.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

export class AuthRoutes {
	static get routes(): Router {
		const router = Router();
		const datasource = new AuthDatasourceImpl();
		const authRepository = new AuthRepositoryImpl(datasource);
		const controller = new AuthController(authRepository);
		//Definir todas las rutas principales
		router.get("/", [AuthMiddleware.validateJWT], controller.getUsers);
		router.post("/login", controller.loginUser);
		router.post("/register", controller.registerUser);
		return router;
	}
}
