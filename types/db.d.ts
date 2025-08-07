export interface User {
	id: string;
	username: string;
	email: string;
	password?: string;
	created_at: Date;
}

export interface Book {
	id: string;
	title: string;
	author: string;
	genre: string;
	created_at: Date;
	average_rating?: number;
}

export interface Review {
	id: stirng;
	bookId: string;
	reviewerId: string;
	reviewText: string;
	rating: number;
	created_at: Date;
	reviewerUsername?: string;
}
