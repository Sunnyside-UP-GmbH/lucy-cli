import { Schema } from "effect";

export const userSchema = Schema.Struct({
	label: Schema.String,
	value: Schema.String,
});

export const userListSchema = Schema.mutable(Schema.Array(userSchema));

export const responseSchema = Schema.Struct({
	status: Schema.String,
	message: Schema.String,
});


export type UserList = typeof userListSchema.Type;

export type Response = typeof responseSchema.Type;