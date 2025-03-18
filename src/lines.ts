import { processedEnums } from "./generators/enum.js";
import { processedPlain } from "./generators/plain.js";
import { config } from "./index.js";

export type Declarations = {
	name: string;
	value: string;
};

const processedLines: string[] = [`import { type } from "arktype"\n`];

function generateLine(input: Declarations) {
	return `export const ${input.name} = ${input.value}\n`;
}

function process(declarations: Declarations[], suffix: string) {
	for (const declaration of declarations) {
		declaration.name = `${declaration.name}${suffix}`;

		processedLines.push(generateLine(declaration));
	}
}

export function processAllLines() {
	process(processedEnums, config.enumSuffix);
	process(processedPlain, config.plainSuffix);

	return processedLines;
}
