import { createGrid, dfs } from "@/utils";

function getCoordinates(side: string, direction: "h" | "v") {
	const cleanSide = side.replace(/\(|\)/g, "");
	const [_, end] = cleanSide.split(" | ");
	const [x, y] = end.split(",");
	if (direction === "h") {
		return Number(y);
	}

	return Number(x);
}

export function sortSegments(segments: Set<string>): {
	hSegments: Set<string>;
	vSegments: Set<string>;
} {
	const hSegments = new Set<string>();
	const vSegments = new Set<string>();

	for (const segment of segments) {
		const [start, end] = segment.replace(/\(|\)/g, "").split(" | ");
		const [startX, _startY] = start.split(",").map(Number);
		const [endX, _endY] = end.split(",").map(Number);
		const isHorizontal = startX === endX;
		if (isHorizontal) {
			hSegments.add(segment);
		} else {
			vSegments.add(segment);
		}
	}

	return { hSegments, vSegments };
}

export function isStraight(region: string[]) {
	const xDim = new Set<number>();
	const yDim = new Set<number>();

	for (const square of region) {
		const [x, y] = square.split(",").map(Number);
		xDim.add(x);
		yDim.add(y);
	}

	return xDim.size === 1 || yDim.size === 1;
}

export function createSideCount(segments: Set<string>, direction: "h" | "v") {
	let sideCount = 0;

	const coords = Array.from(
		new Set([...segments].map((seg) => getCoordinates(seg, direction))),
	);

	const toProcess = createProcessableSides(segments, coords, direction);

	const sides = createSides(
		toProcess,
		direction === "h" ? { dx: 1, dy: 0 } : { dx: 0, dy: 1 },
	);
	sideCount += sides.length;

	return { sideCount, direction };
}

function createProcessableSides(
	segments: Set<string>,
	coords: number[],
	direction: "h" | "v",
) {
	const allToProcess = []; // Store all toProcess results
	for (const value of coords) {
		const toProcess = [...segments]
			.map((side) => {
				const [start, end] = side
					.replace(/\(|\)/g, "")
					.split(" | ")
					.map((s) => ({
						x: Number(s.split(",")[0]),
						y: Number(s.split(",")[1]),
					}));
				return { start, end };
			})
			.filter((s) => {
				return direction === "h" ? s.end.y === value : s.end.x === value;
			});
		allToProcess.push(...toProcess); // Collect toProcess results
	}

	return allToProcess; // Return the collected results
}

function createSides(
	toProcess: {
		start: { x: number; y: number };
		end: { x: number; y: number };
	}[],
	dir: { dx: number; dy: number },
): Array<typeof toProcess> {
	const visited = new Set<string>();
	const sides: Array<typeof toProcess> = [];

	for (let i = 0; i < toProcess.length; i++) {
		const nodeKey = JSON.stringify(toProcess[i]);
		if (visited.has(nodeKey)) continue;

		const currentSide: typeof toProcess = [];
		let currentIndex = i;

		while (currentIndex < toProcess.length) {
			const current = toProcess[currentIndex];
			const currentKey = JSON.stringify(current);

			if (visited.has(currentKey)) break;

			currentSide.push(current);
			visited.add(currentKey);

			const next = toProcess.find(
				(seg) =>
					seg.start.x === current.start.x + dir.dx &&
					seg.start.y === current.start.y + dir.dy &&
					seg.end.x === current.end.x + dir.dx &&
					seg.end.y === current.end.y + dir.dy,
			);

			if (next) {
				currentIndex = toProcess.findIndex(
					(seg) => JSON.stringify(seg) === JSON.stringify(next),
				);
			} else {
				break;
			}
		}

		if (currentSide.length > 0) {
			sides.push(currentSide);
		}
	}

	return sides;
}

export function getPerimeterSegments(region: string[]): Set<string> {
	const segments = new Set<string>();
	const directions = [
		{ dx: -1, dy: 0 }, // left
		{ dx: 0, dy: -1 }, // up
		{ dx: 0, dy: 1 }, // down
		{ dx: 1, dy: 0 }, // right
	];

	for (const square of region) {
		const [x, y] = square.split(",").map(Number);

		for (const dir of directions) {
			const adjX = x + dir.dx;
			const adjY = y + dir.dy;

			if (!region.includes(`${adjX},${adjY}`)) {
				segments.add(`(${x},${y}) | (${adjX},${adjY})`);
			}
		}
	}

	return segments;
}

export function getUniqueRegions(regions: string[][]): string[][] {
	return [...new Set(regions.map((region) => JSON.stringify(region)))].map(
		(region) => JSON.parse(region),
	);
}

function part1(data: string) {
	const grid = createGrid(data);

	const rows = grid.length;
	const cols = grid[0].length;

	const regions: string[][] = [];

	for (let x = 0; x < rows; x++) {
		for (let y = 0; y < cols; y++) {
			regions.push(dfs(grid, { x, y }).sort());
		}
	}

	const unique = getUniqueRegions(regions).map((region) => {
		const [x, y] = region[0].split(",").map(Number);
		const type = grid[y][x];
		const perimSegments = getPerimeterSegments(region);
		const perimeter = perimSegments.size;
		const area = region.length;
		const price = perimeter * area;

		return {
			type,
			region,
			perimeter,
			area,
			price,
		};
	});
	return unique.reduce((a, c) => a + c.price, 0);
}

function part2(data: string) {
	const grid = createGrid(data);
	const rows = grid.length;
	const cols = grid[0].length;

	const regions: string[][] = [];

	for (let x = 0; x < rows; x++) {
		for (let y = 0; y < cols; y++) {
			regions.push(dfs(grid, { x, y }).sort());
		}
	}

	const unique = getUniqueRegions(regions).map((region) => {
		const [x, y] = region[0].split(",").map(Number);
		const type = grid[y][x];
		const area = region.length;

		if (area <= 2 || isStraight(region)) {
			const sides = 4;
			return {
				type,
				region,
				area,
				sides,
				price: area * sides,
				calculated: false,
			};
		}

		const segments = getPerimeterSegments(region);
		const { vSegments, hSegments } = sortSegments(segments);
		const hSideResult = createSideCount(hSegments, "h");
		const vSideResult = createSideCount(vSegments, "v");
		const sides = hSideResult.sideCount + vSideResult.sideCount;

		return { type, region, area, sides, price: area * sides, calculated: true };
	});

	return unique.reduce((a, c) => a + c.price, 0);
}

export default { 1: part1, 2: part2 };
