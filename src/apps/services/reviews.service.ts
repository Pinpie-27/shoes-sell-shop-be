import { reviewsModel } from "../models/reviews.model";

export interface Review{
    id: number;
    user_id: number;
    product_id: number;
    rating: number;
    comment: string;
    created_at: string; 
}

class ReviewsService{
    async getReviewById(id: number){
        return await reviewsModel.findById(id);
    }
    async getAllReviews(){
        return await reviewsModel.getAllReviews();
    }
    async createReview(newReview: Partial<Review>){
        return await reviewsModel.createReview(newReview);
    }
    async updateReview(id: number, updatedFields: Partial<Review>){
        return await reviewsModel.updateReview(id, updatedFields);
    }
    async deleteReview(id: number){
        return await reviewsModel.deleteReview(id);
    }
    async searchReviews(keyword: string){
        return await reviewsModel.findByReviewName(keyword);
    }
}
export const reviewsService = new ReviewsService();