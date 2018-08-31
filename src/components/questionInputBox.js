import React, { Component } from 'react';

class QuestionInputBox extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userGuess: "",
      answerResult: null
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({userGuess: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    if(this.state.userGuess.length !== 0) {
      let result = this.props.answerResultFunc(this.state.userGuess)
  
      this.setState({userGuess: "", answerResult: result})
    }
  }

  render() {

    let next

    if(this.props.activeNum === this.props.quizGuesses.length - 1) {
      next = this.state.answerResult;
    } else {
      next = 
        <div>
          <p>Enter the name of the highlighted country</p>
          <form onSubmit={this.handleSubmit}>
            <input type="text" value={this.state.userGuess} onChange={this.handleChange} />
            <button type="submit">Submit</button>
          </form>
        </div>
    }

    return (
      <div>
        {next}
      </div>
    )
  }
}

export default QuestionInputBox