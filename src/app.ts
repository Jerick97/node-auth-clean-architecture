import { Server } from "./presentation/server.js";
import { envs } from "./config/index.js";

(() => {
	main();
})();

async function main() {
	// todo: await base de datos

	//todo: inicio de nuestro server
	new Server({
		port: envs.PORT,
	}).start();
}

