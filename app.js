require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");
const fileUpload = require("express-fileupload");
const auth = require("./middleware/authentication");
//
const connectDb = require("./db/connect");
// router
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
const customerRouter = require("./routes/cutomer");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1); //for huruko
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes //how long
    max: 100, // limit each IP to 100 requests per windowMs //how many
  })
);
app.use(express.json());
app.use(fileUpload());
// extra packages

// routes
app.use(helmet());
app.use(cors());
app.use(xss());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", customerRouter);
// app.use("/api/v1/", customerRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
// app.use("/upload",())
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
