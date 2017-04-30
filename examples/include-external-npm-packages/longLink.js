const request = require("request");
const url = require("url");

module.exports.longLink = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const urlObj = url.parse(JSON.parse(event.body).shortUrl);

  request(
    {
      method: "HEAD",
      url: 'https://' + (urlObj.hostname || '') + urlObj.pathname,
      followAllRedirects: true,
      headers: { 'User-Agent': 'request' }
    },
    (err, res) => {
      if (err) callback(new Error(err));
      callback(null, {
        statusCode: '200',
        body: JSON.stringify({ longUrl: res.request.href }),
        headers: { 'Content-Type': 'application/json' }
      });
    }
  );
};
