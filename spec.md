Technologies Used:

1.Node js:
    -Version:18.15.0
    -As per the instructions, used the ES6 standard and latest stable version
2.Google API library:
    -Used the latest stable version (105.0.0)
    -Used to invoke the gmail API
3.NodeMailer:
    -Version:6.9.7
    -Implemented to invoke Gmail SMTP functions for sending mails

Libraries and Modules:

1.Google-Auth-Library:
    -Version:2.1.0
    -The library is used fro handling OAuth2 authorization with Google services

API Endpoints:

1.Gmail API:
    -Method: users.messages.list
        -Used to list unread emails in the inbox.
    -Method: users.messages.get
        -Used to retrieve detailed information about a specific email message.
    -Method: users.messages.modify
        -Used to add labels (e.g., "replied") to a message.

2.Gmail Threads API:
    -Method: users.threads.get
        -Used to retrieve detailed information about a specific thread, including label information.

3.Gmail Labels API:
    -Method: users.labels.list
        -Used to retrieve a list of all labels for the user's Gmail account.