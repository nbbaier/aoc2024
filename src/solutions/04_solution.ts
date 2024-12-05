type Point = {
	x: number;
	y: number;
};

type Direction = {
	dx: number;
	dy: number;
};

export default function (input: string): number {
	// Parse input into 2D array
	const grid = input
		.trim()
		.split("\n")
		.map((line) => line.split(""));

	// All possible directions to check (horizontal, vertical, diagonal)
	const directions: Direction[] = [
		{ dx: 1, dy: 0 }, // right
		{ dx: -1, dy: 0 }, // left
		{ dx: 0, dy: 1 }, // down
		{ dx: 0, dy: -1 }, // up
		{ dx: 1, dy: 1 }, // diagonal down-right
		{ dx: -1, dy: 1 }, // diagonal down-left
		{ dx: 1, dy: -1 }, // diagonal up-right
		{ dx: -1, dy: -1 }, // diagonal up-left
	];

	let xmasCount = 0;
	const rows = grid.length;
	const cols = grid[0].length;

	// Check each cell as a potential starting point
	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			// For each direction
			for (const dir of directions) {
				if (checkXMAS(grid, { x, y }, dir)) {
					xmasCount++;
				}
			}
		}
	}

	return xmasCount;
}

function checkXMAS(grid: string[][], start: Point, dir: Direction): boolean {
	const target = "XMAS";
	const rows = grid.length;
	const cols = grid[0].length;

	// Check if the word would go out of bounds
	const endX = start.x + dir.dx * (target.length - 1);
	const endY = start.y + dir.dy * (target.length - 1);

	if (endX < 0 || endX >= cols || endY < 0 || endY >= rows) {
		return false;
	}

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
