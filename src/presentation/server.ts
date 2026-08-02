import express, { Router } from "express";
interface Options {
	port?: number;
	routes: Router;
}
export class Server {
	public readonly app = express();
	private readonly port: number;
	private readonly routes: Router;
	constructor(option: Options) {
		const { port = 3000, routes } = option;
		this.port = port;
		this.routes = routes;
	}

	async start() {
		// Middlewares
		this.app.use(express.json()); //raw json
		this.app.use(express.urlencoded({ extended: true })); //admitir form-urlencoded

		// Usar las rutas definidas
		this.app.use(this.routes);
		this.app.listen(this.port, () => {
			console.log(`Server started on port ${this.port}`);
		});
	}
}
