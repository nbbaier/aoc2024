function checkOrder(arr: string[], rule: string) {
	const [first, second] = rule.split("|");
	if (!arr.includes(first) || !arr.includes(second)) {
		return null;
	}
	return arr.indexOf(first) < arr.indexOf(second);
}

function getMiddleElement<T>(arr: T[]): T | null {
	if (arr.length === 0) {
		return null;
	}
	const middleIndex = Math.floor(arr.length / 2);
	return arr[middleIndex];
}

function validateUpdates(updates: string[][], rules: string[]) {
	const correctUpdates: string[][] = [];
	const incorrectUpdates: string[][] = [];

	for (const update of updates) {
		const ruleResults = [];
		for (const rule of rules) {
			const res = checkOrder(update, rule);
			ruleResults.push(res);
		}
		const verdict = ruleResults.filter((r) => r !== null).every(Boolean);
		if (verdict) {
			correctUpdates.push(update);
		} else {
			incorrectUpdates.push(update);
		}
	}

	return { correctUpdates, incorrectUpdates };
}

function part1(data: string) {
	const contents = data.trim().split("\n\n");
	const rules = contents[0].split("\n");
	const updates = contents[1].split("\n").map((update) => update.split(","));

	const { correctUpdates } = validateUpdates(updates, rules);

	return correctUpdates
		.map((update) => getMiddleElement(update))
		.reduce((acc, curr) => {
			return acc + (curr !== null ? Number.parseInt(curr) : 0);
		}, 0);
}

function part2(data: string) {
	const contents = data.trim().split("\n\n");
	const rules = contents[0].split("\n");
	const updates = contents[1].split("\n").map((update) => update.split(","));

	const { incorrectUpdates } = validateUpdates(updates, rules);

	return incorrectUpdates;
}

export default { 1: part1, 2: part2 };
