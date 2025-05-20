import { Request, Response } from "express";
import { reviewsService } from "../services/reviews.service";

class ReviewsController {
  async getReviewsByProductId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await reviewsService.getReviewById(Number(id));
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Reviews not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async getAllReviews(req: Request, res: Response) {
    try {
      const result = await reviewsService.getAllReviews();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }

  async createReview(req: Request, res: Response): Promise<void> {
    try {
      const { product_id, rating, comment } = req.body;

      const user_id = req.user?.id;

      if (!user_id) {
        res.status(401).json({ message: "Unauthorized: No user info" });
      }

      const result = await reviewsService.createReview({
        user_id,
        product_id,
        rating,
        comment,
      });

      if (result) {
        res
          .status(201)
          .json({ message: "Review created successfully", reviewId: result });
      } else {
        res.status(400).json({ message: "Failed to create review" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }

  async updateReview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const reviewId = await reviewsService.getReviewById(Number(id));
      if (!reviewId) {
        res.status(404).json({ message: "Review not found" });
        return;
      }
      const updatedFields = req.body;
      const result = await reviewsService.updateReview(
        Number(id),
        updatedFields
      );
      if (result) {
        res.status(200).json({ message: "Review updated successfully" });
      } else {
        res.status(400).json({ message: "Failed to update review" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async deleteReview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const reviewId = await reviewsService.getReviewById(Number(id));
      if (!reviewId) {
        res.status(404).json({ message: "Review not found" });
        return;
      }
      const result = await reviewsService.deleteReview(Number(id));
      if (result) {
        res.status(200).json({ message: "Review deleted successfully" });
      } else {
        res.status(400).json({ message: "Failed to delete review" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }

  async searchReviews(req: Request, res: Response) {
    try {
      const { keyword } = req.query;
      const result = await reviewsService.searchReviews(String(keyword));
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
}

export const reviewsController = new ReviewsController();
