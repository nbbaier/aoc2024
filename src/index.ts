import { getAocData, loadData } from "@/utils";

const commands = ["try", "test", "fetch"];

function validate(args: string[]) {
	if (!commands.includes(args[0])) {
		throw new Error(`Use one of these commands: ${commands.join(", ")}`);
	}
	if (args.length < 2) {
		throw new Error("You didn't supply a day");
	}
}

async function main() {
	const [command, dayArg] = Bun.argv.slice(2);
	const day = Number.parseInt(dayArg);
	validate([command, dayArg]);

	if (command === "fetch") {
		const year = 2024;
		try {
			const res = await getAocData(day, year);

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
	}

	const mode = command === "test";
	const data = await loadData(day, mode);
	const answer = await import(
		`@/solutions/${String(day).padStart(2, "0")}_solution`
	);

	console.log(await answer.default(data));
}

main().catch((error) => {
	if (error instanceof Error) {
		console.error(error.message);
	}
});
