export type Point = {
	x: number;
	y: number;
};

export type Velocity = { dx: number; dy: number };

export interface Board {
	rows: number;
	cols: number;
}

export type Direction = {
	dx: number;
	dy: number;
};

export type DirLabel = "r" | "l" | "d" | "u" | "ur" | "dl" | "dr" | "ul";
export type DirectionSet = {
	[K in DirLabel]?: Direction;
};
