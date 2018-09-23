import React from 'react'
import { Progress } from 'semantic-ui-react'

function statusBar() {
  let {quiz, quizGuesses, quizAnswers} = this.state
  let percentComp = quiz ? parseInt( quizGuesses.length / quizAnswers.length * 100, 10): ""
  let top = quiz ? "1rem":"-3rem";
  return (
    <div className="progressBar" style={{ top: `${top}` }}>
      <Progress percent={percentComp} progress />
    </div>
  )
}

export default statusBar