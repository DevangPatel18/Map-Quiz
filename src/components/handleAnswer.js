import React from 'react';
import { Button } from 'semantic-ui-react'

export default function handleAnswer(userGuess = null){
  let ans = this.state.quizGuesses;
  let cor = this.state.quizAnswers;
  let idx = this.state.activeQuestionNum;

  if(userGuess) {
    let correctAlpha = this.state.quizAnswers[this.state.activeQuestionNum]
    let answer, result;

    answer = this.state.geographyPaths
        .find(geo => geo.properties.alpha3Code === correctAlpha )
        .properties;
    
    if(this.state.quizType.split("_")[1] === "name") {
      answer = answer.spellings;
      result = answer.some(name => userGuess.toLowerCase() === name.toLowerCase())
    } else {
      answer = answer.capital;
      result = userGuess.toLowerCase() === answer.toLowerCase()
    }

    this.handleMapRefresh({
      quizGuesses: [...this.state.quizGuesses, result],
      activeQuestionNum: this.state.activeQuestionNum + 1,
    })
  }

  if(idx === cor.length){
    var score = ans.reduce((total, x, i) => total += x*1, 0);
    let quizTypeCopy = this.state.quizType.slice()
    return (
      <div><p>Your score is {score} / {cor.length} or {Math.round(score/cor.length*100)}%</p>
        <Button
          onClick={ () => {
              this.handleQuizClose()
              this.handleQuiz(quizTypeCopy)
            }
          }
        >RESTART
        </Button>
      </div>)
  }
}
