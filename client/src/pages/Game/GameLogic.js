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
        const idToLoc = [0, 1, 2, 3];

        // Using the Fisher-Yates algorithm to shuffle the questions
        // I had come across this algorithm while researching a fix to a bug
        for(let i = answers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [answers[i], answers[j]] = [answers[j], answers[i]];
            [idToLoc[i], idToLoc[j]] = [idToLoc[j], idToLoc[i]];
        }

        this.answers = answers;
        this.idToLoc = idToLoc;
        this.correctAnswerID = answers.indexOf(correctAnswer);
    }


    CheckAnswer(answerID) {
        return answerID === 0;
    }

    CalcPlayerScore(answerID, position, totalPos){
        const isQuestionCorrect = this.CheckAnswer(answerID)
        const positionReversed = totalPos - position;
        var normalizedPosition = positionReversed / totalPos;
        normalizedPosition = Math.abs(normalizedPosition);

        var correctScore = (1000 * normalizedPosition) + 1000;
        var positionScore = normalizedPosition * 1000;
        return ( Math.ceil(isQuestionCorrect ? correctScore : positionScore));
    }
}

export class Player {
    constructor(name, id, score) {
        this.name = name;
        this.id = id;
        this.score = score;
    }
}

export class Leaderboard {
    constructor() {
        this.leaderboard = [];
    }

    registerPlayer(name, id, score = 0) {
        this.leaderboard.push(
            new Player(name, id, score)
        );
    }

    findPlayer(id) {
        return this.leaderboard.find(player => player.id === id);
    }

    #sort() {
        this.leaderboard.sort((a, b) => b.score - a.score);
    }

    updatePlayer(id, addScore) {
        const player = this.findPlayer(id);
        try{
            console.log(`Before player ${player}   -   player score: ${player.score}`);
        }catch(e){
            console.error(e);
        }
        if (player) {
            player.score += addScore;
        } else {
            this.registerPlayer("Errored User", id, addScore);
        }
        this.#sort();
        console.log(`After player ${player}   -   player score: ${player.score}`);
    }
}


export class GameSettings {
    constructor(timePerQuestion, selectedDeck, shuffleDeck) {
        if(!this.#isTimeInRange(timePerQuestion)) {
            throw new Error("Time per question is out of range (1-220)");
        }
        this.timePerQuestion = timePerQuestion;
        this.selectedDeck = selectedDeck;
        this.shuffleDeck = shuffleDeck;
    }

    #isTimeInRange(timePerQuestion) {
        return timePerQuestion <= 220 && timePerQuestion > 0;
    }
}