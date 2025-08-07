import { addReview } from "@/lib/controllers/reviewController";
import { withAuthAppRouter } from "@/lib/withAuthAppRouter";

const handlerAddReview = withAuthAppRouter(async (req) => {
	const { bookId } = await req.json();
	return await addReview(req, bookId);
});

export { handlerAddReview as POST };