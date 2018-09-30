import React from 'react'
import { Progress } from 'semantic-ui-react'
import msToTime from '../helpers/msToTime.js'
import './statusBar.css'

function statusBar() {
  let {quiz, quizGuesses, quizAnswers, time} = this.state
  let percentComp = quiz ? parseInt( quizGuesses.length / quizAnswers.length * 100, 10): ""
  let top = quiz ? "0rem":"-7rem";
  return (
    <div className="statusBar" style={{ top: `${top}` }}>
      <Progress percent={percentComp} className="statusBar-progress" progress />
      <div className="statusBar-ratio">
        <p>Question: {quizGuesses.length} / {quizAnswers.length}</p>
        <p>Score: {quizGuesses.filter(x => x).length}</p>
        <p>{ msToTime(time) }</p>
      </div>
    </div>
  )
}

export default statusBar