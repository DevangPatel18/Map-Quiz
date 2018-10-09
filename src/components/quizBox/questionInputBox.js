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
    let text;

    if (activeQuestionNum !== quizAnswers.length) {
      if (typeTest) {
        text = `Enter the ${testing} of the highlighted country`;
        return (
          <div className="quizPrompt">
            <div className="qInputText">{ text }</div>
            <form onSubmit={this.handleSubmit}>
              <Input type="text" autoFocus size="mini" value={userGuess} onChange={this.handleChange} />
              <Button type="submit" size="small" compact className="qSubmit">Submit</Button>
            </form>
          </div>
        );
      }
      const alpha = quizAnswers[activeQuestionNum];
      const region = geographyPaths
        .find(x => x.properties.alpha3Code === alpha)
        .properties[testing];

      if (testing === 'flag') {
        return (<img src={region} className="qFlag" display="block" height="100px" alt="" />);
      }
      return (<div className="quizPrompt quizName">{region}</div>);
    }
    return handleAnswer();
  }
}

export default QuestionBox;
