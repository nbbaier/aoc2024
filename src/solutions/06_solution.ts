import type { Point, DirLabel, DirectionSet } from "@/types";
import { build } from "bun";

// Define cardinal directions with their corresponding x,y changes
const directions: Omit<DirectionSet, "ur" | "dl" | "dr" | "ul"> = {
	r: { dx: 1, dy: 0 }, // Move right: increase x by 1
	l: { dx: -1, dy: 0 }, // Move left: decrease x by 1
	d: { dx: 0, dy: 1 }, // Move down: increase y by 1
	u: { dx: 0, dy: -1 }, // Move up: decrease y by 1
};

type Cardinal = Omit<DirLabel, "ur" | "dl" | "dr" | "ul">;

const turnMap: Map<Cardinal, Cardinal> = new Map([
	["u", "r"],
	["r", "d"],
	["d", "l"],
	["l", "u"],
]);

interface GuardState {
	position: Point;
	facing: Cardinal;
	visited: Point[];
}

interface Cell {
	coord: Point;
	obstacle: boolean;
	raw: string;
}

type Board = {
	dimensions: { rows: number; cols: number };
	cells: Map<string, Cell>;
};

function buildBoard(grid: string[][]) {
	const board: Board = {
		dimensions: { rows: grid.length, cols: grid[0].length },
		cells: new Map<string, Cell>(),
	};
	for (let y = 0; y < grid.length; y++) {
		const row = grid[y];
		for (let x = 0; x < row.length; x++) {
			const key = `${x},${y}`;
			board.cells.set(key, {
				coord: { x, y },
				obstacle: row[x] === "#",
				raw: row[x],
			});
		}
	}
	return board;
}
function initializeGuard(board: Board): GuardState {
	const [key, startCell] = Array.from(board.cells.entries()).find(
		([_, cell]) => cell.raw === "^",
	) as [string, Cell];
	const [x, y] = key.split(",").map(Number);
	const startPoint = { x, y };
	return { position: startPoint, visited: [], facing: "u" };
}

/**
 * Processes a single turn for the guard, handling movement and direction changes
 * @returns Object containing updated guard state, board state, and whether guard is still on the board
 */
function takeTurn(
	guard: GuardState,
	board: Board,
): {
	guard: GuardState;
	board: Board;
	on: boolean;
} {
	const startPoint = guard.position;
	const startKey = `${startPoint.x},${startPoint.y}`;
	const startCell = board.cells.get(startKey) as Cell;
	const direction = directions[guard.facing as keyof typeof directions];

	if (!direction) {
		throw new Error(`Invalid facing direction: ${guard.facing}`);
	}

	// Calculate next position based on current direction
	const newPoint = {
		x: startPoint.x + direction.dx,
		y: startPoint.y + direction.dy,
	};
	const newKey = `${newPoint.x},${newPoint.y}`;
	const nextCell = board.cells.get(newKey);

	// Handle three possible scenarios:
	// 1. Guard would move off the board
	if (typeof nextCell === "undefined") {
		guard.visited.push(startCell.coord);
		return { guard, board, on: false };
	}

	// 2. Next cell is empty - move forward
	if (!nextCell.obstacle) {
		guard.visited.push(startCell.coord);
		guard.position = newPoint;
		return { guard, board, on: true };
	}

	// 3. Hit an obstacle - rotate 90 degrees clockwise
	guard.facing = turnMap.get(guard.facing) as Cardinal;
	return { guard, board, on: true };
}

/**
 * Solves part 1: Counts unique cells visited by guard before leaving the board
 */
function part1(data: string) {
	const grid = data
		.trim()
		.split("\n")
		.map((line) => line.split(""));

	let boardState = buildBoard(grid);
	let guardState = initializeGuard(boardState);
	let onState = true;

	// Continue moving until guard leaves the board
	while (onState) {
		const turnOutcome = takeTurn(guardState, boardState);
		boardState = turnOutcome.board;
		guardState = turnOutcome.guard;
		onState = turnOutcome.on;
	}

	// Return count of unique visited positions
	return new Set(guardState.visited.map((p) => `${p.x},${p.y}`)).size;
}

function part2(data: string) {
	return "part 2 not implemented";
}

export default { 1: part1, 2: part2 };
