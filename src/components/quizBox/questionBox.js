import React, { Component } from 'react';
import { Button, Input } from 'semantic-ui-react';
import { isMobile } from 'react-device-detect';

const quizPromptMobile = {
  fontSize: '11px',
  padding: '.2em',
  width: '230px',
  top: 'auto',
  bottom: '.5em',
}

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
        const mobileStyle = isMobile ? quizPromptMobile : {};
        const submitClass = isMobile ? 'qSubmit-mobile' : 'qSubmit';
        const textPad = isMobile ? { padding: '.1em .3em' } : {};
        return (
          <div className="quizPrompt" style={mobileStyle}>
            <div className="qInputText" style={textPad}>{ text }</div>
            <form onSubmit={this.handleSubmit}>
              <Input type="text" autoFocus size="mini" value={userGuess} onChange={this.handleChange} />
              <div>
                <Button type="submit" size="small" compact className={submitClass}>Submit</Button>
              </div>
            </form>
          </div>
        );
      }
      const alpha = quizAnswers[activeQuestionNum];
      const region = geographyPaths
        .find(x => x.properties.alpha3Code === alpha)
        .properties[testing];

      const flagHeight = isMobile ? '50px' : '100px';
      const flagClass = isMobile ? 'qFlag-mobile' : 'qFlag';
      if (testing === 'flag') {
        return (<img src={region} className={flagClass} display="block" height={flagHeight} alt="" />);
      }
      return (<div className="quizPrompt quizName">{region}</div>);
    }
    return handleAnswer();
  }
}

export default QuestionBox;
