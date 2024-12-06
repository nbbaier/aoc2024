import { Command } from "@commander-js/extra-typings";
import { getAocData, loadData } from "./utils";

export const app = new Command().name("aoc-runner").option("-d, --debug"); // program type includes chained options and arguments

app.command("create <day>").action(async (dayArg) => {
	const code = `function part1(data: string) { return "part 1 not implemented"; }
function part2(data: string) { return "part 2 not implemented"; }
export default { 1: part1, 2: part2 };`;
	const day = Number.parseFloat(dayArg);
	await Bun.write(
		`${Bun.env.SOLUTIONS}/${String(day).padStart(2, "0")}_solution.ts`,
		code,
	);
});

app.command("fetch <day>").action(async (dayArg) => {
	try {
		const day = Number.parseFloat(dayArg);
		const res = await getAocData(day, 2024);
		const data = await res.text();
		await Bun.write(
			`${Bun.env.DATA}/${String(day).padStart(2, "0")}_data.txt`,
			data,
		);
		return;
	} catch (error) {
		console.error(error);
		return;
	}
});

app
	.command("test <day>")
	.option("-p, --part <n>")
	.action(async (dayArg, options) => {
		const day = Number.parseFloat(dayArg);
		const data = await loadData(day, true);
		const answer = await import(
			`@/solutions/${String(day).padStart(2, "0")}_solution`
		);

		console.log(await answer.default[options.part || 1](data));

		if (app.opts().debug) {
			console.log(`day: ${day}`);
			console.log("options:", options);
		}
	});

app
	.command("attempt <day>")
	.option("-p, --part <n>")
	.action(async (dayArg, options) => {
		const day = Number.parseFloat(dayArg);
		const data = await loadData(day, false);
		const answer = await import(
			`@/solutions/${String(day).padStart(2, "0")}_solution`
		);

		console.log(await answer.default[options.part || 1](data));

		if (app.opts().debug) {
			console.log(`day: ${day}`);
			console.log("options:", options);
		}
	});
