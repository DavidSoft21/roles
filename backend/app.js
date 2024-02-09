//variables
import express from "express";
import morgan from "morgan";
import cors from "cors";
import fileUpload from "express-fileupload";
import history from "connect-history-api-fallback";
import path from "path";

const app = express();

// middlewares
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));

// routes
app.use("/", require("./routes/auth.routes"));
app.use("/clientes", require("./routes/client.routes"));

// Middleware for Vue.js router mode history
app.use(history());
app.use(express.static(path.join(__dirname, "public")));

//settings
app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), () => {
  console.log("listening on port:", app.get("port"));
});
