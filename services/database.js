const { Pool } = require('pg');

const database = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Twitter',
    password: 'Fornebu2020%',
    port: 5432,
});

async function getTweets() {
    const result = await database.query(`
        SELECT
            tweets.id,
            tweets.message,
            tweets.created_at,
            users.name,
            users.username
        FROM
            tweets
        INNER JOIN users ON
            tweets.user_id = users.id
        ORDER BY created_at DESC;
    `);

    return result.rows;
}

async function getTweetsByUserName(username) {
    const result = await database.query(`
    SELECT
        tweets.id,
        tweets.message,
        tweets.created_at,
        users.name,
        users.username
    FROM
        tweets
    INNER JOIN users ON
        tweets.user_id = users.id
    WHERE
        users.username = $1
    ORDER BY created_at DESC;
`, [username]);

    return result.rows;

}


// get tweets by id

// async function getTweetsById(id) {
//     const result = await database.query(`
//     SELECT
//         tweets.id,
//         tweets.message,
//         tweets.created_at,
//         users.name,
//         users.username
//     FROM
//         tweets
//     INNER JOIN users ON
//         tweets.user_id = users.id
    
// `);

//     return result.id;

// }


async function createTweet(text, username) {

    console.log({ username })
    const userResult = await database.query(`
        SELECT 
            users.id
        FROM
            users
        WHERE
            users.username = $1
    `, [username]);

    const user = userResult.rows[0];

    const tweetResult = await database.query(`
        INSERT INTO tweets
            (message, user_id)
        VALUES
            ($1, $2)
        RETURNING
            id
    `, [text, user.id]);
    const newTweet = tweetResult.rows[0]
    return newTweet;
}

module.exports = {
    getTweets,
    getTweetsByUserName,
    createTweet
};