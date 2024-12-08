declare module "bun" {
	interface Env {
		DATA: string;
		SOLUTIONS: string;
		AOC_TOKEN: string;
	}
}

import { app } from "./cli";

app.parse();
