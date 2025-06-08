import BaseRoute from "./base.route";
import authMiddleware from "@/middlewares/auth.middleware";
import ReviewController from "@/controllers/review.controller";

class ReviewRoute extends BaseRoute {
  constructor() {
    // Pass the base path for this route set to BaseRoute
    super(new ReviewController(), "/reviews");
    this.initializeRoutes();
  }

  override initializeRoutes(): void {
    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      this.controller.updateReview
    ); // Update a review by ID
    this.router.delete(
      `${this.path}/:id`,
      authMiddleware,
      this.controller.deleteReview
    ); // Delete a review by ID

    // this.router
    //   .route(`${this.path}/:id`)
    //   .delete(authMiddleware, this.controller.deleteReview) // Delete a review by ID
    //   .put(authMiddleware, this.controller.updateReview); // Update a review by ID)
  }
}

export default ReviewRoute;
