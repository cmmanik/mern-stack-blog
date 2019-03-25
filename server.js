const express = require('express');
const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI;

mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log('Database Connect Succesfully');
    })
    .catch(err => {
        console.log(' Conntection fail', err);
    });
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Hello , Welcome'));

app.listen(port, () => console.log(`Server is running on port ${port}`));
