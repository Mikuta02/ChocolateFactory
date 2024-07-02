const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const factoryRoutes = require('./routes/factoryRoutes');
const chocolateRoutes = require('./routes/chocolateRoutes');
const cartRoutes = require('./routes/cartRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const customerTypeRoutes = require('./routes/customerTypeRoutes');

const app = express();
const port = 3001;

app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000']
}));
app.use(bodyParser.json());

const imagesPath = path.join(__dirname, 'images');
console.log(`Serving images from ${imagesPath}`);
app.use('/images', express.static(imagesPath));

app.use('/api', factoryRoutes);
app.use('/api', chocolateRoutes);
app.use('/api', cartRoutes);
app.use('/api', commentRoutes); 
app.use('/api', userRoutes); 
app.use('/api', purchaseRoutes);
app.use('/api', customerTypeRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

