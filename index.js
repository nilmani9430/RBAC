
const express = require('express');
require("dotenv").config()
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const app = require('./config/express');
const authController = require('./controllers/Auth');


sequelize.sync({force:false}).then(() => {
  console.log('Database synchronized');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.clear()
  console.log(`Server is running on port ${PORT}`);
});
