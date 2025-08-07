import { NextResponse } from "next/server";

export function createNextResponse() {
	let statusCode = 200;
	let responseBody: any = {};

	const res = {
		status(code: number) {
			statusCode = code;
			return this;
		},
		json(body: any) {
			responseBody = body;
			return this;
		},
		get response() {
			return NextResponse.json(responseBody, { status: statusCode });
		},
	};

	return res as any;
}