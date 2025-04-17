import {Question, Player, Leaderboard, GameSettings} from '../pages/Game/GameLogic'

/**
 * Assignment 5 Unit Tests
 * Author: Paul Mann
 * Methods tested:
 *      1. Question.CheckAnswer()
 *      2. Question.CalcPlayerScore()
 *      3. Leaderboard.registerPlayer()
 *      4. Leaderboard.findPlayer()
 *      5. Leaderboard.updatePlayer()
 *      6. GameSettings.#isTimeInRange()
 */

describe('Question', () => {
    const question = "What is 2+2?";
    const correctAnswer = "4";
    const incorect1 = "2";
    const incorect2 = "7";
    const incorect3 = "9";

    //Question constructor
    it('should throw an error if any inputs are null', () => {
        expect(() => new Question(null, correctAnswer, incorect1, incorect2))
            .toThrow("Question or Answer is null");
        expect(() => new Question(question, null, incorect1, incorect2))
            .toThrow("Question or Answer is null");
        expect(() => new Question(question, correctAnswer, null, incorect2))
            .toThrow("Question or Answer is null");
        expect(() => new Question(question, correctAnswer, incorect1, null))
            .toThrow("Question or Answer is null");
    });

    it('should correctly assign question and shuffle answers', () => {
        const mathRandomSpy = jest.spyOn(Math, "random")
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(0);

        const q = new Question(question, correctAnswer, incorect1, incorect2, incorect3);

        //Checks question exists
        expect(q.question).toEqual(question);

        //Checks answers exist
        const inputAnswers = [correctAnswer, incorect1, incorect2, incorect3].sort();
        const sortedAnswers = [...q.answers].sort();
        expect(sortedAnswers).toEqual(inputAnswers);

        //Check if shuffle works
        //Shuffle should be the input reversed
        expect(q.answers).toEqual([incorect1, incorect2, incorect3, correctAnswer]);

        mathRandomSpy.mockRestore();
    });

    //CheckAnswer
    it('should return true only when AnswerID is 0', () => {
        const q = new Question(question, correctAnswer, incorect1, incorect2, incorect3);
        expect(q.CheckAnswer(0)).toBe(true);
        expect(q.CheckAnswer(1)).toBe(false);
        expect(q.CheckAnswer(2)).toBe(false);
        expect(q.CheckAnswer(3)).toBe(false);
    });

    //CalcPlayerScore
    it('should calculate score for a correct answer', () => {
        const q = new Question(question, correctAnswer, incorect1, incorect2, incorect3);
        const score = q.CalcPlayerScore(0, 2, 5);
        expect(score).toBe(Math.ceil((1000 * 0.6) + 1000))
    });

    it('should calculate score for an incorrect answer', () => {
        const q = new Question("Test?", "Correct", "Wrong1", "Wrong2", "Wrong3");
        const score = q.CalcPlayerScore(1, 2, 5);
        expect(score).toBe(Math.ceil(0.6 * 1000));
    });
});

//Leaderboard and Player classes
describe('Leaderboard', () => {
    //Test Leaderboard and Player constructors and registerPlayer()
    it('should add new players to the leaderboard', () => {
        const leaderboard = new Leaderboard();
        leaderboard.registerPlayer("Paul", 1, 500);
        leaderboard.registerPlayer("Hayley", 2, 800);

        expect(leaderboard.leaderboard.length).toBe(2);
        const paul = leaderboard.findPlayer(1);
        expect(paul).toBeDefined();
        expect(paul.name).toBe("Paul");
        expect(paul.score).toBe(500);
    });

    //findPlayer
    it('should find the correct player by id', () => {
        const leaderboard = new Leaderboard();
        leaderboard.registerPlayer("Paul", 1, 500);
        leaderboard.registerPlayer("Hayley", 2, 900);
        leaderboard.registerPlayer("Mary Kate", 3, 800);
        leaderboard.registerPlayer("Shawn", 4, 600);

        leaderboard.updatePlayer(1, 300);

        const paul = leaderboard.findPlayer(1);
        expect(paul).toBeDefined();
        expect(paul.name).toBe("Paul");
    });

    //updatePlayer()
    it('should update the score of an existing player', () => {
        const leaderboard = new Leaderboard();
        leaderboard.registerPlayer("Paul", 1, 500);
        leaderboard.updatePlayer(1, 200);  //Should add 200 to score

        const paul = leaderboard.findPlayer(1);
        expect(paul.score).toBe(700);
    });

    //#sort() and updatePlayer()
    it('should sort the leaderboard after every update', () => {
        const leaderboard = new Leaderboard();
        leaderboard.registerPlayer("Paul", 1, 500);
        leaderboard.registerPlayer("Mary Kate", 2, 800);
        leaderboard.registerPlayer("Shawn", 3, 600);

        leaderboard.updatePlayer(1, 200);

        expect(leaderboard.leaderboard[0].id).toBe(2);
        expect(leaderboard.leaderboard[1].id).toBe(1);
        expect(leaderboard.leaderboard[2].id).toBe(3);
    });
});

//GameSettings class
describe('GameSettings', () => {
    //Testing constructor and private class checking time range
    it('should correctly assign settings when time per question is within the valid range', () => {
        const settings = new GameSettings(100, "deck1", true);
        expect(settings.timePerQuestion).toBe(100);
        expect(settings.selectedDeck).toBe("deck1");
        expect(settings.shuffleDeck).toBe(true);
    });

    it('should throw an error when time per question is out of the allowed range', () => {
        expect(() => new GameSettings(0, "deck1", true))
            .toThrow("Time per question is out of range (1-220)");
        expect(() => new GameSettings(221, "deck1", false))
            .toThrow("Time per question is out of range (1-220)");
    });
})