import { type } from "arktype";

export const test_literal = type.enumerated("prop1", "prop2");

export const posts_plain = type({
	id: "string",
	title: "string < 50",
	user_id: "string",
	created_at: "Date",
});

export const users_plain = type({
	id: "string",
	type: test_literal,
	name: "string < 50",
	string_arr: "string[]",
	enum_arr: test_literal.array(),
	"age?": "number | null",
});
