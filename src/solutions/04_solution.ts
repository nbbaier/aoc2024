import type { Point, DirLabel, Direction } from "@/types";
import { checkOutOfBounds } from "@/utils";

const directions: { [K in DirLabel]?: Direction } = {
	r: { dx: 1, dy: 0 }, // right
	l: { dx: -1, dy: 0 }, // left
	d: { dx: 0, dy: 1 }, // down
	u: { dx: 0, dy: -1 }, // up
	ur: { dx: 1, dy: -1 }, // up-right
	dl: { dx: -1, dy: 1 }, // down-left
	dr: { dx: 1, dy: 1 }, // down-right
	ul: { dx: -1, dy: -1 }, // up-left
};

function checkXMAS(
	grid: string[][],
	start: Point,
	dir: Direction,
	rows: number,
	cols: number,
): boolean {
	const target = "XMAS";

	const endX = start.x + dir.dx;
	const endY = start.y + dir.dy;

	// Check if the word would go out of bounds
	checkOutOfBounds({ x: endX, y: endY }, rows, cols);

	// Check each character of "XMAS"
	for (let i = 0; i < target.length; i++) {
		const currentX = start.x + dir.dx * i;
		const currentY = start.y + dir.dy * i;

		if (grid[currentY][currentX] !== target[i]) {
			return false;
		}
	}

	return true;
}
function checkCorners(
	grid: string[][],
	start: Point,
	rows: number,
	cols: number,
): boolean {
	const region: string[][] = [];
	const corners = Object.fromEntries(
		Object.entries(directions).filter(([k, v]) => k.includes("-")),
	);

	for (const corner of Object.entries(corners)) {
		const endX = start.x + corner[1].dx;
		const endY = start.y + corner[1].dy;
		checkOutOfBounds({ x: endX, y: endY }, rows, cols);
	}

	// get the diagonals
	const lrDiag = `${grid[start.y + corners.ur.dy][start.x + corners.ur.dx]}${grid[start.y + corners.dl.dy][start.x + corners.dl.dx]}`;
	const rlDiag = `${grid[start.y + corners.ul.dy][start.x + corners.ul.dx]}${grid[start.y + corners.dr.dy][start.x + corners.dr.dx]}`;

	// return the check of the diagonals
	return ["MS", "SM"].includes(lrDiag) && ["MS", "SM"].includes(rlDiag);
}

function part1(data: string): number {
	const grid = data
		.trim()
		.split("\n")
		.map((line) => line.split(""));

	let xmasCount = 0;
	const rows = grid.length;
	const cols = grid[0].length;

	// Check each cell as a potential starting point
	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			// For each direction
			for (const dir of Object.values(directions)) {
				if (checkXMAS(grid, { x, y }, dir, rows, cols)) {
					xmasCount++;
				}
			}
		}
	}

	return xmasCount;
}

function part2(data: string) {
	const grid = data
		.trim()
		.split("\n")
		.map((line) => line.split(""));

	let xmasCount = 0;
	const rows = grid.length;
	const cols = grid[0].length;

	// find all the A's and check their corners
	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			if (grid[y][x] === "A") {
				xmasCount += checkCorners(grid, { x, y }, rows, cols) ? 1 : 0;
			}
		}
	}

	return xmasCount;
}

export default { 1: part1, 2: part2 };
