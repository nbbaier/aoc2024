/**
 * Recursively mutates a stone number according to specific rules for a given number of steps
 * @param stone - The stone number to mutate
 * @param steps - Number of mutation steps remaining
 * @param cache - Cache to store previously calculated results
 * @returns The total number of possible mutations after all steps
 */
function mutate(
	stone: number,
	steps: number,
	cache: Map<string, number>,
): number {
	// Create unique cache key for this stone/steps combination
	const cacheKey = `${stone}-${steps}`;

	// Return cached result if available
	if (cache.has(cacheKey)) {
		return cache.get(cacheKey) as number;
	}

	// Base case: when no steps remain, return 1 as there's only one possibility
	if (steps === 0) {
		return 1;
	}

	// Special case: when stone is 0, mutate to 1 and continue
	if (stone === 0) {
		const result: number = mutate(1, steps - 1, cache);
		cache.set(cacheKey, result);
		return result;
	}

	const str = stone.toString();
	const length = str.length;
	let result: number;

	// For even-length numbers, split into two halves and mutate each half
	if (length % 2 === 0) {
		const left = Number.parseInt(str.slice(0, length / 2));
		const right = Number.parseInt(str.slice(length / 2));
		result = mutate(left, steps - 1, cache) + mutate(right, steps - 1, cache);
	} else {
		// For odd-length numbers, multiply by 2024 and continue mutation
		result = mutate(stone * 2024, steps - 1, cache);
	}

	// Cache and return the result
	cache.set(cacheKey, result);
	return result;
}

function part1(data: string) {
	const stones = data.split(" ").map(Number);
	const cache = new Map<string, number>();
	return stones
		.map((stone) => mutate(stone, 25, cache))
		.reduce((a, c) => a + c, 0);
}

function part2(data: string) {
	const stones = data.split(" ").map(Number);
	const cache = new Map<string, number>();
	return stones
		.map((stone) => mutate(stone, 75, cache))
		.reduce((a, c) => a + c, 0);
}

export default { 1: part1, 2: part2 };
