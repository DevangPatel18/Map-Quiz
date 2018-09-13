import React from 'react';
import { Button } from 'semantic-ui-react'

export default function handleAnswer(userGuess = null, testing = null){
  let ans = this.state.quizGuesses;
  let cor = this.state.quizAnswers;
  let idx = this.state.activeQuestionNum;
  let text, nextButton;

  if(userGuess) {
    let correctAlpha = this.state.quizAnswers[this.state.activeQuestionNum]
    let answer, result;

    answer = this.state.geographyPaths
        .find(geo => geo.properties.alpha3Code === correctAlpha )
        .properties;
    
    if(testing === "name") {
      answer = answer.spellings;
      result = answer.some(name => userGuess.toLowerCase() === name.toLowerCase())
    } else {
      answer = answer.capital;
      result = userGuess.toLowerCase() === answer.toLowerCase()
    }

    text = `${userGuess} is ${result ? "correct!":"incorrect!"}`;

    this.setState(prevState => ({
        quizGuesses: [...prevState.quizGuesses, result],
        disableOptimization: true,
      }), () => { this.setState({ disableOptimization: false }) }
    )
  } else {
    text = ans[idx] ? "that is correct!":"that is incorrect!";
  }

  if(idx === cor.length){
    var score = ans.reduce((total, x, i) => total += x*1, 0);
    var scoreText = <p>Your score is {score} / {cor.length} or {Math.round(score/cor.length*100)}%</p>
    text = "";
  } else {
    nextButton = <Button 
      autoFocus
      onClick={ () => {
        this.setState( prevState => 
          ({
            viewInfoDiv: false,
            activeQuestionNum: prevState.activeQuestionNum + 1,
            disableOptimization: true
          })
          , () => { 
            setTimeout(() => {
              this.setState({ selectedProperties: ""}, this.handleMapRefresh) 
            }, this.state.infoDuration)
          }
        )
      }
    }>NEXT</Button>;
  }

  return (
    <div>
      <p>{text}</p>
      {scoreText}
      {nextButton}
    </div>
  )
}
