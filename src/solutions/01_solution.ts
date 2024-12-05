function part1(data: string) {
	const pairs = data.trim().split("\n");

	const left: number[] = [];
	const right: number[] = [];

	for (const pair of pairs) {
		const splitPair = pair.replace(/\s+/, " ").split(" ");
		left.push(Number.parseInt(splitPair[0]));
		right.push(Number.parseInt(splitPair[1]));
	}

	const leftSorted = left.sort();
	const rightSorted = right.sort();

	const absoluteDifferences = leftSorted.map((num, index) => {
		return Math.abs(num - rightSorted[index]);
	});

	const totalDifference = absoluteDifferences.reduce(
		(accumulator, currentValue) => {
			return accumulator + currentValue;
		},
		0,
	);

	return totalDifference;
}

export default { 1: part1 };
