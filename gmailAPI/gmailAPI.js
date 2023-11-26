//Importing the required modules
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const { authorize } = require('../controllers/controllers.js');
const { getLabelId } = require('../controllers/label');
require('dotenv').config();
const gmail = google.gmail('v1');

//Function to check for new unreplied Emails
async function checkEmails(labelName) {
  const auth = await authorize();
  //Getting the threads which are in inbox but not replied yet
  const response = await gmail.users.messages.list({
    auth,
    userId: 'me',
    q: `is:inbox -label:${labelName}`,
  });

  const messages = response.data.messages || [];

  //Replying to each message
  for (const message of messages) {
    await sendAutoReply(auth, message.id, labelName);
  }
}

//Function to reply to incoming messages
async function sendAutoReply(auth, messageId, labelName) {
  //Getting all the mails that arrived
  const message = await gmail.users.messages.get({
    auth,
    userId: 'me',
    id: messageId,
  });

  //Checking if it has replied label
  const threadId = message.data.threadId;
  const hasReplied = await hasRepliedBefore(auth, threadId);
  if (hasReplied) return;

  const mail = {
    to: message.data.payload.headers.find((header) => header.name === 'From')
      .value,
    subject:
      'Re: ' +
      message.data.payload.headers.find((header) => header.name === 'Subject')
        .value,
    text: 'Reply to your text.',
  };

  //Initializing the transporter in nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASS,
    },
  });

  //Sending the reply mail
  await transporter.sendMail(mail);
  const label = await getLabelId(labelName);
  //Placeing the mail in replied label
  await gmail.users.messages.modify({
    auth,
    userId: 'me',
    id: messageId,
    resource: {
      addLabelIds: [label],
      removeLabelIds: [],
    },
  });
}

//Check if the thread has already been replied
async function hasRepliedBefore(auth, threadId) {
  const response = await gmail.users.threads.get({
    auth,
    userId: 'me',
    id: threadId,
  });

  const labels = response.data.messages[0].labelIds || [];
  return labels.includes('replied');
}

//Setting a random interval between 45 to 120 seconds
setInterval(() => {
  checkEmails();
}, Math.floor(Math.random() * (120000 - 45000) + 45000));

//Module Exports
module.exports = { checkEmails };
