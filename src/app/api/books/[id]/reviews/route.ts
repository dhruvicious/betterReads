import { addReview } from "@/lib/controllers/reviewController";
import { withAuthAppRouter } from "@/lib/withAuthAppRouter";
import { createNextResponse } from "@/lib/utils/nextResponse";

export const POST = withAuthAppRouter(
	async (req, { params }: { params: { id: string } }) => {
		const body = await req.json();
		const mockReq = { body, user: req.user } as any;
		return await addReview(mockReq, params.id);
	}
);