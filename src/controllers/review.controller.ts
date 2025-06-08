import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import ReviewModel from "@models/Review.model";
import BookModel from "@models/Book.model";
import { IReview } from "@interfaces/review.interface";
import { IBook } from "@/interfaces/book.interface";

class ReviewController {
  public submitReview = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { id } = req.params; // Book ID
    const { rating, comment } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated." });
      return;
    }

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid book ID" });
      return;
    }

    try {
      const book: IBook = await BookModel.findById(id);
      if (!book) {
        res.status(404).json({ message: "Book not found" });
        return;
      }

      const existingReview: IReview | null = await ReviewModel.findOne({
        book: id,
        user: userId,
      });
      if (existingReview) {
        res.status(400).json({
          message: "You have already submitted a review for this book.",
        });
        return;
      }

      const review: IReview = new ReviewModel({
        book: id,
        user: userId,
        rating,
        comment,
      }) as unknown as IReview;

      const createdReview: IReview = await review.save();
      res.status(201).json(createdReview);
    } catch (error: any) {
      // Handle unique key error (if somehow the compound index fails due to race condition)
      if (error.code === 11000) {
        res.status(400).json({
          message: "You have already submitted a review for this book.",
        });
        return;
      }
      res.status(500).json({ message: error.message });
    }
  };

  public updateReview = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { id } = req.params; // Review ID
    const { rating, comment } = req.body;
    const userId = req.user?._id; // From authMiddleware

    if (!userId) {
      res.status(401).json({ message: "User not authenticated." });
      return;
    }

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid review ID" });
      return;
    }

    try {
      const review: IReview = await ReviewModel.findById(id);

      if (!review) {
        res.status(404).json({ message: "Review not found" });
        return;
      }

      // Ensure the user is the owner of the review
      if (review.user.toString() !== userId.toString()) {
        res
          .status(403)
          .json({ message: "Not authorized to update this review" });
        return;
      }

      review.rating = rating !== undefined ? rating : review.rating;
      review.comment = comment !== undefined ? comment : review.comment;

      const updatedReview: IReview = await review.save();
      res.json(updatedReview);
    } catch (error: any) {
      next(error);
      // res.status(500).json({ message: error.message });
    }
  };

  public deleteReview = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { id } = req.params; // Review ID
    const userId = req.user?._id; // From authMiddleware

    if (!userId) {
      res.status(401).json({ message: "User not authenticated." });
      return;
    }

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid review ID" });
      return;
    }

    try {
      const review: IReview = await ReviewModel.findById(id);

      if (!review) {
        res.status(404).json({ message: "Review not found" });
        return;
      }

      // Ensure the user is the owner of the review
      if (review.user.toString() !== userId.toString()) {
        res
          .status(403)
          .json({ message: "Not authorized to delete this review" });
        return;
      }

      await ReviewModel.deleteOne({ _id: id });
      res.json({ message: "Review removed" });
    } catch (error: any) {
      next(error);
      // res.status(500).json({ message: error.message });
    }
  };
}
export default ReviewController;
