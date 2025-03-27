import {ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

export interface Review{
    id: number;
    user_id: number;
    product_id: number;
    rating: number;
    comment: string;
    created_at: string; 
}

class ReviewsModel{
    async findById(id:number) : Promise<Review>{
        const [reviews] = await db.query<Review[] & RowDataPacket[]>('SELECT * FROM reviews WHERE id = ?', [id]);
        return reviews[0] 
    }
    async getAllReviews() {
        const [reviews] = await db.query<Review[] & RowDataPacket[]>('SELECT * FROM reviews');
        return reviews;
    }

    async createReview(newReview: Partial<Review>): Promise<number> {
        const { user_id, product_id, rating, comment} = newReview;
    
        const [result] = await db.query(
            `INSERT INTO reviews (user_id, product_id, rating, comment) 
             VALUES (?, ?, ?, ?)`,
            [user_id, product_id, rating, comment]
        );
    
        return (result as ResultSetHeader & { insertId: number }).insertId;
    }

    async updateReview(id: number, updatedFields: Partial<Review>): Promise<boolean> {
        const fields = Object.keys(updatedFields).map(field => `${field} =?`).join(', ');
        const values = Object.values(updatedFields);
        values.push(id);

        const [result] = await db.query(
            `UPDATE reviews SET ${fields} WHERE id = ?`,
            [...values]
        );

        return (result as ResultSetHeader & { affectedRows: number }).affectedRows > 0;
    }

    async deleteReview(id: number): Promise<boolean> {
        const [result] = await db.query<ResultSetHeader>('DELETE FROM reviews WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    async findByReviewName(name: string) {
        const [reviews] = await db.query<Review[] & RowDataPacket[]>(
            'SELECT * FROM reviews WHERE name LIKE?',
            [`%${name}%`]
        );
        return reviews;
    }
}
export const reviewsModel = new ReviewsModel();