function mutate(
	stone: number,
	steps: number,
	cache: Map<string, number>,
): number {
	const cacheKey = `${stone}-${steps}`;

	if (cache.has(cacheKey)) {
		return cache.get(cacheKey) as number;
	}

	if (steps === 0) {
		return 1;
	}

	if (stone === 0) {
		const result: number = mutate(1, steps - 1, cache);
		cache.set(cacheKey, result);
		return result;
	}

	const str = stone.toString();
	const length = str.length;
	let result: number;

	if (length % 2 === 0) {
		const left = Number.parseInt(str.slice(0, length / 2));
		const right = Number.parseInt(str.slice(length / 2));
		result = mutate(left, steps - 1, cache) + mutate(right, steps - 1, cache);
	} else {
		result = mutate(stone * 2024, steps - 1, cache);
	}

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
