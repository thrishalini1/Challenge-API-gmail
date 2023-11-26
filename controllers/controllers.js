//Importing the required modules

const { google } = require('googleapis');
const fs = require('fs/promises');
require('dotenv').config();

//Connect with Gmail via authorization
async function authorize() {
  //Authenticating with the API
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URIS
  );

  //Parsing the access token
  try {
    const token = await fs.readFile('token.json');
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  } catch (err) {
    return getAccessToken(oAuth2Client);
  }
}

//Getting access token if not presesnt
async function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: process.env.SCOPES,
  });
  console.log(`Authorize this app by visiting this URL: ${authUrl}`);
}

//Module Exports
module.exports = { authorize };
