import path from "node:path";

export const getAocData = async (day: number, year: number) => {
	return await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
		headers: {
			Cookie: Bun.env.AOC_TOKEN,
		},
	});
};

export async function loadData(day: number, example = false) {
	const dayString = String(day).padStart(2, "0");
	const fileName = example
		? `${dayString}_example.txt`
		: `${dayString}_data.txt`;
	const dataPath = path.join(Bun.env.DATA, fileName);
	const file = Bun.file(dataPath);

	return await file.text();
}
