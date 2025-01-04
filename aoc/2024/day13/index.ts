import { lusolve } from "mathjs";

interface System {
	solutions: number[]; // [X, Y]
	xArgs: number[]; // [Xa, Xb]
	yArgs: number[]; // [Ya, Yb]
}

function createSystem(problem: string, offset = 0): System {
	const [lineA, lineB, prizeLine] = problem.split("\n");
	const buttonRegex = /Button [A-Z]: X\+(?<x>\d+), Y\+(?<y>\d+)/;
	const solutionRegex = /Prize: X=(?<x>\d+), Y=(?<y>\d+)/;

	const buttonA = buttonRegex.exec(lineA)?.groups as { x: string; y: string };
	const buttonB = buttonRegex.exec(lineB)?.groups as { x: string; y: string };
	const prize = solutionRegex.exec(prizeLine)?.groups as {
		x: string;
		y: string;
	};

	return {
		solutions: [Number(prize.x) + offset, Number(prize.y) + offset],
		xArgs: [Number(buttonA.x), Number(buttonB.x)],
		yArgs: [Number(buttonA.y), Number(buttonB.y)],
	};
}

function solveSystem(system: System) {
	const solved = lusolve(
		[system.xArgs, system.yArgs],
		system.solutions,
	) as number[][];

	const a = Math.round(solved[0][0]);
	const b = Math.round(solved[1][0]);

	const verified =
		system.solutions[0] === system.xArgs[0] * a + system.xArgs[1] * b &&
		system.solutions[1] === system.yArgs[0] * a + system.yArgs[1] * b;

	if (!verified) {
		return [0, 0];
	}

	return [a, b];
}

function part1(data: string) {
	let totalPresses = 0;
	for (const problem of data.trim().split("\n\n")) {
		const system = createSystem(problem);
		const presses = solveSystem(system);
		totalPresses += presses[0] * 3 + presses[1];
	}
	return totalPresses;
}
function part2(data: string) {
	let totalPresses = 0;
	for (const problem of data.trim().split("\n\n")) {
		const system = createSystem(problem, 10000000000000);
		const presses = solveSystem(system);
		totalPresses += presses[0] * 3 + presses[1];
	}
	return totalPresses;
}
export default { 1: part1, 2: part2 };
