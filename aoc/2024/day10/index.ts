class DirectedGridGraph<T extends number> {
	private grid: T[][];
	private adjacencyList: Map<string, Array<{ to: string; weight: number }>>;
	private nodeValues: Map<string, number>;
	private cols: number;
	private rows: number;

	constructor(grid: T[][]) {
		this.grid = grid;
		this.rows = this.grid.length;
		this.cols = this.grid[0].length;
		this.adjacencyList = new Map<
			string,
			Array<{ to: string; weight: number }>
		>();
		this.nodeValues = new Map<string, number>();
		this.buildDirectedGraph();
	}

	// Convert grid coordinates to a unique string key
	private getKey(x: number, y: number): string {
		return `${x},${y}`;
	}

	// Check if coordinates are within grid bounds
	private isValidCoordinate(x: number, y: number): boolean {
		return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
	}

	// Build the directed graph with weighted edges
	private buildDirectedGraph(): void {
		const directions = [
			[0, 1], // right
			[0, -1], // left
			[1, 0], // down
			[-1, 0], // up
		];

		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.cols; x++) {
				const currentKey = this.getKey(x, y);
				const currentValue = this.grid[y][x];

				// Ensure current vertex exists in adjacency list
				if (!this.adjacencyList.has(currentKey)) {
					this.adjacencyList.set(currentKey, []);
				}

				if (!this.nodeValues.has(currentKey)) {
					this.nodeValues.set(currentKey, currentValue);
				}

				// Check adjacent points
				for (const [dx, dy] of directions) {
					const newX = x + dx;
					const newY = y + dy;

					// Validate new coordinates
					if (this.isValidCoordinate(newX, newY)) {
						const adjacentValue = this.grid[newY][newX];
						const adjacentKey = this.getKey(newX, newY);

						// Create edge only if adjacent value is higher
						if (adjacentValue > currentValue) {
							this.adjacencyList.get(currentKey)?.push({
								to: adjacentKey,
								weight: adjacentValue - currentValue,
							});
						}
					}
				}
			}
		}
	}

	// Get neighbors of a specific coordinate with their edge details
	getNeighbors(x: number, y: number): Array<{ to: string; weight: number }> {
		const key = this.getKey(x, y);
		return this.adjacencyList.get(key) ?? [];
	}

	// Print the entire graph structure
	printGraph(): void {
		for (const [key, neighbors] of this.adjacencyList) {
			const neighborStrings = neighbors.map(
				(n) => `${n.to} (weight: ${n.weight})`,
			);
			console.log(`${key} -> ${neighborStrings.join(", ")}`);
		}
	}

	// Get the value at a specific coordinate
	getValue(x: number, y: number): T {
		return this.grid[y][x];
	}

	findValues(value: number): string[] {
		return Array.from(this.nodeValues.entries())
			.filter(([k, v]) => v === value)
			.map(([k, _]) => k);
	}

	// Find all paths from a start point that increase in value
	findIncreasingPaths(startX: number, startY: number): string[][] {
		const paths: string[][] = [];
		const startKey = this.getKey(startX, startY);

		const dfs = (currentKey: string, currentPath: string[]) => {
			const neighbors = this.adjacencyList.get(currentKey) ?? [];

			if (neighbors.length === 0) {
				paths.push([...currentPath]);
				return;
			}

			for (const neighbor of neighbors) {
				dfs(neighbor.to, [...currentPath, neighbor.to]);
			}
		};

		dfs(startKey, [startKey]);
		return paths;
	}
}

function part1(data: string) {
	const grid = data
		.trim()
		.split("\n")
		.map((line) => line.split("").map(Number));

	const graph = new DirectedGridGraph(grid);

	const trailheads = graph.findValues(0);
	const scores = [];

	for (const trailhead of trailheads) {
		const [x, y] = trailhead.split(",").map(Number);
		const score = new Set(
			graph
				.findIncreasingPaths(x, y)
				.filter((p) => p.length === 10)
				.flatMap((path) => path.slice(-1)),
		).size;
		scores.push(score);
	}
	return scores.reduce((a, c) => a + c, 0);
}

function part2(data: string) {
	const grid = data
		.trim()
		.split("\n")
		.map((line) => line.split("").map(Number));

	const graph = new DirectedGridGraph(grid);

	const trailheads = graph.findValues(0);
	const scores = [];

	for (const trailhead of trailheads) {
		const [x, y] = trailhead.split(",").map(Number);
		const score = graph
			.findIncreasingPaths(x, y)
			.filter((p) => p.length === 10).length;
		scores.push(score);
	}

	return scores.reduce((a, c) => a + c, 0);
}

export default { 1: part1, 2: part2 };
