const app = require("./app")

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (err) return console.log(`Cannot Listen on PORT: ${PORT}`);
  console.log(`App listening at http://localhost:${PORT}`)
});