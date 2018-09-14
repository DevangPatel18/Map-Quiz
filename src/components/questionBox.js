import React from 'react';

const QuestionBox = (props) => {

  let country, answerResult, alpha, questionBoxContent;

  alpha = props.quizAnswers[props.activeNum]
  country = props.geoPath
    .find(x => x.properties["alpha3Code"] === alpha)
    .properties[props.testing];

  if(props.activeNum === props.quizGuesses.length - 1){
    answerResult = props.answerResultFunc()
  }

  if(props.testing === "flag") {
    country = <div className="qFlag"><img src={country} display="block" height="100px" border="1px solid black" alt=""/></div>
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