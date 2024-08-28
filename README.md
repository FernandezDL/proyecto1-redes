# Project 1 - Chat with XMPP protocol
## Index
- [Description](https://github.com/FernandezDL/proyecto1-redes?tab=readme-ov-file#description)
- [Project goals](https://github.com/FernandezDL/proyecto1-redes?tab=readme-ov-file#project-goals)
- [Viewed topics](https://github.com/FernandezDL/proyecto1-redes?tab=readme-ov-file#viewed-topics)
- [File organization](https://github.com/FernandezDL/proyecto1-redes?tab=readme-ov-file#file-organization)
- [Compilation](https://github.com/FernandezDL/proyecto1-redes?tab=readme-ov-file#compilation)
- [Server domain](https://github.com/FernandezDL/proyecto1-redes?tab=readme-ov-file#server-domain)
- [Implemented functionalities](https://github.com/FernandezDL/proyecto1-redes?tab=readme-ov-file#implemented-functionalities)
- [Author](https://github.com/FernandezDL/proyecto1-redes?tab=readme-ov-file#author)

  
## Description
Instant messaging is a creation that has revolutionized the way people communicate on a daily basis, as it is a form of communication that has become so popular and everyday for people. However, because most services require the use of private protocols, this forces users to use only the applications developed by the provider.

However, _Extensible Messaging and Presence Protocol_, or XMPP for short, is an open protocol that allows the interconnection of different instant messaging providers which, with more than 15 years of experience, provides features of handling encryption, being decentralized, extensible, easy to scale and fully community-based.

The project aims to implement an instant messaging client that supports the _XMPP_ protocol, allowing basic functionalities. It must have a graphical interface that can be used in different operating systems. The use of libraries that facilitate communication with the _XMPP_ protocol is allowed.

## Project goals
- Implement a standards-based protocol.
- Understand the purpose of the _XMPP_ protocol.
- Understand how _XMPP_ protocol services work.
- Apply the knowledge acquired in Web and Mobile programming, as well as appropriate development practices.

## Viewed topics
- Instant messaging
- Extensible Messaging and Presence Protocol
- Instant messaging client
- _XMPP_ protocol services
- Graphical interfaces
- Web and Mobile programming
- Appropriate development practices.
- Version Controller
  
## File organization
├── node_modules

├── proyecto1-redes

├─────── node_modules

├─────── public

├───────────────────── images

└──────────────────────────── usuario.png

├─────── src

├───────────────────── components

├──────────────────────────── addContact

├─────────────────────────────────── addContact.css

└─────────────────────────────────── addContact.js

├──────────────────────────── chat

├─────────────────────────────────── chat.css

└─────────────────────────────────── chat.js

├──────────────────────────── eliminarCuenta

└─────────────────────────────────── eliminarCuenta.js

├──────────────────────────── groupChat

└─────────────────────────────────── groupChat.js

├──────────────────────────── login

├─────────────────────────────────── login.css

└─────────────────────────────────── login.js

├──────────────────────────── moreOptions

├─────────────────────────────────── moreOptions.css

└─────────────────────────────────── moreOptions.js

├──────────────────────────── newChat

└─────────────────────────────────── newChat.js

├──────────────────────────── presence

└─────────────────────────────────── presence.js

└──────────────────────────── userInformation

└─────────────────────────────────── userInformation.js

├───────────────────── services

├──────────────────────────── xmpp.js

├───────────────────── App.css

├───────────────────── App.js

├───────────────────── App.test.js

├───────────────────── index.css

└───────────────────── index.js

├─────── .gitignore

├─────── package-lock.json

├─────── package.json

└─────── README.md

├── package-lock.json

└── package.json

## Compilation
This is a project that uses several dependencies, among them React Strophe.js, so the first step after cloning the repository is to install all the dependencies needed. Make sure you are inside the folder where the project is and in the terminal you have to enter the command:

```bash
npm install
```

After all the dependencies have been installed correctly, the project can be compiled, therefore, in the terminal we type the command:

```bash
npm start
```

Once the project finishes compiling, a window will open in the browser defined as default with a local host, in which you will be able to interact with the project in its entirety.

To pause the execution of the project in the terminal where the command to compile was executed, press the key combination `ctrl + C`, combination which will force the interruption of the program.

If you want or need to make changes in the project you can modify the necessary files, and the project, when using Hot Reloading will inject the changes of the source code in the application without the need to reload the whole page or restart it as such.

## Server domain
The server for this project was provided by the course professors, and the domain for this project is `alumchat.lol`.

## Implemented functionalities
- Register a new account on the server
- Log in with an account
- Log out with an account
- Delete an account from the server
- Display contacts and their status
- Add a user to contacts
- Show the contact details of a user
- 1-to-1 communication with any user or contact
- Participate in group conversations
- Define presence message
- New messages notification
 
## Author
Diana Lucía Fernández Villatoro - 21747

fer21747@uvg.edu.gt
