export class Question {
    constructor(question, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3, correctAnswerID) {
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