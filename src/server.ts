import App from "@/app";
import AuthRoute from "@routes/auth.route";
import UsersRoute from "@routes/users.route";
import validateEnv from "@utils/validateEnv";
import BookRoute from "./routes/book.route";
import ReviewRoute from "./routes/review.route";

validateEnv();

const app = new App([
  new UsersRoute(),
  new AuthRoute(),
  new BookRoute(),
  new ReviewRoute(),
]);

app.listen();
