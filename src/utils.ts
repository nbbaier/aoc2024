import path from "node:path";
import type { Board, Point } from "./types";

export const getAocData = async (day: number, year: number) => {
	return await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
		headers: {
			Cookie: Bun.env.AOC_TOKEN,
		},
	});
};

export function getMiddleElement<T>(arr: T[]): T | null {
	if (arr.length === 0) {
		return null;
	}
	const middleIndex = Math.floor(arr.length / 2);
	return arr[middleIndex];
}

export async function loadData(day: number, example = false) {
	const dayString = String(day).padStart(2, "0");
	const fileName = example ? `${dayString}_example.txt` : `${dayString}_data.txt`;
	const dataPath = path.join(Bun.env.DATA, fileName);
	const file = Bun.file(dataPath);

	return await file.text();
}

export function checkOutOfBounds(point: Point, rows: number, cols: number) {
	return point.x < 0 || point.x >= cols || point.y < 0 || point.y >= rows;
}

export const isValid = (x: number, y: number, rows: number, cols: number) => {
	return x >= 0 && x < cols && y >= 0 && y < rows;
};

export function createGrid(data: string) {
	return data
		.trim()
		.split("\n")
		.map((line) => line.split(""));
}

export function dfs(grid: string[][], start: { x: number; y: number }) {
	const rows = grid.length;
	const cols = grid[0].length;
	const startValue = grid[start.y][start.x];

	const stack = [start];
	const visited: Set<string> = new Set();
	const result = [];

	const directions = [
		{ x: 1, y: 0 }, // right
		{ x: -1, y: 0 }, // left
		{ x: 0, y: 1 }, // down
		{ x: 0, y: -1 }, // up
	];

	while (stack.length) {
		const current = stack.pop();
		if (!current) continue;
		const pointKey = `${current.x},${current.y}`;

		if (!visited.has(pointKey)) {
			visited.add(pointKey);
			result.push(pointKey);

			for (const dir of directions) {
				const newX = current.x + dir.x;
				const newY = current.y + dir.y;

				if (
					isValid(newX, newY, rows, cols) &&
					grid[newY][newX] === startValue &&
					!visited.has(`${newX},${newY}`)
				) {
					stack.push({ x: newX, y: newY });
				}
			}
		}
	}

	return result;
}
function defineQuadrants(board: Board) {
	const middleRow = Math.floor(board.rows / 2);
	const middleCol = Math.floor(board.cols / 2);

	const quadrants = {
		tl: {
			name: "top-left",
			x: (n: number) => n >= 0 && n < middleCol, // LEFT
			y: (n: number) => n >= 0 && n < middleRow, // TOP
		},
		tr: {
			name: "top-right",
			x: (n: number) => n > middleCol && n < board.cols, // RIGHT
			y: (n: number) => n >= 0 && n < middleRow, // TOP
		},
		bl: {
			name: "bottom-left",
			x: (n: number) => n >= 0 && n < middleCol, // LEFT
			y: (n: number) => n > middleRow && n < board.rows, // BOTTOM
		},
		br: {
			name: "bottom-right",
			x: (n: number) => n > middleCol && n < board.cols, // RIGHT
			y: (n: number) => n > middleRow && n < board.rows, // BOTTOM
		},
	};

	return { rowsMiddle: middleRow, colsMiddle: middleCol };
}
