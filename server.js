const app = require("./src/app");

const connectDB = require("./src/utils/connectDB");
connectDB();

app.listen(5050, () => {
  console.log(`server is listening on http://localhost:${5050}`);
});
