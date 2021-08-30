# Book Review

## Setup

Install dependencies with `yarn install`

## Run the app

1. Execute `yarn db:start` to run the JSON-Server.
The JSON-Server runs at port 3001.

2. On a separate command line, execute `yarn start` to run the application.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Run Tests

1. Execute `yarn db:start:test` to run the Test JSON-Server. This is required to separate the data from the actual app.
The Test JSON-server runs at port 3002.

2. On a separate command line, execute `yarn test` to run the test once or `yarn test:watch` to run tests everytime you'll make a change in the project files.

## Technologies
* Typescript
* React, create-react-app
* Tailwind CSS
* Jest with react testing library
* react-query
* react-router
* react-toastify
