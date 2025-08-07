import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { AuthenticatedRequest } from "../../../types/auth";

const generateToken = (id: string, email: string, username: string): string => {
	const secret = process.env.JWT_SECRET;
	const expiresIn = (process.env.JWT_EXPIRES_IN ||
		"1h") as jwt.SignOptions["expiresIn"];

	if (!secret) throw new Error("JWT_SECRET is not defined");

	return jwt.sign({ id, email, username }, secret, { expiresIn });
};

export async function signUp(req: Request) {
	const { username, email, password } = await req.json();

	if (!username || !email || !password) {
		return NextResponse.json(
			{ message: "Please enter all fields" },
			{ status: 400 }
		);
	}

	try {
		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [{ email }, { username }],
			},
		});

		if (existingUser) {
			return NextResponse.json(
				{ message: "User with that email or username already exists" },
				{ status: 400 }
			);
		}

		const hashedPassword = await bcrypt.hash(
			password,
			Number(process.env.SEED || 10)
		);

		const newUser = await prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
			},
			select: {
				id: true,
				username: true,
				email: true,
			},
		});

		const token = generateToken(
			newUser.id,
			newUser.email,
			newUser.username
		);

		return NextResponse.json(
			{
				message: "New user registered successfully",
				user: newUser,
				token,
			},
			{ status: 201 }
		);
	} catch (error: any) {
		console.error("Signup Error:", error.message);
		return NextResponse.json(
			{ message: "Internal Server Error during signup" },
			{ status: 500 }
		);
	}
}

export async function login(req: Request) {
	const { email, password } = await req.json();

	if (!email || !password) {
		return NextResponse.json(
			{ message: "Please enter all fields" },
			{ status: 400 }
		);
	}

	try {
		const user = await prisma.user.findUnique({ where: { email } });

		if (!user || !user.password) {
			return NextResponse.json(
				{ message: "Invalid credentials" },
				{ status: 400 }
			);
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return NextResponse.json(
				{ message: "Invalid credentials" },
				{ status: 400 }
			);
		}

		const token = generateToken(user.id, user.email, user.username);

		return NextResponse.json(
			{
				message: "Login successful",
				user: {
					id: user.id,
					email: user.email,
					username: user.username,
				},
				token,
			},
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("Login error:", error.message);
		return NextResponse.json(
			{ message: "Internal Server Error during login" },
			{ status: 500 }
		);
	}
}

export async function getMe(req: AuthenticatedRequest) {
	if (!req.user) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	return NextResponse.json({
		id: req.user.id,
		email: req.user.email,
		username: req.user.username,
	});
}

export async function deleteUser(req: AuthenticatedRequest) {
	const userId = req.user?.id;

	if (!userId) {
		return NextResponse.json(
			{ message: "Not Authorized" },
			{ status: 401 }
		);
	}

	try {
		await prisma.user.delete({ where: { id: userId } });
		return NextResponse.json({
			message: "User account deleted successfully",
		});
	} catch (error: any) {
		console.error("Delete error:", error.message);
		return NextResponse.json(
			{ message: "Server error while deleting user" },
			{ status: 500 }
		);
	}
}
