import express, { Express } from "express";
import { config } from "dotenv";

config();
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
