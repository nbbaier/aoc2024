export default async function (data: string) {
	const mulRegex = /mul\((\d{1,3},\d{1,3})\)/g;

	const programs = data.trim().split("\n");

	let total = 0;
	for (const program of programs) {
		const matches = Array.from(program.matchAll(mulRegex));

		total += matches
			.map((match) => match[1].split(",").map(Number.parseFloat))
			.reduce((acc, [l, r]) => {
				return acc + l * r;
			}, 0);
	}

	return total;
}
