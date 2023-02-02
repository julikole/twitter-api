const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const { getTweets, getTweetsByUserName, createTweet, getUserByUserName } = require('./services/database')

app.use(cors()); // can make fetch requests from anywhere
app.use(express.json()); // convert to json

const PORT = 3000;
const APP_SECRET = 'my-secret-key-1234';

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
    const username = req.headers['x-user'];
    const newTweet = await createTweet(text, username);
    res.json(newTweet);
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await getUserByUserName(username);
        if (!user) {
            res.status(401).send({ error: 'Unnknown user - not found' });
            return;
        }
        if (password !== user.password) {
            res.status(401).send({ error: 'Wrong password' });
            return;
        }

        const token = jwt.sign({
            id: user.id,
            username: user.username,
            name: user.name
        }, Buffer.from(APP_SECRET, 'base64'))

        res.json({
            token: token
        })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
});

app.get('/session', async (req, res) => {
    const token = req.headers['x-token'];
    
    try {
        const payload = jwt.verify(token, Buffer.from(APP_SECRET, 'base64'));
        res.json({ message: `You are logged in as ${payload.username}`});
    } catch (error) {
        res.status(401).send({ error: 'Invalid token' })
    }
})


app.listen(PORT, () => {
    console.log(`Twitter API listening to port ${PORT}`)
});

