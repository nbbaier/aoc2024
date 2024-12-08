import path from "node:path";
import type { Point } from "./types";

export const getAocData = async (day: number, year: number) => {
	return await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
		headers: {
			Cookie: Bun.env.AOC_TOKEN,
		},
	});
};

export async function loadData(day: number, example = false) {
	const dayString = String(day).padStart(2, "0");
	const fileName = example
		? `${dayString}_example.txt`
		: `${dayString}_data.txt`;
	const dataPath = path.join(Bun.env.DATA, fileName);
	const file = Bun.file(dataPath);

	return await file.text();
}

export function checkOutOfBounds(start: Point, rows: number, cols: number) {
	if (start.x < 0 || start.x >= cols || start.y < 0 || start.y >= rows) {
		return false;
	}
	return true;
}
