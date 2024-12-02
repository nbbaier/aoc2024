export default async function (data: string) {
	const reports = data
		.trim()
		.split("\n")
		.map((r) => r.split(" ").map((i) => Number.parseInt(i)));

	let count = 0;

	for (const report of reports) {
		const directions: string[] = [];

		for (let i = 0; i < report.length - 1; i++) {
			const diff = report[i] - report[i + 1];

			if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {
				directions.length = 0;
				break;
			}

			directions.push(diff < 0 ? "down" : "up");
		}

		if (directions.length > 0 && new Set(directions).size === 1) {
			count++;
		}
	}
	return count;
}
