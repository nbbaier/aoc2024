import type { Point } from "@/types";
import { checkOutOfBounds } from "@/utils";

interface Antenna {
	frequency: string;
	position: Point;
}

interface Antinode {
	position: Point;
}

function getPairs<T>(arr: T[]) {
	const pairs = [];
	for (let i = 0; i < arr.length; i++) {
		for (let j = i + 1; j < arr.length; j++) {
			pairs.push([arr[i], arr[j]]);
		}
	}
	return pairs;
}

function getFrequencoes(grid: string[][]): string[] {
	const frequencies: Set<string> = new Set();

	for (const row of grid) {
		for (const cell of row.filter((cell) => ![".", "#"].includes(cell))) {
			frequencies.add(cell);
		}
	}

	return [...frequencies];
}

function getAntennae(freq: string, grid: string[][]): Antenna[] {
	const antennae: Antenna[] = [];

	const rows = grid.length;
	const cols = grid[0].length;

	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			if (grid[y][x] === freq) {
				antennae.push({ frequency: freq, position: { x, y } });
			}
		}
	}

	return antennae;
}
function findAntinodes(a1: Point, a2: Point): Point[] {
	const antinodes: Point[] = [];

	const dx = a2.x - a1.x;
	const dy = a2.y - a1.y;

	const antinode1 = {
		x: Math.round(a2.x + dx),
		y: Math.round(a2.y + dy),
	};

	const antinode2 = {
		x: Math.round(a1.x - dx),
		y: Math.round(a1.y - dy),
	};

	return [antinode1, antinode2];
}

function part1(data: string) {
	const grid = data
		.trim()
		.split("\n")
		.map((line) => line.split(""));

	const freqs = getFrequencoes(grid);
	const antennae: { [key: string]: Antenna[] } = {};

	for (const freq of freqs) {
		antennae[freq] = getAntennae(freq, grid);
	}

	const antinodeSet = new Set<string>();
	const rows = grid.length;
	const cols = grid[0].length;

	for (const freq in antennae) {
		const freqArray = antennae[freq];
		const pairs = getPairs(freqArray);

		for (const pair of pairs) {
			const a1 = pair[0].position;
			const a2 = pair[1].position;

			const potentialAntinodes = findAntinodes(a1, a2);

			for (const antinode of potentialAntinodes) {
				if (checkOutOfBounds(antinode, rows, cols)) {
					antinodeSet.add(`${antinode.x},${antinode.y}`);
				}
			}
		}
	}

	return antinodeSet.size;
}

function isCollinear(p1: Point, p2: Point, p3: Point): boolean {
	return (p2.y - p1.y) * (p3.x - p1.x) === (p3.y - p1.y) * (p2.x - p1.x);
}

function part2(data: string) {
	const grid = data
		.trim()
		.split("\n")
		.map((line) => line.split(""));

	const freqs = getFrequencoes(grid);
	const antennae: { [key: string]: Antenna[] } = {};

	for (const freq of freqs) {
		antennae[freq] = getAntennae(freq, grid);
	}

	const antinodeSet = new Set<string>();
	const rows = grid.length;
	const cols = grid[0].length;

	for (const freq in antennae) {
		const freqArray = antennae[freq];
		const pairs = getPairs(freqArray);

		for (const pair of pairs) {
			const p1 = pair[0].position;
			const p2 = pair[1].position;

			const potentialAntinodes: Point[] = [];

			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < cols; x++) {
					const p3 = { x, y };
					if (isCollinear(p1, p2, p3)) {
						potentialAntinodes.push(p3);
					}
				}
			}

			for (const antinode of potentialAntinodes) {
				if (checkOutOfBounds(antinode, rows, cols)) {
					antinodeSet.add(`${antinode.x},${antinode.y}`);
				}
			}
		}
	}

	return antinodeSet.size;
}

export default { 1: part1, 2: part2 };
