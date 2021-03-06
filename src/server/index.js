require('dotenv-flow').config();
const pinejs = require('@balena/pinejs');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pineConfig = require('./pine-config.json');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log('%s %s', req.method, req.url);
  return next();
});

pinejs.init(app, pineConfig).then(() => {
  app.listen(process.env.PORT || 1337, () => {
    console.info('Server started');
  });
});
