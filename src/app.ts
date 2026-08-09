import { Server } from "./presentation/server.js";
import { envs } from "./config/index.js";
import { AppRoutes } from "./presentation/routes.js";
import { MongoDatabase } from "./data/mongodb/index.js";

(() => {
	main();
})();

async function main() {
	// conexion a la base de datos
	await MongoDatabase.connect({
		mongoUrl: envs.MONGO_URL,
		dbName: envs.MONGO_DB_NAME,
	});

	//inicio de nuestro server
	new Server({ port: envs.PORT, routes: AppRoutes.routes }).start();
}
