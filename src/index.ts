import fs from "node:fs/promises";
import { join } from "node:path";
import pkg from "@prisma/generator-helper";
import { processEnums } from "./generators/enum.js";
import { processPlain } from "./generators/plain.js";
import { processAllLines } from "./lines.js";

export const config = {
	output: "generated",
	fileName: "prismark.ts",
	enumSuffix: "_literal",
	plainSuffix: "_plain",
	nullish: "true",
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

		if (options.generator.config.enum_suffix) {
			config.enumSuffix = String(options.generator.config.enumSuffix);
		}

		if (options.generator.config.plain_suffix) {
			config.plainSuffix = String(options.generator.config.plainSuffix);
		}

		if (options.generator.config.nullish) {
			config.nullish = String(options.generator.config.nullish);
		}

		await fs.mkdir(directory, { recursive: true });

		processEnums(options.dmmf.datamodel.enums);
		processPlain(options.dmmf.datamodel.models);

		const lines = processAllLines();

		return fs.writeFile(join(directory, fileName), lines.join("\n"));
	},
});
