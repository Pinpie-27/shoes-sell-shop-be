import { Router } from "express";
import express from "express";
import { reviewsController } from "../controllers/reviews.controller";
import { authMiddleware } from "../controllers/authMiddleware";

const router = express.Router();

router.get("/review/:id", reviewsController.getReviewsByProductId);
router.get("/reviews", reviewsController.getAllReviews);
router.post(
  "/review",
  authMiddleware.verifyTokenBasic,
  reviewsController.createReview
);
router.put("/review/:id", reviewsController.updateReview);
router.delete("/review/:id", reviewsController.deleteReview);
router.get("/search/review", reviewsController.searchReviews);

export const routers = (app: Router) => {
  app.use("/api", router);
};

export default router;
