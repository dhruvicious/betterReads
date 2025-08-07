import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { AuthenticatedRequest } from "../../../types/auth";

export async function addBook(req: AuthenticatedRequest) {
	const { title, author, genre } = await req.json();

	if (!title || !author || !genre) {
		return NextResponse.json(
			{ message: "Please provide title, author, and genre" },
			{ status: 400 }
		);
	}

	try {
		const existingBook = await prisma.book.findFirst({
			where: { title, author },
		});

		if (existingBook) {
			return NextResponse.json(
				{ message: "A book with this title and author already exists" },
				{ status: 409 }
			);
		}

		const newBook = await prisma.book.create({
			data: { title, author, genre },
		});

		return NextResponse.json(
			{ message: "Book added successfully", book: newBook },
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("Error Adding Book: ", error.message);
		return NextResponse.json(
			{ message: "Internal server error while adding book" },
			{ status: 500 }
		);
	}
}

export async function getBooks(req: Request) {
	const { searchParams } = new URL(req.url);

	const page = parseInt(searchParams.get("page") || "1");
	const limit = parseInt(searchParams.get("limit") || "10");
	const genre = searchParams.get("genre") || undefined;
	const author = searchParams.get("author") || undefined;

	const offset = (page - 1) * limit;

	try {
		const where: any = {};
		if (genre) where.genre = { contains: genre, mode: "insensitive" };
		if (author) where.author = { contains: author, mode: "insensitive" };

		const [books, totalBooks] = await Promise.all([
			prisma.book.findMany({
				where,
				skip: offset,
				take: limit,
				orderBy: { createdAt: "desc" },
				include: {
					reviews: { select: { rating: true } },
				},
			}),
			prisma.book.count({ where }),
		]);

		const formattedBooks = books.map((book: any) => {
			const averageRating =
				book.reviews.length > 0
					? book.reviews.reduce((acc: any, r: any) => acc + r.rating, 0) /
					  book.reviews.length
					: 0;
			return { ...book, averageRating: Number(averageRating.toFixed(2)) };
		});

		return NextResponse.json({
			books: formattedBooks,
			pagination: {
				totalBooks,
				totalPages: Math.ceil(totalBooks / limit),
				currentPage: page,
				limit,
			},
		});
	} catch (error: any) {
		console.error("Error fetching books: ", error.message);
		return NextResponse.json(
			{ message: "Internal server error while fetching books" },
			{ status: 500 }
		);
	}
}

export async function getBookById(req: Request) {
	const { searchParams } = new URL(req.url);
	const bookId = searchParams.get("id");

	if (!bookId) {
		return NextResponse.json({ message: "Book ID is required" }, { status: 400 });
	}

	try {
		const book = await prisma.book.findUnique({
			where: { id: bookId },
			include: {
				reviews: {
					orderBy: { createdAt: "desc" },
					include: { reviewer: { select: { username: true } } },
				},
			},
		});

		if (!book) {
			return NextResponse.json({ message: "Book not found." }, { status: 404 });
		}

		const averageRating =
			book.reviews.length > 0
				? book.reviews.reduce((acc: any, r: any) => acc + r.rating, 0) /
				  book.reviews.length
				: 0;

		return NextResponse.json({
			book: {
				...book,
				averageRating: Number(averageRating.toFixed(2)),
			},
			reviews: book.reviews.map((r: any) => ({
				id: r.id,
				review_text: r.review_text,
				rating: r.rating,
				createdAt: r.createdAt,
				reviewer_username: r.reviewer.username,
			})),
		});
	} catch (error: any) {
		console.error("Error fetching book details:", error.message);
		return NextResponse.json(
			{ message: "Server error while fetching book details." },
			{ status: 500 }
		);
	}
}

export async function deleteBook(req: AuthenticatedRequest) {
	const { searchParams } = new URL(req.url);
	const bookId = searchParams.get("id");
	const userId = req.user?.id;

	if (!userId) {
		return NextResponse.json(
			{ message: "Not Authorized! User ID missing" },
			{ status: 401 }
		);
	}

	if (!bookId) {
		return NextResponse.json(
			{ message: "Book ID is required" },
			{ status: 400 }
		);
	}

	try {
		const book = await prisma.book.findUnique({ where: { id: bookId } });

		if (!book) {
			return NextResponse.json({ message: "Book not found." }, { status: 404 });
		}

		await prisma.book.delete({ where: { id: bookId } });

		return NextResponse.json({
			message: "Book deleted successfully.",
		});
	} catch (error: any) {
		console.error("Error deleting book:", error.message);
		return NextResponse.json(
			{ message: "Internal server error while deleting book" },
			{ status: 500 }
		);
	}
}