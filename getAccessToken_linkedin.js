require("dotenv").config();
const { readFile } = require("fs/promises");
require("isomorphic-fetch");

// more on refresh tokens: 
// https://learn.microsoft.com/en-us/linkedin/shared/authentication/programmatic-refresh-tokens?context=linkedin%2Fcontext
// https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow?tabs=HTTPS#step-5-refresh-access-token

(async () => {
  async function getLinkedinAccessToken(location) {
    const accessTokenUrl = await readFile(location, "utf-8");
    const response = await fetch(accessTokenUrl);
    if (response.status == 200) {
      return await response.json();
    } else {
      throw new Error(JSON.stringify(response));
    }
  }

  const response = await getLinkedinAccessToken("./linkedin_access_token_url.txt");
  console.log(response);
})();
