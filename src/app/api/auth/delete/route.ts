import { deleteUser } from "@/lib/controllers/authController";
import { withAuthAppRouter } from "@/lib/withAuthAppRouter";

const handler = withAuthAppRouter(deleteUser);

export { handler as GET };