import type { DMMF } from "@prisma/generator-helper";
import { processedEnums } from "./enum.js";
import { config } from "../index.js";

const PrimitiveFields = [
	"Int",
	"BigInt",
	"Float",
	"Decimal",
	"String",
	"DateTime",
	"Json",
	"Boolean",
	"Bytes",
] as const;

const fieldTypeMap: Record<string, string> = {
	Int: "number",
	BigInt: "bigint",
	Float: "number",
	Decimal: "number",
	String: "string",
	DateTime: "Date",
	Json: "unknown",
	Boolean: "boolean",
	Bytes: "ArrayBuffer",
};

export class Field {
	private string = "";
	private maxLength?: number;

	constructor(private field: Partial<DMMF.Model["fields"][number]>) {
		const nativeType = this.field.nativeType;

		if (nativeType?.[0] === "VarChar") {
			const maxLength = parseInt(nativeType?.[1]?.[0]!);

			if (!isNaN(maxLength)) {
				this.maxLength = maxLength;
			}
		}
	}

	private processEnum() {
		const thisEnum = processedEnums.find((e) => e.name === this.field.type);

		if (!thisEnum) return false;

		this.string = thisEnum.name + config.enumSuffix;

		if (this.field.isList) {
			this.string += ".array()";
		}

		return true;
	}

	private processOptions() {
		if (this.maxLength) {
			this.string += ` < ${this.maxLength}`;
		}

		if (this.field.isList) {
			this.string += "[]";
		}

		if (!this.field.isRequired) {
			this.string += " | null";
		}
	}

	private processPlain(t: string | undefined) {
		if (!t) return false;

		this.string = t;

		this.processOptions();

		this.string = `"${this.string}"`;

		return true;
	}

	private getName() {
		if (this.field.isRequired || config.nullish !== "true") {
			return this.field.name;
		}

		return `"${this.field.name}?"`;
	}

	parse() {
		const isPrimitive =
			!!this.field.type && PrimitiveFields.includes(this.field.type as any);

		const success = isPrimitive
			? this.processPlain(fieldTypeMap[this.field.type!])
			: this.processEnum();

		if (!success) return null;

		return `${this.getName()}: ${this.string}`;
	}
}
