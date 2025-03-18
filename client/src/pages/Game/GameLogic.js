export class Question {
    constructor(question, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3) {
        console.log("Constructor Called Question Class");
        console.log(question);
        // Validate required inputs aren't blank to prevent errors
        if (
            question === null ||
            correctAnswer === null ||
            incorrectAnswer1 === null ||
            incorrectAnswer2 === null ||
            incorrectAnswer3 === null
        ) {
            throw new Error("Question or Answer is null");
        }

        this.question = question;
         const answers = [correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3];

        // Using the Fisher-Yates algorithm to shuffle the questions
        // I had come across this algorithm while researching a fix to a bug
        for(let i = answers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [answers[i], answers[j]] = [answers[j], answers[i]];
        }

        this.answers = answers;
        this.correctAnswerID = answers.indexOf(correctAnswer);
    }


    CheckAnswer(AnswerID) {
        console.log(AnswerID === this.correctAnswerID);
        console.log("Your answer vs server answer:", this.answers[AnswerID], this.answers[this.correctAnswerID])
        if(AnswerID === this.correctAnswerID) {
            return true;
        } else {
            return false;
        }
    }
}

export class Player {
    constructor(name, score) {
        this.name = name;
        this.score = score;
    }
}

export class Leaderboard {
    constructor() {
        this.leaderboard = [];
    }

    registerPlayer(name, score = 0) {
        this.leaderboard.push(
            new Player(name, score)
        );
    }

    findPlayer(name) {
        return this.leaderboard.find(player => player.name === name);
    }

    updatePlayer(name, newScore) {
        const player = this.findPlayer(name);
        if (player) {
            player.score += newScore;
        } else {
            this.registerPlayer(name, newScore);
        }
        this.leaderboard.sort();
    }
}

export class GameSettings {
    constructor(timePerQuestion, shuffleDeck) {
        this.timePerQuestion = timePerQuestion;
        this.shuffleDeck = shuffleDeck;
    }
}