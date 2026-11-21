const app = require('./app');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Intelligent Test Plan Backend running on http://localhost:${PORT}`);
});
