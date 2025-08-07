import { NextApiRequest } from "next";

export interface AuthenticatedRequest extends Request {
	body: any;
	query?: any;
	user?: {
		id: string;
		username: string;
		email: string;
	};
}