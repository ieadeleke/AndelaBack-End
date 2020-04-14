const express = require('express');
const bodyParser = require('body-parser');
const { toXml, toJson } = require('json-xml');
const morgan = require('morgan');
const covid = require('../views/estimation');
const fs = require('fs');
const path = require('path');

const app = express();
const apiRoute = express.Router();
// app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const logFile = fs.createWriteStream(path.join(__dirname, './logs/log.txt'), { flags: 'a' })

//Morgan for logging requests to the server
app.use(
  morgan(
    //':method\t\t:url\t\t:status\t\t:response-time\bms',
    (tokens, req, res) => {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        parseInt(tokens['response-time'](req, res)) < 10 ?
          '0' + parseInt(tokens['response-time'](req, res)) + 'ms'
          :
          parseInt(tokens['response-time'](req, res)) + 'ms'
      ].join('\t\t')
    },
    {
      stream: logFile
    }
  )
)


apiRoute.route('/on-covid-19')
  .post(covid, (req, res) => {
    res.status(200).json(res.body);
  })
apiRoute.route('/on-covid-19/:type')
  .post(covid, (req, res) => {
    if (req.params.type === 'json') {
      res.status(201).json(res.body);
    } else if (req.params.type === 'xml') {
      xmlData = toXml(res.body);
      res.status(201).send(xmlData)
    }
  })

apiRoute.route('/on-covid-19/logs')
  .get((req, res) => {
    fs.readFile(path.join(__dirname, './logs/log.txt'), 'utf-8', (err, data) => {
      if (err) throw err;
      res.type('text/plain');
      res.status(201).send(data);
    })
  })


app.use('/api/v1', apiRoute);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log('Server listening on port', port)
})