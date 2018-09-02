import React from 'react';

const QuestionBox = (props) => {

  let country, answerResult, alpha, questionBoxContent;

  alpha = props.quizAnswers[props.activeNum]
  country = props.geoPath
    .find(x => x.properties["alpha3Code"] === alpha)
    .properties.name;

  if(props.activeNum === props.quizGuesses.length - 1){
    answerResult = props.answerResultFunc()
  }

  if(props.activeNum !== props.quizAnswers.length) {
    questionBoxContent =
      <div>
        Where is {country}?
        {answerResult}
      </div>
  } else {
    answerResult = props.answerResultFunc()
    questionBoxContent =
      <div>
        {answerResult}
      </div>
  }

  return (
    <div>
      {questionBoxContent}
    </div>
  )
}

export default QuestionBox