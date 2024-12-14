import type { Board, Point, Velocity } from "@/types";
import fs from "node:fs";
import os from "node:os";
import { string, variance } from "mathjs";

function sortQudrants(board: Board, points: Point[]) {
	const middleRow = Math.floor(board.rows / 2);
	const middleCol = Math.floor(board.cols / 2);

	const isTopBottom = (y: number) => {
		if (y >= 0 && y < middleRow) {
			return "top";
		}
		if (y > middleRow && y < board.rows) {
			return "bottom";
		}
		return "middle";
	};

	const isLeftRight = (x: number) => {
		if (x >= 0 && x < middleCol) {
			return "left";
		}
		if (x > middleCol && x < board.cols) {
			return "right";
		}
		return "middle";
	};

	const sorted = new Map<string, string[]>();

	for (const { x, y } of points) {
		const point = `(${x},${y})`;
		const q = `${isTopBottom(y)}-${isLeftRight(x)}`;
		if (!sorted.get(q) && !q.includes("middle")) {
			//&& !q.includes("middle")
			sorted.set(q, []);
			sorted.get(q)?.push(point);
		} else sorted.get(q)?.push(point);
	}

	return sorted;
}

class Robot {
	position: Point;
	velocity: Velocity;
	board: Board;
	simsRun: number;
	initialPosition: Point;

	constructor(position: Point, velocity: Velocity, board: Board) {
		this.initialPosition = position;
		this.position = position;
		this.velocity = velocity;
		this.board = board;
		this.simsRun = 0;
	}

	move(steps = 1) {
		const newX = this.position.x + this.velocity.dx * steps;
		const newY = this.position.y + this.velocity.dy * steps;

		const realX =
			((newX % this.board.cols) + this.board.cols) % this.board.cols;
		const realY =
			((newY % this.board.rows) + this.board.rows) % this.board.rows;

		this.position = {
			x: realX,
			y: realY,
		};

		this.simsRun += steps;
	}
}
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function part1(data: string) {
	const board: Board = { rows: 103, cols: 101 };
	const robots: Robot[] = data
		.trim()
		.split("\n")
		.map((line) => {
			const [px, py, vx, vy] = line.match(/-?\d+/g)?.map(Number) ?? [];
			return new Robot({ x: px, y: py }, { dx: vx, dy: vy }, board);
		});

	const simulations = 100;
	const finalPositions: Point[] = [];

	for (const robot of robots) {
		robot.move(simulations);
		finalPositions.push(robot.position);
	}

	const quadrants = sortQudrants(board, finalPositions);

	return Array.from(quadrants.keys())
		.map((key) => quadrants?.get(key)?.length ?? 0)
		.reduce((a, c) => a * c, 1);
}

async function part2(data: string) {
	const outDir = `${os.homedir()}/output`;
	const board: Board = { rows: 103, cols: 101 }; // attempt board

	const robots: Robot[] = data
		.trim()
		.split("\n")
		.map((line) => {
			const [px, py, vx, vy] = line.match(/-?\d+/g)?.map(Number) ?? [];
			return new Robot({ x: px, y: py }, { dx: vx, dy: vy }, board);
		});

	const simulationsToRun = 6377;

	for (const robot of robots) {
		robot.move(simulationsToRun);
	}

	const finalPositions = robots
		.map((robot) => robot.position)
		.map(({ x, y }) => `${x},${y}`);

	const picture: string[][] = [];

	for (let y = 0; y < board.rows; y++) {
		const currentRow: string[] = [];
		for (let x = 0; x < board.cols; x++) {
			const cellKey = `${x},${y}`;
			if (finalPositions.includes(cellKey)) {
				currentRow.push("#");
			} else {
				currentRow.push(".");
			}
		}
		picture.push(currentRow);
	}

	const stringified = picture.map((row) => row.join("")).join("\n");

	console.log(stringified);

	fs.writeFileSync(
		`${outDir}/${String(simulationsToRun).padStart(5, "0")}.txt`,
		stringified,
	);

	return stringified;
}

// shamelessly copied from https://www.reddit.com/r/adventofcode/comments/1hdvhvu/comment/m20q56r/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button, verified in part2 above
function part2a(data: string) {
	let currentSeconds = 0;
	const board: Board = { rows: 103, cols: 101 };
	const robots: Robot[] = data
		.trim()
		.split("\n")
		.map((line) => {
			const [px, py, vx, vy] = line.match(/-?\d+/g)?.map(Number) ?? [];
			return new Robot({ x: px, y: py }, { dx: vx, dy: vy }, board);
		});

	const rowVarianceThres =
		(variance(robots.map((r) => r.position.y)) as unknown as number) * 0.5;
	const colVarianceThres =
		(variance(robots.map((r) => r.position.x)) as unknown as number) * 0.5;
	let rowLowVariance = 0;
	let colLowVariance = 0;

	while (rowLowVariance === 0 || rowLowVariance === 0) {
		currentSeconds += 1;
		for (const robot of robots) {
			robot.move();
		}

		const currentRowVariance: number = variance(
			robots.map((r) => r.position.y),
		) as unknown as number;

		const currentColVariance: number = variance(
			robots.map((r) => r.position.x),
		) as unknown as number;

		if (rowLowVariance === 0 && currentRowVariance < rowVarianceThres) {
			rowLowVariance = currentSeconds % board.rows;
		}
		if (colLowVariance === 0 && currentColVariance < colVarianceThres) {
			colLowVariance = currentSeconds % board.cols;
		}
	}

	let x = 1;
	let y = 1;
	while (true) {
		const leftSide = rowLowVariance + board.rows * x;
		const rightSide = colLowVariance + board.cols * y;
		if (leftSide === rightSide) {
			return leftSide;
		}
		if (leftSide < rightSide) {
			x += 1;
		} else {
			y += 1;
		}
	}
}

export default { 1: part1, 2: part2, 3: part2a };
