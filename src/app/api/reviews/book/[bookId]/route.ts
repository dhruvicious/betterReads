import { getReviewsForBook } from "@/lib/controllers/reviewController";
import { withAuthAppRouter } from "@/lib/withAuthAppRouter";

export const GET = withAuthAppRouter(async (req, { params }) => {
	return await getReviewsForBook(req, params.bookId);
});