const express = require('express');
const cors = require('cors');
const app = express();
const { getTweets, getTweetsByUserName } = require('./services/database')

app.use(cors()); // can make fetch requests from anywhere
app.use(express.json()); // convert to json

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Hello from Twitter API')
})

app.get('/tweets', async (req, res) => {
    // get tweets from database
    const tweets = await getTweets();
    res.json(tweets);
    // respond with tweets as JSON
});

app.get('/tweets/:username', async (req, res) => {
    const { username } = req.params;
    const tweets = await getTweetsByUserName(username);
    res.json(tweets);
});

app.listen(PORT, () => {
    console.log(`Twitter API listening to port ${PORT}`)
});

