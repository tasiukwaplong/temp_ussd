const express = require('express');
// const bodyParser = require('body-parser');
const http = require('http');
// const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

// app.set('view engine', 'pug');
app.use(express.static('docs'))

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
// require('./src/routes')(app);

app.get('*', (req, res) => res.status(200).send({
  message: 'Endpoint does not exist yet'
}));

// ussd starts here
app.post('/ussd', (req, res) => {
    // Read the variables sent via POST from our API
    const {
        sessionId,
        serviceCode,
        phoneNumber,
        text,
    } = req.body;

    let response = '';

    if (text == '') {
        // This is the first request. Note how we start the response with CON
        response = `CON What would you like to check
        1. My account
        2. My phone number`;
    } else if ( text == '1') {
        // Business logic for first level response
        response = `CON Choose account information you want to view
        1. Account number`;
    } else if ( text == '2') {
        // Business logic for first level response
        // This is a terminal request. Note how we start the response with END
        response = `END Your phone number is ${phoneNumber}`;
    } else if ( text == '1*1') {
        // This is a second level response where the user selected 1 in the first instance
        const accountNumber = 'ACC100101';
        // This is a terminal request. Note how we start the response with END
        response = `END Your account number is ${accountNumber}`;
    }

    // Send the response back to the API
    res.set('Content-Type: text/plain');
    res.send(response);
});
// ussd stops here

const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});

module.exports = app;
