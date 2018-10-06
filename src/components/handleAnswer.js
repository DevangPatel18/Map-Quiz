import React from 'react';
import { Button } from 'semantic-ui-react';

export default function handleAnswer(userGuess = null) {
  const {
    quizGuesses, quizAnswers, activeQuestionNum, quizType, geographyPaths,
  } = this.state;

  if (userGuess) {
    let result;

    const answerProperties = geographyPaths
      .find(geo => geo.properties.alpha3Code === quizAnswers[activeQuestionNum])
      .properties;

    if (quizType.split('_')[1] === 'name') {
      result = answerProperties.spellings
        .some(name => userGuess.toLowerCase() === name.toLowerCase());
    } else {
      result = userGuess.toLowerCase() === answerProperties.capital.toLowerCase();
    }

    const selectedProperties = result ? answerProperties : '';

    this.handleMapRefresh({
      selectedProperties,
      quizGuesses: [...quizGuesses, result],
      activeQuestionNum: activeQuestionNum + 1,
    });
  }

  if (activeQuestionNum === quizAnswers.length) {
    const score = quizGuesses.reduce((a, b) => a * 1 + b * 1);
    const quizTypeCopy = quizType.slice();
    const finalText = `Your score is ${score} / ${quizAnswers.length} or ${Math.round(score / quizAnswers.length * 100)}%`;
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
