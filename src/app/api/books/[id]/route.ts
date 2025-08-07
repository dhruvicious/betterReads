import { getBookById, deleteBook } from "@/lib/controllers/bookController";
import { withAuthAppRouter } from "@/../../src/lib/withAuthAppRouter";


const handlerGetBookById = withAuthAppRouter(getBookById);

const handlerDeleteBooks = withAuthAppRouter(deleteBook);

export { handlerDeleteBooks as POST };
export { handlerGetBookById as GET };
