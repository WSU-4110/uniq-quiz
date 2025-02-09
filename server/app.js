const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//Routers
const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');   ///This router was there originally. Not sure what for, so I'm keeping it commented. Shares the same name as the one I made.
const usersRouter = require("./routes/usersRouter"); 
const groupsRouter = require("./routes/groupsRouter")
const groupMembershipRouter = require("./routes/groupMembershipRouter"); 
const gamesRouter = require("./routes/gamesRouter"); 
const cardsRouter = require("./routes/cardsRouter"); 
const decksRouter = require("./routes/gamesRouter"); 

const app = express();

//middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/groups', groupsRouter);
app.use('/api/groupMembership', groupMembershipRouter);
app.use('/api/games', gamesRouter);
app.use('/api/cards', cardsRouter);
app.use('/api/decks', decksRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server has started on port ${process.env.PORT}.`)
});

module.exports = app;
