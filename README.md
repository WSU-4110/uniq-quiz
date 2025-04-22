# Uniq-Quiz
<p align="center">
  <img width="460" height="200" src="client/public/TitleLogo.svg">
</p>

## Description
Uniq-Quiz is a website for studying in live games and joining study groups of like-minded individuals! Players can
- Join live study games and participate in realtime scored quiz gameplay
- Create custom decks or browse and study decks created by other users
- Form study groups to compete with and study with other users
## Technologies
<details>
<summary>Front-End</summary>
  Front-end is an interface for interacting with database and participating in realtime live game communication.
<ul>
  <li>React v19</li>
  <li><a href="https://reactrouter.com/guides/home">React Router</a> for routing within pages</li>
  <li><a href="https://axios-http.com/docs/intro">Axios</a> for standardizing data fetches</li>
  <li><a href="https://socket.io/docs/v4/tutorial/introduction">Socket.io</a> for real-time internal communication</li>
</ul>
<br>
</details>
<details>
<summary>Back-End</summary>
  Back-end is an API Gateway interface and websocket handler.
<ul>
  <li>Node v20 or higher</li>
  <li>Express v4.21 or higher</li>
  <li><a href="https://supabase.com/docs/guides/getting-started">Supabase</a> hosts database and JWT authentication</li>
  <li><a href="https://socket.io/docs/v4/tutorial/introduction">Socket.io</a> for real-time internal communication</li>
</ul>
<br>
</details>

## Authors
- Hayley Spellicy-Ryan @[hayleysr](https://github.com/hayleysr)
- Keegan Miller @[KeeganM-02](https://github.com/KeeganM-02)
- Paul Mann @[paulwmcs](https://github.com/paulwmcs)
- Trevor Harris @[Trevor-D-H](https://github.com/Trevor-D-H)
- Yiduo Chen @[TheApathetic1](https://github.com/TheApathetic1)

## Getting Started
Follow the [installation guide](https://github.com/WSU-4110/uniq-quiz/blob/main/INSTALLATION.md) for detailed setup and build instructions. Once installed:
- Navigate to /server and start the backend server using `npm start`.
- Navigate to /client and start the frontend server using `npm start`.

## Viewing the Website
[Follow this link](http://172.105.19.199/) and login to access the website, host games, and browse and create decks and groups!
