import React from 'react';
import { Button } from 'semantic-ui-react';

export default function handleAnswer(userGuess = null) {
  const ans = this.state.quizGuesses;
  const cor = this.state.quizAnswers;
  const idx = this.state.activeQuestionNum;

  if (userGuess) {
    const correctAlpha = this.state.quizAnswers[this.state.activeQuestionNum];
    let result;

    const answer = this.state.geographyPaths
      .find(geo => geo.properties.alpha3Code === correctAlpha)
      .properties;

    if (this.state.quizType.split('_')[1] === 'name') {
      result = answer.spellings.some(name => userGuess.toLowerCase() === name.toLowerCase());
    } else {
      result = userGuess.toLowerCase() === answer.capital.toLowerCase();
    }

    this.handleMapRefresh({
      quizGuesses: [...this.state.quizGuesses, result],
      activeQuestionNum: this.state.activeQuestionNum + 1,
    });
  }

  if (idx === cor.length) {
    const score = ans.reduce((a, b) => a * 1 + b * 1);
    const quizTypeCopy = this.state.quizType.slice();
    const finalText = `Your score is ${score} / ${cor.length} or ${Math.round(score / cor.length * 100)}%`;
    return (
      <div>
        <p>{finalText}</p>
        <Button
          onClick={() => {
            this.handleQuizClose();
            this.handleQuiz(quizTypeCopy);
          }
          }
          content="RESTART"
        />
      </div>);
  }
  return '';
}
