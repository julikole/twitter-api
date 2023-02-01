const express = require('express');
const cors = require('cors');
const app = express();
const { getTweets, getTweetsByUserName, createTweet } = require('./services/database')

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

//get tweets by id
// app.get('/tweets/:id', async (req, res) => {
//     const { id } = req.params;
//     const tweets = await getTweetsById(id);
//     res.json(tweets);
// });

app.post('/tweets', async (req, res) => {
    const { text } = req.body;
    const username  = req.headers['x-user'];
    const newTweet = await createTweet(text, username);
    res.json(newTweet);
})


app.listen(PORT, () => {
    console.log(`Twitter API listening to port ${PORT}`)
});

