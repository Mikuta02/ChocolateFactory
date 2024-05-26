const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const factoryRoutes = require('./routes/factoryRoutes');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', factoryRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});