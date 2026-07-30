const getPort = (name: string): number => {
	const value = process.env[name];
	const port = Number(value);

	if (!value || !Number.isInteger(port) || port < 1 || port > 65_535) {
		throw new Error(
			`La variable de entorno ${name} debe ser un puerto válido (1-65535).`,
		);
	}

	return port;
};

export const envs = {
	PORT: getPort("PORT"),
} as const;
