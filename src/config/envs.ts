const getRequiredString = (name: string): string => {
	const value = process.env[name]?.trim();

	if (!value) {
		throw new Error(`La variable de entorno ${name} es obligatoria.`);
	}

	return value;
};

const getPort = (name: string): number => {
	const value = getRequiredString(name);
	const port = Number(value);

	if (!Number.isInteger(port) || port < 1 || port > 65_535) {
		throw new Error(
			`La variable de entorno ${name} debe ser un puerto válido (1-65535).`,
		);
	}

	return port;
};

export const envs = {
	PORT: getPort("PORT"),
	MONGO_URL: getRequiredString("MONGO_URL"),
	MONGO_DB_NAME: getRequiredString("MONGO_DB_NAME"),
} as const;
