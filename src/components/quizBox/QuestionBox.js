import React, { Component } from 'react';
import { Button, Input, Table } from 'semantic-ui-react';
import { isMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import QuizPrompt, {
  QuizFlag,
  FinalDialogButtons,
  TableContainer,
} from '../styles/QuizPromptStyles';
import {
  startQuiz,
  closeQuiz,
  processTypeAnswer,
} from '../../actions/quizActions';
import { capitalize } from '../../helpers/textHelpers';

class QuestionBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userGuess: '',
    };
  }

  handleChange = event => this.setState({ userGuess: event.target.value });

  handleSubmit = event => {
    const { userGuess } = this.state;
    const { processTypeAnswer } = this.props;
    event.preventDefault();
    if (userGuess.length !== 0) {
      processTypeAnswer(userGuess);
      this.setState({ userGuess: '' });
    }
  };

  handleRestartQuiz = async () => {
    const { quizType } = this.props.quiz;
    const { startQuiz, closeQuiz } = this.props;
    await closeQuiz();
    startQuiz(quizType);
  };

  handleTypePrompt = testing => {
    const { userGuess } = this.state;
    const { subRegionName } = this.props.map;
    const { isQtnFixed } = this.props.quiz;
    const text = `Enter the ${testing} of ${
      isQtnFixed ? `the highlighted` : 'any'
    } ${subRegionName}`;
    const inputSize = isMobile ? 'mini' : 'small';
    return (
      <QuizPrompt typeTest={true}>
        <div className="qInputText">{text}</div>
        <form onSubmit={this.handleSubmit}>
          <Input
            type="text"
            aria-label="user guess"
            autoFocus
            size={inputSize}
            value={userGuess}
            onChange={this.handleChange}
          />
          <div>
            <Button
              type="submit"
              size="small"
              aria-label="submit answer"
              compact
            >
              Submit
            </Button>
          </div>
        </form>
      </QuizPrompt>
    );
  };

  handleFlagPrompt = region => (
    <QuizFlag>
      <img
        src={region}
        className="qFlag"
        display="block"
        height={isMobile ? '50px' : '100px'}
        alt=""
      />
    </QuizFlag>
  );

  handleNamePrompt = region => (
    <QuizPrompt>
      <span className="quizName">{region}</span>
    </QuizPrompt>
  );

  handleFinalDialog = () => {
    const { quiz, closeQuiz } = this.props;
    const { quizGuesses, quizAnswers } = quiz;

    const incorrectResponseTable = this.handleIncorrectResponseTable();
    const score = quizGuesses.reduce((a, b) => a * 1 + b * 1);
    const finalText = `Your score is ${score} / ${
      quizAnswers.length
    } (${Math.round((score / quizAnswers.length) * 100)}%)`;
    return (
      <QuizPrompt>
        <div>
          <div>{finalText}</div>
          {incorrectResponseTable}
          <FinalDialogButtons>
            <Button
              onClick={closeQuiz}
              size="large"
              compact
              content="CANCEL"
              style={{ marginRight: '1rem' }}
              aria-label="cancel quiz"
            />
            <Button
              onClick={this.handleRestartQuiz}
              size="large"
              compact
              content="RESTART"
              aria-label="restart quiz"
            />
          </FinalDialogButtons>
        </div>
      </QuizPrompt>
    );
  };

  handleIncorrectResponseTable = () => {
    const { subRegionName, orientation } = this.props.map;
    const answerTableData = this.getIncorrectResponseList();

    if (answerTableData.length === 0) return;

    const { headerCell, tableRows } = this.getTableContent(answerTableData);

    return (
      <>
        <h3 style={{ margin: '0.4em' }}>Incorrect Responses</h3>
        <TableContainer orientation={orientation}>
          <Table basic="very" textAlign="center" celled compact inverted unstackable>
            <Table.Body>
              <Table.Row>
                <Table.HeaderCell>{capitalize(subRegionName)}</Table.HeaderCell>
                {headerCell}
              </Table.Row>
              {tableRows}
            </Table.Body>
          </Table>
        </TableContainer>
      </>
    );
  };

  getTableContent = answerTableData => {
    const { quizType } = this.props.quiz;
    const testing = quizType.split('_')[1];
    const tableContent = { headerCell: '', tableRows: '' };

    switch (testing) {
      case 'name':
        tableContent.headerCell = null;
        tableContent.tableRows = answerTableData.map(({ regionID, name }) => (
          <Table.Row key={regionID}>
            <Table.Cell>{name}</Table.Cell>
          </Table.Row>
        ));
        break;
      case 'capital':
        tableContent.headerCell = <Table.HeaderCell>Capital</Table.HeaderCell>;
        tableContent.tableRows = answerTableData.map(
          ({ regionID, name, capital }) => (
            <Table.Row key={regionID}>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell>{capital}</Table.Cell>
            </Table.Row>
          )
        );
        break;
      case 'flag':
        tableContent.headerCell = <Table.HeaderCell>Flag</Table.HeaderCell>;
        tableContent.tableRows = answerTableData.map(
          ({ regionID, name, flag }) => (
            <Table.Row key={regionID}>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell>
                <img
                  src={flag}
                  alt={`${name}-flag`}
                  height="50"
                  style={{ border: '1px solid black' }}
                />
              </Table.Cell>
            </Table.Row>
          )
        );
        break;
      default:
    }
    return tableContent;
  };

  getIncorrectResponseList = () => {
    const { quizGuesses, quizAnswers } = this.props.quiz;
    const { geographyPaths } = this.props.data;
    return quizAnswers
      .reduce((acc, regionID, idx) => {
        if (!quizGuesses[idx]) {
          acc.push(regionID);
        }
        return acc;
      }, [])
      .reduce((acc, regionID) => {
        const regionGeoPath = geographyPaths.find(
          geoPath => geoPath.properties.regionID === regionID
        );
        if (regionGeoPath) {
          acc.push(regionGeoPath.properties);
        }
        return acc;
      }, []);
  };

  render() {
    const { quizType, quizAnswers, quizIdx } = this.props.quiz;
    const { geographyPaths } = this.props.data;
    const [type, testing] = quizType.split('_');

    if (quizIdx !== quizAnswers.length) {
      if (type === 'type') {
        return this.handleTypePrompt(testing);
      }
      const alpha = quizAnswers[quizIdx];
      const region = geographyPaths.find(x => x.properties.regionID === alpha)
        .properties[testing];

      if (testing === 'flag') {
        return this.handleFlagPrompt(region);
      }
      return this.handleNamePrompt(region);
    }
    return this.handleFinalDialog();
  }
}

const getAppState = createSelector(
  state => state.quiz.quizType,
  state => state.quiz.quizGuesses,
  state => state.quiz.quizAnswers,
  state => state.quiz.quizIdx,
  state => state.quiz.isQtnFixed,
  state => state.map.subRegionName,
  state => state.map.orientation,
  state => state.data.geographyPaths,
  (
    quizType,
    quizGuesses,
    quizAnswers,
    quizIdx,
    isQtnFixed,
    subRegionName,
    orientation,
    geographyPaths
  ) => ({
    quiz: { quizType, quizGuesses, quizAnswers, quizIdx, isQtnFixed },
    map: { subRegionName, orientation },
    data: { geographyPaths },
  })
);

export default connect(
  getAppState,
  { startQuiz, closeQuiz, processTypeAnswer }
)(QuestionBox);
