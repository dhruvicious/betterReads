import { deleteReview } from "@/lib/controllers/reviewController";
import { withAuthAppRouter } from "@/lib/withAuthAppRouter";

export const DELETE = withAuthAppRouter(
	async (req, { params }: { params: { id: string } }) => {
		const mockReq = { user: req.user } as any;
		return await deleteReview(mockReq, params.id);
	}
);