# Installation Guide
## Requirements
- [React](https://react.dev/learn/installation): Version 19.0 or higher
- [Node](https://nodejs.org/en/download): Version 20.0 or higher
- [Node Package Manager](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm): Version 10.7.0
- [Supabase](https://supabase.com/docs/guides/getting-started): Free tier is fine for this project
- [Git](https://git-scm.com/)

## Installation Instructions
#### Clone the Repository
```
git clone https://github.com/WSU-4110/uniq-quiz
```
#### Install Dependencies
Install dependencies in root, client, and server using
```
npm install
```
#### Setting Environment Variables
There should be a .env file in the client and server folders. Populate them with these environmental variables:
##### Client
| Variable         | Description                      | Example Value       |
|------------------|----------------------------------|---------------------|
| `REACT_APP_API_URL`   | Backend API base URL             | `http://localhost:3000` |
| `REACT_APP_DEBUG`  | Whether React is set to debug mode       | False on production build, true on development |

##### Server
| Variable         | Description                      | Example Value       |
|------------------|----------------------------------|---------------------|
| `PORT`           | Port where server runs on        | 3000                |
| `INPUT_PORT`     | Port and URL that client runs on | `http://localhost:3001`|
| `DATABASE_URL`   | Supabase-provided project URL    | `https://xyz.supabase.co`|
| `DATABASE_KEY`   | Supabase-provided project key    | `eyJhbEciOiJIUzC1NiIaInB2cCI2LklXVCJ9...`|
| `DATABASE_SERVICE_ROLE_KEY`   | Supabase-provided project service key    | `eyJhbEciOiJIUzC1NiIaInB2cCI2LklXVCJ9...`|

#### Starting Development Server
Start the development server using the start script in 
```
cd server
npm start
```
Then, start the client using the start script in
```
cd client
npm start
```
## Testing
Tests run on the client. Navigate to client and run
```
npm test
```
