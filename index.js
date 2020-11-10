require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const userRoute = require('./Routes/userRoute');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms'),
);
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/users', userRoute);
app.use((req, res) => res.status(404).json({ error: 'Page not found' }));

mongoose
  .connect(process.env.API_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() =>
    app.listen(PORT, () => {
      console.log('Server started listening on port', PORT);
    }),
  )
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
