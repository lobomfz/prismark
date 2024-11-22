import fs from "node:fs/promises";
import { join } from "node:path";
import pkg from "@prisma/generator-helper";
import { processEnums } from "./generators/enum.js";
import { processAllLines } from "./lines.js";

export const config = {
	output: "generated",
	fileName: "prismark.ts",
};

pkg.generatorHandler({
	onManifest() {
		return {
			defaultOutput: "./prismark",
			prettyName: "prismark",
		};
	},

	async onGenerate(options) {
		const fileName = String(
			options.generator.config.fileName ?? config.fileName,
		);

		const directory = options.generator.output?.value ?? config.output;

		await fs.mkdir(directory, { recursive: true });

		processEnums(options.dmmf.datamodel.enums);

		const lines = processAllLines();

		return fs.writeFile(join(directory, fileName), lines.join("\n"));
	},
});
