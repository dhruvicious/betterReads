import { addBook, getBooks } from "@/lib/controllers/bookController";
import { withAuthAppRouter } from "@/lib/withAuthAppRouter";

const handlerAddBooks = withAuthAppRouter(addBook);

const handlerGetBooks= withAuthAppRouter(getBooks);

export { handlerAddBooks as POST };
export {handlerGetBooks as GET};