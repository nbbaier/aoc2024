function decodeBlocks(disk: string[]): string[][] {
	return disk.map((item, index) => {
		let blockType: string;
		if ((index + 1) % 2 === 0) {
			blockType = ".";
		} else {
			blockType = String(Math.floor(index / 2));
		}

		return new Array(Number(item)).fill(blockType);
	});
}

function getLast<T>(array: T[], str: string): number | undefined {
	for (let i = array.length - 1; i >= 0; i--) {
		if (array[i] !== str) {
			return i;
		}
	}
	return undefined;
}

function part1(data: string) {
	const disk = data.trim().split("");
	const decoded = decodeBlocks(disk).flat();
	const rearranged = decoded;

	for (let i = 0; i < rearranged.length; i++) {
		if (rearranged[i] !== ".") {
			continue;
		}
		const endOfArray = rearranged.slice(i);
		if (endOfArray.filter((n) => n !== ".").length === 0) break;

		const last = getLast(rearranged, ".") as number;
		[rearranged[i], rearranged[last]] = [rearranged[last], rearranged[i]];
	}

	const checksum = rearranged
		.filter((n) => n !== ".")
		.map(Number)
		.reduce((a, v, i) => {
			return a + v * i;
		}, 0);

	return checksum;
}

function part2(data: string) {
	const disk = data.trim().split("");
	const decoded = decodeBlocks(disk).filter((block) => block.length > 0);

	const flattenedBlocks = decoded.flat();

	const fileLengths: number[] = disk
		.filter((_, index) => index % 2 === 0)
		.map(Number);

	for (let fileId = fileLengths.length - 1; fileId >= 0; fileId--) {
		const filePositions = flattenedBlocks.reduce((acc, block, index) => {
			if (block === String(fileId)) acc.push(index);
			return acc;
		}, [] as number[]);

		if (filePositions.length === 0) continue;

		const currentFileStart = filePositions[0];
		const fileLength = fileLengths[fileId];

		let bestMoveIndex = -1;
		let consecutiveFreeSpace = 0;
		for (let i = 0; i < currentFileStart; i++) {
			if (flattenedBlocks[i] === ".") {
				consecutiveFreeSpace++;

				if (consecutiveFreeSpace === fileLength) {
					bestMoveIndex = i - fileLength + 1;
					break;
				}
			} else {
				consecutiveFreeSpace = 0;
			}
		}

		if (bestMoveIndex !== -1) {
			const file = flattenedBlocks.splice(currentFileStart, fileLength);

			const replacementDots = new Array(fileLength).fill(".");
			flattenedBlocks.splice(currentFileStart, 0, ...replacementDots);
			flattenedBlocks.splice(bestMoveIndex, fileLength, ...file);
		}
	}

	return flattenedBlocks
		.map((n) => (n !== "." ? Number(n) : 0))
		.reduce((a, v, i) => {
			return a + v * i;
		}, 0);
}

export default { 1: part1, 2: part2 };
