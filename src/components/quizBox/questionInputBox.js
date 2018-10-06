import React, { Component } from 'react';
import { Button, Input } from 'semantic-ui-react';

class QuestionBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userGuess: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ userGuess: event.target.value });
  }

  handleSubmit(event) {
    const { userGuess } = this.state;
    const { handleAnswer } = this.props;
    event.preventDefault();
    if (userGuess.length !== 0) {
      handleAnswer(userGuess);
      this.setState({ userGuess: '' });
    }
  }

  render() {
    const { userGuess } = this.state;
    const { quizData, quizType, handleAnswer } = this.props;
    const { quizAnswers, geographyPaths, activeQuestionNum } = quizData;
    const [type, testing] = quizType.split('_');
    const typeTest = type === 'type';
    let text; let questionBoxContent;

    if (typeTest) {
      text = `Enter the ${testing} of the highlighted country`;
      questionBoxContent = (
        <div>
          <p>{ text }</p>
          <form onSubmit={this.handleSubmit}>
            <Input type="text" autoFocus value={userGuess} onChange={this.handleChange} />
            <Button type="submit" size="large" className="qSubmit">Submit</Button>
          </form>
        </div>
      );
    } else {
      const alpha = quizAnswers[activeQuestionNum];
      let region = geographyPaths
        .find(x => x.properties.alpha3Code === alpha)
        .properties[testing];

      if (activeQuestionNum !== quizAnswers.length) {
        if (testing !== 'flag') {
          text = `Where is ${region}?`;
          questionBoxContent = (<div>{ text }</div>);
        } else {
          region = (
            <div className="qFlag">
              <img src={region} display="block" height="100px" border="1px solid black" alt="" />
            </div>
          );
          text = 'Which country does this flag belong to?';
          questionBoxContent = (
            <div>
              { text }
              { region }
            </div>
          );
        }
      }
    }

    if (activeQuestionNum === quizAnswers.length) {
      questionBoxContent = (
        <div>
          {handleAnswer()}
        </div>
      );
    }

    return (
      <div className={type === 'type' ? 'qInputBox' : ''}>
        {questionBoxContent}
      </div>
    );
  }
}

export default QuestionBox;
