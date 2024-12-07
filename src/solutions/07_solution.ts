type Problem = {
	input: number[];
	output: number;
};

function parseInput(data: string): Problem[] {
	return data
		.trim()
		.split("\n")
		.map((line) => {
			const [output, input] = line.split(":");
			return {
				input: input.trim().split(" ").map(Number),
				output: Number(output),
			};
		});
}

function generateOpSets(nNumbers: number) {
	const nOperators: number = nNumbers - 1;
	const totalCombinations: number = 2 ** nOperators;

	const combinations: string[][] = [];
	for (let i = 0; i < totalCombinations; i++) {
		const binary = i.toString(2).padStart(nOperators, "0");
		const operators = binary.split("").map((bit) => (bit === "0" ? "*" : "+"));
		combinations.push(operators);
	}

	return combinations;
}

function generateTernaryOpSets(nNumbers: number) {
	const nOperators: number = nNumbers - 1;
	const totalCombinations: number = 3 ** nOperators;

	const combinations: string[][] = [];
	for (let i = 0; i < totalCombinations; i++) {
		const ternary = i.toString(3).padStart(nOperators, "0");
		const operators = ternary.split("").map((digit) => {
			switch (digit) {
				case "0":
					return "*";
				case "1":
					return "+";
				case "2":
					return "||";
				default:
					throw new Error("Invalid operator");
			}
		});
		combinations.push(operators);
	}

	return combinations;
}

function part1(data: string) {
	const problems = parseInput(data);

	const safe: Problem[] = [];
	for (const problem of problems) {
		const { input, output } = problem;
		const opSets = generateOpSets(input.length);
		for (const opSet of opSets) {
			if (evalExpr(input, opSet) === output) {
				safe.push(problem);
				break;
			}
		}
	}

	return safe.reduce((acc, { output }) => acc + output, 0);
}

function part2(data: string) {
	const problems = parseInput(data);

	const safe: Problem[] = [];
	for (const problem of problems) {
		const { input, output } = problem;
		const opSets = generateTernaryOpSets(input.length);
		for (const opSet of opSets) {
			if (evalExpr(input, opSet) === output) {
				safe.push(problem);
				break;
			}
		}
	}

	return safe.reduce((acc, { output }) => acc + output, 0);
}
export default { 1: part1, 2: part2 };

function evalExpr(input: number[], opSet: string[]): number {
	let res = input[0];

	for (let i = 0; i < opSet.length; i++) {
		const op = opSet[i];
		if (op === "+") {
			res = res + input[i + 1];
		} else if (op === "||") {
			res = Number(`${res}${input[i + 1]}`);
		} else {
			res = res * input[i + 1];
		}
	}

	return res;
}
