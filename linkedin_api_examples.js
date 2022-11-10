require("dotenv").config();
require("isomorphic-fetch");
const fs = require("fs");
const FormData = require("form-data");

(async () => {
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

  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;

  async function getUserInfo(accessToken) {
    const url = "https://api.linkedin.com/v2/me";
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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

  // const info = await getUserInfo(accessToken);
  // console.log(info);

  // Not working - Shares Api is legacy anyway
  async function getUserShares(accessToken, userUrn) {
    let url = "https://api.linkedin.com/v2/shares";
    url += toQueryString({
      g: "owners",
      owners: userUrn,
      sortBy: "LAST_MODIFIED",
      sharesPerOwner: "100",
    });
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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

  const userId = "h92QkYcZVH";
  const userUrn = `urn:li:person:${userId}`;
  //   const shares = await getUserShares(accessToken, userUrn);
  //   console.log(shares);

  async function createUGCPost(accessToken, post) {
    const url = "https://api.linkedin.com/v2/ugcPosts";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });
    if (response.status == 201) {
      return await response.json();
    } else {
      console.log(response.status);
      console.log(response.statusText);
      console.log(await response.json());
      throw new Error(JSON.stringify(response));
    }
  }

  const testUGCPost = {
    author: userUrn,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text: "Testing UGC Post api",
        },
        shareMediaCategory: "NONE",
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  // const response = await createUGCPost(accessToken, testUGCPost);
  // console.log(response);

  async function createPost(accessToken, body) {
    const url = "https://api.linkedin.com/rest/posts";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202209",
      },
      body: JSON.stringify(body),
    });
    if (response.status == 201) {
      return response.headers.get("x-restli-id");
    } else {
      console.log(response.status);
      console.log(response.statusText);
      console.log(await response.json());
      throw new Error(JSON.stringify(response));
    }
  }

  const testPost = {
    author: userUrn,
    commentary: "Just a dummy message v2",
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };

  // const posts = await createPost(accessToken, testPost);
  // console.log(posts);

  async function resharePost(accessToken, body) {
    const url = "https://api.linkedin.com/rest/posts";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202209",
      },
      body: JSON.stringify(body),
    });
    if (response.status == 201) {
      return response.headers.get("x-restli-id");
    } else {
      console.log(response.status);
      console.log(response.statusText);
      console.log(await response.json());
      throw new Error(JSON.stringify(response));
    }
  }

  const post2 = {
    author: userUrn,
    commentary: "Reshare Post test",
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
    reshareContext: {
      parent: "urn:li:share:6978988905765158912",
    },
  };

  // const result = await resharePost(accessToken, post2);
  // console.log(result);

  async function getPost(accessToken, postUrn) {
    const url = `https://api.linkedin.com/rest/posts/${encodeURIComponent(
      postUrn
    )}?viewContext=AUTHOR`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202209",
      },
    });
    if (response.status == 200) {
      return await response.json();
    } else {
      console.log(response.status);
      console.log(response.statusText);
      console.log(await response.json());
      throw new Error(JSON.stringify(response));
    }
  }

  // const postUrn = "urn:li:share:6978992487725973504";
  // const post = await getPost(accessToken, postUrn);
  // console.log(post);

  async function getPostsBatch(accessToken, postUrns) {
    postUrns = postUrns.map((urn) => encodeURIComponent(urn));
    const url = `https://api.linkedin.com/rest/posts?ids=List(${postUrns})`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202209",
        "X-RestLi-Method": "BATCH_GET",
      },
    });
    if (response.status == 200) {
      return await response.json();
    } else {
      console.log(response.status);
      console.log(response.statusText);
      console.log(await response.json());
      throw new Error(JSON.stringify(response));
    }
  }

  // const postUrns = ["urn:li:share:6978992487725973504", "urn:li:share:6978988905765158912"];
  // const posts = await getPostsBatch(accessToken, postUrns);
  // console.log(posts);

  async function getPostsByAuthor(accessToken, authorUrn, limit) {
    const url = `https://api.linkedin.com/rest/posts?author=${encodeURIComponent(
      authorUrn
    )}&isDsc=false&q=author&count=${limit}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202209",
        "X-RestLi-Method": "FINDER",
      },
    });
    if (response.status == 200) {
      return await response.json();
    } else {
      console.log(response.status);
      console.log(response.statusText);
      console.log(await response.json());
      throw new Error(JSON.stringify(response));
    }
  }

  // const posts = await getPostsByAuthor(accessToken, userUrn, 10);
  // console.log(posts);

  async function updatePost(accessToken, body, shareUrn) {
    const url = `https://api.linkedin.com/rest/posts/${encodeURIComponent(
      shareUrn
    )}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202209",
        "X-RestLi-Method": "PARTIAL_UPDATE",
      },
      body: JSON.stringify(body),
    });
    if (response.status == 204) {
      return response.headers;
    } else {
      console.log(response.status);
      console.log(response.statusText);
      console.log(await response.json());
      throw new Error(JSON.stringify(response));
    }
  }

  const postUpdate = {
    patch: {
      $set: {
        commentary: "Update to the post number 2",
        contentCallToActionLabel: "LEARN_MORE",
      },
    },
  };
  const shareUrn = "urn:li:share:6978988905765158912";
  // const response = await updatePost(accessToken, postUpdate, shareUrn);
  // console.log(response);

  async function deletePost(accessToken, shareUrn) {
    const url = `https://api.linkedin.com/rest/posts/${encodeURIComponent(
      shareUrn
    )}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202209",
        "X-RestLi-Method": "DELETE",
      },
    });
    if (response.status == 204) {
      return response.headers;
    } else {
      console.log(response.status);
      console.log(response.statusText);
      console.log(await response.json());
      throw new Error(JSON.stringify(response));
    }
  }

  // const deletePostUrn = "urn:li:share:6978982707691151361";
  // const response = await deletePost(accessToken, deletePostUrn);
  // console.log(response);

  async function initializeUpload(accessToken, userUrn) {
    const url = "https://api.linkedin.com/rest/images?action=initializeUpload";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202209",
      },
      body: JSON.stringify({
        initializeUploadRequest: {
          owner: userUrn,
        },
      }),
    });
    if (response.status == 200) {
      return await response.json();
    } else {
      console.log(response.status);
      console.log(response.statusText);
      console.log(await response.json());
      throw new Error(JSON.stringify(response));
    }
  }

  // const result = await initializeUpload(accessToken, userUrn);
  // console.log(result);

  const initializeUploadResult = {
    value: {
      uploadUrlExpiresAt: 1665751204044,
      uploadUrl:
        "https://www.linkedin.com/dms-uploads/C4E10AQHx6a4-qGjYpg/uploaded-image/0?ca=vector_ads&cn=uploads&sync=0&v=beta&ut=1MN3BeF1mUCqs1",
      image: "urn:li:image:C4E10AQHx6a4-qGjYpg",
    },
  };

  async function uploadImage(uploadUrl, buffer) {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202209",
      },
      body: buffer,
    });
    if (response.status == 201) {
      return await response.headers;
    } else {
      console.log(response.status);
      console.log(response.statusText);
      console.log(await response.json());
      throw new Error(JSON.stringify(response));
    }
  }

})();
