import type { DMMF } from "@prisma/generator-helper";
import type { Declarations } from "../lines.js";

export const processedEnums: Declarations[] = [];

export function processEnums(enums: Readonly<DMMF.DatamodelEnum[]>) {
	for (const e of enums) {
		processedEnums.push({
			name: e.name,
			value: stringifyEnum(e),
		});
	}

	Object.freeze(processedEnums);
}

function stringifyEnum(data: DMMF.DatamodelEnum) {
	return `"${data.values.map((v) => `'${v.name}'`).join(" | ")}"`;
}
