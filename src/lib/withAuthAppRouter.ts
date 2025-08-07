import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/db";

const jwtSecret = process.env.JWT_SECRET;

export function withAuthAppRouter(
	handler: (req: any, context: { params: any }) => Promise<NextResponse>
) {
	return async (
		req: NextRequest,
		context: { params: any }
	): Promise<NextResponse> => {
		const authHeader = req.headers.get("authorization");
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return NextResponse.json(
				{ message: "Not authorized, no token provided" },
				{ status: 401 }
			);
		}

		const token = authHeader.split(" ")[1];

		if (!jwtSecret) {
			console.error("JWT_SECRET is not defined");
			return NextResponse.json(
				{ message: "Server config error" },
				{ status: 500 }
			);
		}

		try {
			const { payload } = await jwtVerify(token, new TextEncoder().encode(jwtSecret));
			const userId = payload.id as string;

			const user = await prisma.user.findUnique({
				where: { id: userId },
				select: { id: true, username: true, email: true },
			});

			if (!user) {
				return NextResponse.json({ message: "User not found" }, { status: 401 });
			}

			// inject user into request
			(req as any).user = user;

			// pass both req and context to handler
			return await handler(req, context);
		} catch (err: any) {
			console.error("JWT Error:", err);
			return NextResponse.json(
				{ message: "Token invalid or expired" },
				{ status: 401 }
			);
		}
	};
}