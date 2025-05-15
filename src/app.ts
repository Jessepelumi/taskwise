// App setup

import express from "express";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

// route middlewares
app.use("/api/users", userRoutes);

// error handler
app.use(errorHandler);

export default app;
