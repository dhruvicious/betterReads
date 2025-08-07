import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { AuthenticatedRequest } from "../../../types/auth";

// Create a review
export const addReview = async (req: AuthenticatedRequest, bookId: string) => {
	const { reviewText, rating } = req.body;
	const reviewerId = req.user?.id;

	if (!reviewerId) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	if (!reviewText || rating === undefined) {
		return NextResponse.json(
			{ message: "Both review text and rating are required." },
			{ status: 400 }
		);
	}

	if (rating < 1 || rating > 5) {
		return NextResponse.json(
			{ message: "Rating must be between 1 and 5." },
			{ status: 400 }
		);
	}

	try {
		const book = await prisma.book.findUnique({ where: { id: bookId } });
		if (!book) {
			return NextResponse.json({ message: "Book not found." }, { status: 404 });
		}

		const review = await prisma.review.create({
			data: {
				reviewText,
				rating,
				reviewerId,
				bookId,
			},
		});

		return NextResponse.json({ message: "Review created.", review }, { status: 201 });
	} catch (error: any) {
		console.error("Create review error:", error.message);
		return NextResponse.json({ message: "Server error." }, { status: 500 });
	}
};

// Get a single review by ID
export const getReviewById = async (req: AuthenticatedRequest, reviewId: string) => {
	try {
		const review = await prisma.review.findUnique({
			where: { id: reviewId },
			include: {
				book: true,
				reviewer: { select: { id: true, username: true, email: true } },
			},
		});

		if (!review) {
			return NextResponse.json({ message: "Review not found." }, { status: 404 });
		}

		return NextResponse.json({ review }, { status: 200 });
	} catch (error: any) {
		console.error("Get review error:", error.message);
		return NextResponse.json({ message: "Server error." }, { status: 500 });
	}
};

// Get all reviews for a specific book
export const getReviewsForBook = async (req: AuthenticatedRequest, bookId: string) => {
	try {
		const reviews = await prisma.review.findMany({
			where: { bookId },
			orderBy: { createdAt: "desc" },
			include: {
				reviewer: { select: { id: true, username: true } },
			},
		});

		return NextResponse.json({ reviews }, { status: 200 });
	} catch (error: any) {
		console.error("Get reviews error:", error.message);
		return NextResponse.json({ message: "Server error." }, { status: 500 });
	}
};

// Update an existing review (only if the user is the author)
export const updateReview = async (req: AuthenticatedRequest, reviewId: string) => {
	const { reviewText, rating } = req.body;
	const userId = req.user?.id;

	if (!userId) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const review = await prisma.review.findUnique({
			where: { id: reviewId },
			select: { reviewerId: true },
		});

		if (!review) {
			return NextResponse.json({ message: "Review not found." }, { status: 404 });
		}

		if (review.reviewerId !== userId) {
			return NextResponse.json({ message: "Forbidden" }, { status: 403 });
		}

		const updated = await prisma.review.update({
			where: { id: reviewId },
			data: { reviewText, rating },
		});

		return NextResponse.json({ message: "Review updated.", review: updated }, { status: 200 });
	} catch (error: any) {
		console.error("Update review error:", error.message);
		return NextResponse.json({ message: "Server error." }, { status: 500 });
	}
};

// Delete a review (only if the user is the author)
export const deleteReview = async (req: AuthenticatedRequest, reviewId: string) => {
	const userId = req.user?.id;

	if (!userId) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const review = await prisma.review.findUnique({
			where: { id: reviewId },
			select: { reviewerId: true },
		});

		if (!review) {
			return NextResponse.json({ message: "Review not found." }, { status: 404 });
		}

		if (review.reviewerId !== userId) {
			return NextResponse.json({ message: "Forbidden" }, { status: 403 });
		}

		await prisma.review.delete({ where: { id: reviewId } });

		return NextResponse.json({ message: "Review deleted." }, { status: 200 });
	} catch (error: any) {
		console.error("Delete review error:", error.message);
		return NextResponse.json({ message: "Server error." }, { status: 500 });
	}
};