import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@/generated/prism";
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from "../../types/auth";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET;

export function withAuth(
	handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
	return async (req: NextApiRequest, res: NextApiResponse) => {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res
				.status(401)
				.json({ message: "Not authorized, no token provided" });
		}

		const token = authHeader.split(" ")[1];

		if (!jwtSecret) {
			console.error(
				"JWT_SECRET is not defined in the environment variables"
			);
			return res
				.status(500)
				.json({ message: "Server configuration error" });
		}

		try {
			const decoded = jwt.verify(token, jwtSecret) as { id: string };
			const user = await prisma.user.findUnique({
				where: { id: decoded.id },
				select: { id: true, email: true, username: true },
			});

			if (!user)
				return res
					.status(401)
					.json({ message: "Not authorised, user not found" });

			(req as AuthenticatedRequest).user = user;
			await handler(req as AuthenticatedRequest, res);
		} catch (error: any) {
			console.error("JWT verification error:", error);
			if (error.name === "TokenExpiredError") {
				return res.status(401).json({ message: "Token Expired" });
			}
			if (error.name === "JsonWebTokenError") {
				return res.status(401).json({ message: "Invalid token" });
			}

            return res.status(500).json({ message: 'Authentication error' });
		}
	};
}
