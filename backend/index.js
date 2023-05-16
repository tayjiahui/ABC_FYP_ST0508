const app = require('./controller/app');

const PORT = process.env.PORT || 3000;
const frontend_PORT = 5000;

app.listen(PORT, (err) => {
  if (err) return console.log(`Cannot Listen on PORT: ${PORT}`);
  console.log(`Backend listening at http://localhost:${PORT}`);
  console.log(`Frontend listening at http://localhost:${frontend_PORT}`);
});