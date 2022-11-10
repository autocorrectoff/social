require("dotenv").config();
require("isomorphic-fetch");

(async () => {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;

  function toQueryString(obj) {
    var parts = [];
    for (var property in obj) {
      var value = obj[property];
      if (value != null && value != undefined)
        parts.push(
          encodeURIComponent(property) + "=" + encodeURIComponent(value)
        );
    }
    return "?" + parts.join("&");
  }

  // Gets any tweet - no need for loging in
  async function getTweet(id, fields) {
    fields = fields.join(",");
    const url = `https://api.twitter.com/2/tweets/${id}?tweet.fields=${fields}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    if (response.status == 200) {
      return await response.json();
    } else {
      console.log(response.status);
      console.log(response.statusText);
      throw new Error(JSON.stringify(response));
    }
  }

  const id = "1573042684394147840";
  await getTweet(id, ["author_id", "created_at"]);

  async function getTweets(ids, fields) {
    ids = ids.join(",");
    fields = fields.join(",");
    const url = `https://api.twitter.com/2/tweets?ids=${ids}&tweet.fields=${fields}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    if (response.status == 200) {
      return await response.json();
    } else {
      console.log(response.status);
      console.log(response.statusText);
      throw new Error(JSON.stringify(response));
    }
  }

  const ids = [
    "1573042684394147840",
    "1564879470481518592",
    "1573017260058447883",
  ];
  await getTweets(ids, ["author_id", "created_at"]);

  async function getUser(id, fields) {
    fields = fields.join(",");
    const url = `https://api.twitter.com/2/users/${id}?user.fields=${fields}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    if (response.status == 200) {
      return await response.json();
    } else {
      console.log(response.status);
      console.log(response.statusText);
      throw new Error(JSON.stringify(response));
    }
  }

  const userId = "2600210567";
  const user = await getUser(userId, ["public_metrics"]);

  async function getUserByUsername(username, fields) {
    fields = fields.join(",");
    const url = `https://api.twitter.com/2/users/by/username/${username}?user.fields=${fields}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    if (response.status == 200) {
      return await response.json();
    } else {
      console.log(response.status);
      console.log(response.statusText);
      throw new Error(JSON.stringify(response));
    }
  }

  const username = "GervasiusTwink1";
  await getUserByUsername(username, [
    "public_metrics",
    "created_at",
    "location",
  ]);

  async function getFollowers(id, fields) {
    fields = fields.join(",");
    const url = `https://api.twitter.com/2/users/${id}/followers?user.fields=${fields}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    if (response.status == 200) {
      return await response.json();
    } else {
      console.log(response.status);
      console.log(response.statusText);
      throw new Error(JSON.stringify(response));
    }
  }

  {
    const userId = "1272094051463020553";
    await getFollowers(userId, ["public_metrics", "created_at", "location"]);
  }

  async function getFollowing(id, fields) {
    fields = fields.join(",");
    const url = `https://api.twitter.com/2/users/${id}/following?user.fields=${fields}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    if (response.status == 200) {
      return await response.json();
    } else {
      console.log(response.status);
      console.log(response.statusText);
      throw new Error(JSON.stringify(response));
    }
  }

  {
    const userId = "1272094051463020553";
    await getFollowing(userId, ["public_metrics", "created_at", "location"]);
  }

  async function searchTweets(term, fields) {
    fields = fields.join(",");
    const url = `https://api.twitter.com/2/tweets/search/recent?query=${term}&user.fields=${fields}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    if (response.status == 200) {
      return await response.json();
    } else {
      console.log(response.status);
      console.log(response.statusText);
      throw new Error(JSON.stringify(response));
    }
  }

  const term = "apeirophobia";
  await searchTweets(term, ["public_metrics", "created_at", "location"]);

  async function postTweet(accessToken, tweet) {
    const url = "https://api.twitter.com/2/tweets";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tweet),
    });
    if (response.status == 201) {
      return await response.json();
    } else {
      console.log(response.status);
      console.log(response.statusText);
      console.log(await response.text());
    }
  }

  const accessToken =
    "QUpTZUotWUIyTTlvbmY0UVZxQzRlaXI3TlZKSHd3SUxTZkVBUkhTVmRPOUQ5OjE2NjYwNzgxOTczNjA6MTowOmF0OjE";
  const tweet = {
    text: "You are not allowed to create a Tweet with duplicate content? Wut? Wut?",
  };
  await postTweet(accessToken, tweet);

  async function deleteTweet(id) {
    const url = `https://api.twitter.com/2/tweets/${id}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.status == 200) {
      return await response.json();
    } else {
      console.log(response.status);
      console.log(response.statusText);
      console.log(await response.text());
    }
  }

  const tweetId = "1574359904399269889";
  await deleteTweet(tweetId);

  async function uploadImage(image, imageSize) {
    let url = `https://upload.twitter.com/1.1/media/upload.json?media_category=TWEET_IMAGE`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // 'Content-Type': "application/x-www-form-urlencoded",
        // "Content-length": imageSize
      },
      body: image,
    });
    if (response.status == 200) {
      return await response.json();
    } else {
      console.log(response.status);
      console.log(response.statusText);
      console.log(await response.text());
    }
  }

  const fs = require("fs/promises");
  const file = await fs.readFile("./download.jpg");

  await uploadImage(file, file.byteLength);
})();
