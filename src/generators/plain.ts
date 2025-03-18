import type { DMMF } from "@prisma/generator-helper";
import type { Declarations } from "../lines.js";
import { Field } from "./field.js";

export const processedPlain: Declarations[] = [];

export function processPlain(models: DMMF.Model[] | Readonly<DMMF.Model[]>) {
	for (const model of models) {
		const value = stringifyPlain(model);

		if (value) {
			processedPlain.push({ name: model.name, value });
		}
	}

	Object.freeze(processedPlain);
}

function stringifyPlain(data: DMMF.Model): string {
	const fields: string[] = [];

	for (const field of data.fields) {
		const parsed = new Field(field).parse();

		if (parsed) fields.push(parsed);
	}

	if (!fields.length) return "";

	const joined = fields.join(",");

	const value = `{ ${joined} }`;

	return `type(${value})`;
}
