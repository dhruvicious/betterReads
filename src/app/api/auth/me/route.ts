import { getMe } from "@/lib/controllers/authController";
import { withAuthAppRouter } from "@/lib/withAuthAppRouter";

const handler = withAuthAppRouter(getMe);

export { handler as GET };