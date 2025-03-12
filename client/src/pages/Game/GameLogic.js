export class Question {
    constructor(question, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3) {
        console.log("Constructor Called Question Class");
        console.log(question);
        // Validate inputs aren't blank to prevent errors
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


    CheckAnswer(AnswerID, pos, totalPos) {
        console.log(AnswerID === this.correctAnswerID);
        if(AnswerID === this.correctAnswerID) {
            return this.CalcPlayerScore(true, pos, totalPos);
        } else {
            return this.CalcPlayerScore(false, pos, totalPos);
        }
    }

    CalcPlayerScore(isQuestionCorrect, position, totalPos){
        const positionReversed = totalPos - position;
        var normalizedPosition = positionReversed / totalPos;
        normalizedPosition = Math.abs(normalizedPosition);

        var correctScore = (1000 * normalizedPosition) + 1000;
        var positionScore = normalizedPosition * 100;
        return ( Math.ceil(isQuestionCorrect ? correctScore : positionScore));
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

    registerPlayer(name) {
        this.leaderboard.push(
            new Player(name, 0)
        );
    }

    findPlayer(name) {
        return this.leaderboard.find(player => player.name === name);
    }

    updatePlayer(name, newScore) {
        const player = this.findPlayer(name);
        if (player) {
            player.score = newScore;
        } else {
            throw new Error("Invalid player name");
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

export class Deck {
    cards = [];
    #onCard = 0;

    constructor(name) {
        this.name = name;
    }

    registerCard(card) {
        this.cards.push(card);
    }

    shuffleDeck(){
        for(let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    getNextCard() {
        if (this.#onCard >= this.cards.length) {
            throw new Error("Attempting to get next card when card deck is empty");
        }
        const toReturn = this.cards[this.#onCard];
        this.#onCard += 1;
        return toReturn;
    }

    getRemainingCardCount() {
        return this.cards.length - this.#onCard;
    }

}