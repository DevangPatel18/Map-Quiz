import React from 'react'
import { Progress } from 'semantic-ui-react'
import './statusBar.css'

function statusBar() {
  let {quiz, quizGuesses, quizAnswers} = this.state
  let percentComp = quiz ? parseInt( quizGuesses.length / quizAnswers.length * 100, 10): ""
  let top = quiz ? "0rem":"-3rem";
  return (
    <div className="statusBar" style={{ top: `${top}` }}>
      <Progress percent={percentComp} className="statusBar-progress" progress />
      <div className="statusBar-ratio">
        <p>Score: {quizGuesses.filter(x => x).length} / {quizAnswers.length}</p>
      </div>
    </div>
  )
}

export default statusBar