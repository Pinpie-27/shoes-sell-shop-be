import dotenv from "dotenv";
import express, { Request, Response } from 'express';
// import { routers } from './apps/routes/users.route';
import usersRouter from "./apps/routes/users.route";
import productsRouter from "./apps/routes/products.route";
import vipLevelsRouter from "./apps/routes/vip_levels.route";
import reviewsRouter from "./apps/routes/reviews.route";
import categoriesRouter from "./apps/routes/categories.route";
import colorsRouter from "./apps/routes/colors.route";
import colorVariantsRouter from "./apps/routes/color_variants.route";
import productImagesRouter from "./apps/routes/product_images.route";
import inventoryRouter from "./apps/routes/inventory.route";
import cartItemsRouter from "./apps/routes/cart_items.route";
import ordersRouter from "./apps/routes/orders.route";
import orderItemsRouter from "./apps/routes/order_items.route";
import productColorsRouter from "./apps/routes/product_colors.route";



dotenv.config();
const cors = require('cors')
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

// to prevent miss
app.use(cors());
// to create and assign cookies
app.use(cookieParser());  
// transfer Request and Response to json
app.use(express.json());

app.use(express.json());
// routers(app);
app.use("/api", usersRouter);
app.use("/api", productsRouter);
app.use("/api", vipLevelsRouter);

app.use("/api", reviewsRouter);
app.use("/api", categoriesRouter);

app.use("/api", colorsRouter);
app.use("/api", colorVariantsRouter);
app.use("/api", productImagesRouter);
app.use("/api", inventoryRouter);
app.use("/api", cartItemsRouter);
app.use("/api", ordersRouter);

app.use("/api", orderItemsRouter);
app.use("/api", productColorsRouter);



app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Backend is available');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// JSON WEB TOKEN 


