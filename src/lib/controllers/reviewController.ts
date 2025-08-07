import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { AuthenticatedRequest } from "../../../types/auth";

// Add a new review to a book
export const addReview = async (req: AuthenticatedRequest, bookId: string) => {
	const { review_text, rating } = req.body;
	const reviewerId = req.user?.id;

	if (!reviewerId) {
		return NextResponse.json(
			{ message: "Not authorized, reviewer ID missing." },
			{ status: 401 }
		);
	}

	if (!review_text || rating === undefined) {
		return NextResponse.json(
			{ message: "Please provide both review text and a rating." },
			{ status: 400 }
		);
	}

	if (rating < 1 || rating > 5) {
		return NextResponse.json(
			{ message: "Rating must be between 1 and 5 stars." },
			{ status: 400 }
		);
	}

	try {
		const book = await prisma.book.findUnique({
			where: { id: bookId },
			select: { id: true },
		});

		if (!book) {
			return NextResponse.json(
				{ message: "Book not found." },
				{ status: 404 }
			);
		}

		const review = await prisma.review.create({
			data: {
				reviewText: review_text,
				rating,
				reviewerId,
				bookId,
			},
		});

		return NextResponse.json(
			{ message: "Review added successfully.", review },
			{ status: 201 }
		);
	} catch (error: any) {
		console.error("Error adding review:", error.message);
		return NextResponse.json(
			{ message: "Server error while adding review." },
			{ status: 500 }
		);
	}
};

// Delete an existing review
export const deleteReview = async (
	req: AuthenticatedRequest,
	reviewId: string
) => {
	const userId = req.user?.id;

	if (!userId) {
		return NextResponse.json(
			{ message: "Not authorized, user ID missing." },
			{ status: 401 }
		);
	}

	try {
		const review = await prisma.review.findUnique({
			where: { id: reviewId },
			select: { reviewerId: true },
		});

		if (!review) {
			return NextResponse.json(
				{ message: "Review not found." },
				{ status: 404 }
			);
		}

		if (review.reviewerId !== userId) {
			return NextResponse.json(
				{ message: "Not authorized to delete this review." },
				{ status: 403 }
			);
		}

		await prisma.review.delete({ where: { id: reviewId } });

		return NextResponse.json(
			{ message: "Review deleted successfully." },
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("Error deleting review:", error.message);
		return NextResponse.json(
			{ message: "Server error while deleting review." },
			{ status: 500 }
		);
	}
};