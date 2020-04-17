require('newrelic');

const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const redis = require('redis');
const redisClient = redis.createClient();

const REVIEWS_SERVER = 'http://54.214.131.42';
const MENU_SERVER = 'http://54.186.26.38';
const RESERVATIONS_SERVER = 'http://35.163.170.86';

app.use(express.static(path.resolve(__dirname, '../public')));

app.get('/loaderio-888c9cc15f684f466e7698a5b3a3c193', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'loaderio-888c9cc15f684f466e7698a5b3a3c193.txt'));
});


app.get('/:id', (req, res) => {
  if (!req.params.id) {
    res.status(400);
    res.end();
  } else {
    res.sendFile('index.html', { root: path.resolve(__dirname, '../public') });
  }
});


app.get('/:id/reviews', (req, res) => {
  redisClient.get(req.params.id, (err, cached) => {
    if (cached) {
      res.status(200);
      res.send(cached);
    } else {
      axios.get(`${REVIEWS_SERVER}/${req.params.id}/reviews`)
        .then((result) => {
          redisClient.setex(req.params.id, 3600, JSON.stringify(result));
          res.status(200);
          res.send(result.data);
        })
        .catch((err) => {
          res.status(500);
          res.end();
        }); 
    }
  });
});

app.get('/api/menu/:id', function(req, res) {
  axios.get(`${MENU_SERVER}/api/menu/${req.params.id}`)
    .then((result) => {
      res.status(200);
      res.send(result.data);
    })
    .catch((err) => {
      res.status(500);
      res.end();
    });
});

app.get('/:id/reservations', function(req, res) {
  axios.get(`${RESERVATIONS_SERVER}/${req.params.id}/reservations`)
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
