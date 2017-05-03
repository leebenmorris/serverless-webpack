if (!global._babelPolyfill) {
  require('babel-polyfill');
}
const Watson = require('watson-developer-cloud/personality-insights/v3');
const Twit = require('twit');

const T = new Twit({
  consumer_key: 'mKCnO4xQHNxd5QQAhxRgV1dO7',
  consumer_secret: 'jD8APVODitoWJ4pCzhoL76SjrXZiJ00FUJ8PxOr5aqgRqnI724',
  access_token: '4053367053-Ta4H1zXSuc1dmClgxAfqoe9plYYRGMj1HV7klmc',
  access_token_secret: 'P5xAcqGAhXSYZszwKiMguGmOt1YWFwcl1TvbsFFXLK4hG'
});

const personality_insights = new Watson({
  username: '40c367a2-a50c-4dfb-a8b0-62cf2734dab1',
  password: '4sDbR4nvD1xk',
  version_date: '2017-04-06'
});

function getTweets(term, date, count) {
  return new Promise((resolve, reject) => {
    T.get(
      'search/tweets',
      { q: `${term} since:${date}`, count: count > 100 ? 100 : count },
      (err, data, res) => err ? reject(err) : resolve([data.statuses, res])
    );
  });
}

function sendToWatson(text) {
  return new Promise((resolve, reject) => {
    personality_insights.profile(
      { text: text },
      (err, res) => err ? reject(err) : resolve(res)
    );
  });
}

async function getPersonality(term, date, count) {
  try {
    const [twitterArr, res] = await getTweets(term, date, count);
    console.log('tweets done: ', twitterArr);
    const str = twitterArr.reduce((string, tweet) => string + tweet.text + ' ', '');
    console.log('str done: ', str);
    const personality = await sendToWatson(str);
    console.log('personalilty done: ', personality);
    return personality;
  }
  catch (err) {
    return err;
  }
}

module.exports.gp = (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false;
  getPersonality('Theresa May', '2010-01-01', 100)
    .then(result => cb(null, {
      statusCode: '200',
      body: JSON.stringify({ personaility: result }),
      headers: { 'Content-Type': 'application/json' }
    }))
    .catch(error => cb(new Error(error)));
};