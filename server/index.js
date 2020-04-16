require('newrelic');

const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();

const REVIEWS_SERVER = 'http://54.214.131.42';

app.use(express.static(path.resolve(__dirname, '../public')));

app.get('/:id', (req, res) => {
  if (!req.params.id) {
    res.status(400);
    res.end();
  } else {
    res.sendFile('index.html', { root: path.resolve(__dirname, '../public') });
  }
});

app.get('/:id/reviews', (req, res) => {
  axios.get(`${REVIEWS_SERVER}/${req.params.id}/reviews`)
    .then((result) => {
      res.status(200);
      res.send(result.data);
    })
    .catch((err) => {
      res.status(500);
      res.end();
    });
});


app.listen(3000, () => {
  console.log('Open Table proxy server listening on port 3000!');
});
