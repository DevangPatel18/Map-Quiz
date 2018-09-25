import React from 'react';

const QuestionBox = (props) => {

  let { quizAnswers, quizGuesses, geographyPaths, activeQuestionNum } = props.quizData
  let country, answerResult, alpha, questionBoxContent;

  alpha = quizAnswers[activeQuestionNum]
  country = geographyPaths
    .find(x => x.properties["alpha3Code"] === alpha)
    .properties[props.testing];

  if(activeQuestionNum === quizGuesses.length - 1){
    answerResult = props.answerResultFunc()
  }

  if(props.testing === "flag") {
    country = <div className="qFlag"><img src={country} display="block" height="100px" border="1px solid black" alt=""/></div>
  }

  if(activeQuestionNum !== quizAnswers.length) {
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

  return (<div>{questionBoxContent}</div>)
}

export default QuestionBox