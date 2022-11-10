require("dotenv").config();
require("isomorphic-fetch");

(async () => {
  const accessToken =
    "EAAFmyqexBNEBALFc7QDrZA2EZB5ri3pHkc310UnTGnKrMh17Uo05SFr03xsk8rM1XNhJmKEfLFKDQREhBH9ejnrS4K8ZBmJ84uch9nX9kdpQDbybED90JtZAr086t4iRg7YHKkBVwrHNNC5BlciUzMUAyVzo5ZCWJ5sZBhIZBNZB1k5rQKacMF4UINP3x14kSvy8kk42u40bmZBk370WDd0QZCvdfG6x0iKGFwfatxGBabnQZDZD";

  async function getUser() {
    const url = "https://graph.facebook.com/me";
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "aplication/json",
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

  async function getUserById(id) {
    const url = `https://graph.facebook.com/${id}?metadata=1`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "aplication/json",
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

  async function postToFeed(id, body) {
    const url = `https://graph.facebook.com/${id}/feed`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "aplication/json",
      },
      body: JSON.stringify(body),
    });
    if (response.status == 201) {
      return await response.json();
    } else {
      console.log(response.status);
      console.log(response.statusText);
      console.log(await response.text());
    }
  }

  const post = {
    message: "Testing the api",
  };
  const response = await postToFeed(id, post);
  console.log(response);
})();