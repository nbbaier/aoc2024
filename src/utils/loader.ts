import path from "node:path";

const DATA_DIR = "../data";

export function loadData(day: string) {
	const dataPath = path.join(DATA_DIR, day);
	return dataPath;
}
