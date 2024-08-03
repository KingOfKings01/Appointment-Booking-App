const express = require('express');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', userRoutes);

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database connected and synced');
    app.listen(3000, () => {
      console.log('Server is running on http://localhost:3000');
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
