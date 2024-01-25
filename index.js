const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
const targetDomain = process.env.TARGET_DOMAIN;
const authorizationToken = process.env.AUTHORIZATION_TOKEN;

// Use bodyParser to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/test', (req, res) => {
    // Handle the GET request for '/test' here
    res.send(`This is a response from the /test route. Server running on http://localhost:${port}`);
});
// Forward GET requests
app.get('*', async (req, res) => {
    try {
        const url = `${targetDomain}${req.originalUrl}`;
        console.log(`get url path ${url}`)
        const response = await axios.get(`${targetDomain}${req.originalUrl}`,{
            headers: {
                'Authorization': authorizationToken
            }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send(`Error forwarding GET request ${error}`);
    }
});

// Forward POST requests
app.post('*', async (req, res) => {
    try {
        const url = `${targetDomain}${req.originalUrl}`;
        console.log(`post url path ${url}`)
        const response = await axios.post(`${targetDomain}${req.originalUrl}`, req.body, {
            headers: {
                'Authorization': authorizationToken
            }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send(`Error forwarding POST request ${error}`);
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});