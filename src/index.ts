import dotenv from "dotenv";
import express, { Request, Response } from 'express';
// import { routers } from './apps/routes/users.route';
import usersRouter from "./apps/routes/users.route";
import productsRouter from "./apps/routes/products.route";


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

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Backend is available');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// JSON WEB TOKEN 
