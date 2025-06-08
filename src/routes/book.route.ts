import BaseRoute from "./base.route";
import authMiddleware from "@/middlewares/auth.middleware";
import BookController from "@/controllers/book.controller";
import ReviewController from "@/controllers/review.controller";

class BookRoute extends BaseRoute {
  public reviewController: any;

  constructor() {
    // Pass the base path for this route set to BaseRoute
    super(new BookController(), "/books");
    this.initializeRoutes();
  }

  override initializeRoutes(): void {
    this.reviewController = new ReviewController(); // Initialize the review controller

    // All routes are defined RELATIVE to the router's base path ("/books")
    this.router.post(`${this.path}`, authMiddleware, this.controller.addBook);
    this.router.get(`${this.path}`, this.controller.getAllBooks);
    this.router.get(`${this.path}/search`, this.controller.searchBooks); // GET /books/search
    this.router.route(`${this.path}/:id`).get(this.controller.getBookById); // GET /books/:id
    this.router.post(
      `${this.path}/:id/reviews`,
      authMiddleware,
      this.reviewController.submitReview
    ); // POST /books/:id/reviews
  }
}

export default BookRoute;
