import React from 'react';

const QuestionBox = (props) => {

  let country, answerResult, alpha

  alpha = props.quizAnswers[props.activeNum]
  country = props.geoPath
    .find(x => x.properties["alpha3Code"] === alpha)
    .properties.name;

  answerResult = props.answerResultFunc()

  return (
    <div>
      Where is {country}?
      {answerResult}
    </div>
  )
}

export default QuestionBox