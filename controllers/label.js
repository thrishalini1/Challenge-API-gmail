const { google } = require('googleapis');
const { authorize } = require('./controllers');

const gmail = google.gmail('v1');

async function getLabelId(labelName) {
  const auth = await authorize();
  // List all labels to find the label ID
  const response = await gmail.users.labels.list({
    auth,
    userId: 'me',
  });

  const labels = response.data.labels || [];
  const label = labels.find((label) => label.name === labelName);
  if (label) {
    return label.id;
  } else {
    return null;
  }
}

module.exports = { getLabelId };
