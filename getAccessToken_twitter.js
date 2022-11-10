require("dotenv").config();
const { readFile } = require("fs/promises");
require("isomorphic-fetch");

(async () => {
  function urlEncode(obj) {
    var parts = [];
    for (var property in obj) {
      var value = obj[property];
      if (value != null && value != undefined)
        parts.push(
          encodeURIComponent(property) + "=" + encodeURIComponent(value)
        );
    }
    return parts.join("&");
  }

  async function getAccessToken(location) {
    const url = "https://api.twitter.com/2/oauth2/token";
    const clientKeys = Buffer.from(
      `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
    ).toString("base64");
    const body = (await readFile(location, "utf-8")).trim();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${clientKeys}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    });
    if (response.status == 200) {
      return await response.json();
    } else {
      console.log(response.status);
      console.log(response.statusText);
      console.log(await response.text());
    }
  }

  async function getAccessTokenFromRefreshToken(refreshToken) {
    const url = "https://api.twitter.com/2/oauth2/token";
    const clientKeys = Buffer.from(
      `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
    ).toString("base64");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${clientKeys}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlEncode({
        grant_type: "refresh_token",
        client_id: process.env.TWITTER_CLIENT_ID,
        refresh_token: refreshToken,
      }),
    });
    if (response.status == 200) {
      return await response.json();
    } else {
      console.log(response.status);
      console.log(response.statusText);
      console.log(await response.text());
    }
  }

  const response = await getAccessToken("./twitter_access_token_body.txt");
  console.log(response);

  const accessToken = await getAccessTokenFromRefreshToken(
    "QW9mZmhQU2JKYnFYcFpna3hvd3Y2UWdmODJPWTdpYUFxUlY2R3lCbGhSRnRiOjE2NjYwMDk1OTAyNDY6MTowOnJ0OjE"
  );
  console.log(accessToken);
})();
