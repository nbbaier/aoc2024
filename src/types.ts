declare module "bun" {
	interface Env {
		DATA: string;
		SOLUTIONS: string;
		AOC_TOKEN: string;
	}
}

export type Point = {
	x: number;
	y: number;
};

export type Direction = {
	dx: number;
	dy: number;
};

export type DirLabel = "r" | "l" | "d" | "u" | "ur" | "dl" | "dr" | "ul";
export type DirectionSet = {
	[K in DirLabel]?: Direction;
};
