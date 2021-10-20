module.exports = {
	apps: [
		{
			name: "bandgibot",
			script: "server.js",
			node_args: "-r dotenv/config",
			env_production: {
				NODE_ENV: "production",
				PORT: 3000,
			},
			env_development: {
				NODE_ENV: "development",
				PORT: 3000,
			},
		},
	],
};
