import {
	getReviewById,
	updateReview,
	deleteReview
} from "@/lib/controllers/reviewController";
import { withAuthAppRouter } from "@/lib/withAuthAppRouter";

// GET /api/reviews/:id
export const GET = withAuthAppRouter(async (req, { params }) => {
	return await getReviewById(req, params.id);
});

// PUT /api/reviews/:id
export const PUT = withAuthAppRouter(async (req, { params }) => {
	return await updateReview(req, params.id);
});

// DELETE /api/reviews/:id
export const DELETE = withAuthAppRouter(async (req, { params }) => {
	return await deleteReview(req, params.id);
});