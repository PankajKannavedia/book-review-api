import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import Book from "@models/Book.model";
import Review from "@models/Review.model";
import { IBook } from "@/interfaces/book.interface";
import { IReview } from "@/interfaces/review.interface";
import BookModel from "@models/Book.model";
import ReviewModel from "@models/Review.model";

class BookController {
  public addBook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { title, author, genre, publicationYear, description } = req.body;
      const book: IBook = new BookModel({
        title,
        author,
        genre,
        publicationYear,
        description,
      });

      const createdBook: IBook = await book.save();
      res.status(201).json(createdBook);
    } catch (error) {
      next(error);
    }
  };

  public getAllBooks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const skip: number = (page - 1) * limit;

    const filter: { [key: string]: any } = {};
    if (req.query.author) {
      filter.author = { $regex: req.query.author, $options: "i" };
    }
    if (req.query.genre) {
      filter.genre = { $regex: req.query.genre, $options: "i" };
    }

    try {
      const books: IBook[] | any = await Book.find(filter)
        .skip(skip)
        .limit(limit);
      const totalBooks: number = await Book.countDocuments(filter);

      res.json({
        books,
        currentPage: page,
        totalPages: Math.ceil(totalBooks / limit),
        totalBooks,
      });
    } catch (error) {
      next(error);
    }
  };

  public getBookById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { id } = req.params;
    const reviewPage: number = parseInt(req.query.reviewPage as string) || 1;
    const reviewLimit: number = parseInt(req.query.reviewLimit as string) || 5;
    const reviewSkip: number = (reviewPage - 1) * reviewLimit;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid book ID" });
      return;
    }

    try {
      const book: IBook | null = await Book.findById(id);

      if (!book) {
        res.status(404).json({ message: "Book not found" });
        return;
      }

      const reviews: IReview[] = (await ReviewModel.find({ book: id })
        .populate("user", "username")
        .skip(reviewSkip)
        .limit(reviewLimit)) as unknown as IReview[];

      const totalReviews: number = await Review.countDocuments({ book: id });

      const averageRatingResult = await Review.aggregate<{
        _id: null;
        averageRating: number;
      }>([
        { $match: { book: new Types.ObjectId(id) } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
          },
        },
      ]);

      const averageRating: number =
        averageRatingResult.length > 0
          ? averageRatingResult[0].averageRating
          : 0;

      res.json({
        book,
        averageRating: parseFloat(averageRating.toFixed(2)),
        reviews: {
          reviews,
          currentPage: reviewPage,
          totalPages: Math.ceil(totalReviews / reviewLimit),
          totalReviews,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public searchBooks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { query } = req.query;

    if (!query) {
      res.status(400).json({ message: "Please provide a search query." });
      return;
    }

    try {
      const books: IBook[] = await Book.find({
        $or: [
          { title: { $regex: query as string, $options: "i" } },
          { author: { $regex: query as string, $options: "i" } },
        ],
      });
      res.json(books);
    } catch (error) {
      next(error);
    }
  };
}
export default BookController;
