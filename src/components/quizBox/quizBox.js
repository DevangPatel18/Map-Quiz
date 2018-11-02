import React, { Component } from 'react';
import { Button, Form, Radio, Modal } from 'semantic-ui-react';
import { isMobile } from 'react-device-detect';
import QuestionBox from './questionBox';
import QuizMenu from '../styles/QuizMenuStyles';
import TimerStyles from '../styles/TimerStyles';
import msToTime from '../../helpers/msToTime';

const quizOptions = [
  { label: 'Click Country', value: 'click_name' },
  { label: 'Type Country', value: 'type_name' },
  { label: 'Click Capital', value: 'click_capital' },
  { label: 'Type Capital', value: 'type_capital' },
  { label: 'Click Country from matching Flag', value: 'click_flag' },
];

const checkedRegionsLabels = [
  'North & Central America',
  'South America',
  'Caribbean',
  'Europe',
  'Africa',
  'Asia',
  'Oceania',
];

class QuizBox extends Component {
  constructor() {
    super();

    this.state = {
      quizType: 'click_name',
      regionMenu: false,
      open: false,
      time: 0,
      timerOn: false,
    };
    this.handleQuizChange = this.handleQuizChange.bind(this);
    this.handleLabelToggle = this.handleLabelToggle.bind(this);
    this.handleCheckBox = this.handleCheckBox.bind(this);
    this.handleRegionMenu = this.handleRegionMenu.bind(this);

    this.pause = this.pause.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.start = this.start.bind(this);
    this.close = this.close.bind(this);
  }

  handleQuizChange(event, { value }) {
    this.setState({ quizType: value });
  }

  handleLabelToggle(marker) {
    const { setToggle, loadData, quizData } = this.props;
    const { fetchRequests, currentMap, markerToggle } = quizData;
    const parentMarker =
      markerToggle === '' || marker !== markerToggle ? marker : '';
    if (
      parentMarker === 'capital' &&
      !fetchRequests.includes(`${currentMap}capital`)
    ) {
      loadData('click_capital', true);
    } else {
      setToggle(parentMarker);
    }
  }

  handleRegionMenu(display) {
    this.setState({ regionMenu: !this.state.regionMenu });
  }

  handleCheckBox(e) {
    const { setQuizRegions, quizData } = this.props;
    const { checkedRegions } = quizData;
    const { value, checked } = e.target;
    // check if nothing is selected
    const nothing = Object.keys(checkedRegions)
      .filter(region => region !== value)
      .every(region => !checkedRegions[region]);

    if (!(!checked && nothing)) {
      setQuizRegions(value, checked);
    }
  }

  pause() {
    const { timerOn } = this.state;
    if (timerOn) {
      clearInterval(this.timer);
      this.setState({ timerOn: false, open: true });
    }
  }

  close() {
    const { closeQuiz } = this.props;
    closeQuiz();
    clearInterval(this.timer);
    this.setState({ time: 0, timerOn: false });
  }

  closeModal() {
    const { timerOn, time } = this.state;
    if (!timerOn) {
      this.setState({ timerOn: true, open: false }, () => {
        const x = Date.now() - time;
        this.timer = setInterval(
          () => this.setState({ time: Date.now() - x }),
          1000
        );
      });
    }
  }

  start() {
    const { handleQuiz } = this.props;
    const { time, timerOn, quizType } = this.state;

    handleQuiz(quizType)
    if (!timerOn) {
      this.setState({ timerOn: true });
      const x = Date.now() - time;
      this.timer = setInterval(
        () => this.setState({ time: Date.now() - x }),
        1000
      );
    }
  }

  render() {
    const { quizType, regionMenu, time, open } = this.state;
    const { quizData, handleAnswer } = this.props;
    const {
      markerToggle,
      currentMap,
      checkedRegions,
      quiz,
      quizGuesses,
      quizAnswers,
    } = quizData;
    const countryLabel = markerToggle === 'name';
    const capitalLabel = markerToggle === 'capital';
    const formSize = isMobile ? 'mini' : 'small';
    const pauseStyle =
      quizGuesses.length === quizAnswers.length ? { display: 'none' } : {};

    if (!quiz) {
      return (
        <QuizMenu isMobile={isMobile} regionMenu={regionMenu}>
          <div>
            <Button
              size={formSize}
              onClick={this.start}
              className="startButton"
            >
              START QUIZ
            </Button>
            <Form size={formSize}>
              {quizOptions.map(form => (
                <Form.Field key={form.value}>
                  <Radio
                    label={form.label}
                    value={form.value}
                    name="quiz"
                    checked={quizType === form.value}
                    onChange={this.handleQuizChange}
                  />
                </Form.Field>
              ))}
            </Form>
            {currentMap === 'world' && (
              <Button
                toggle
                compact
                active={regionMenu}
                content="Toggle Quiz Regions"
                size={formSize}
                className="regionDrawer"
                onClick={this.handleRegionMenu}
              />
            )}
            {currentMap !== 'world' && (
              <div className="App-quiz-toggle">
                <div className="App-quiz-toggle-header">TOGGLE LABEL</div>
                <Button.Group size={formSize} compact>
                  <Button
                    toggle
                    active={countryLabel}
                    onClick={() => this.handleLabelToggle('name')}
                  >
                    {'Country'}
                  </Button>
                  <Button.Or />
                  <Button
                    toggle
                    active={capitalLabel}
                    onClick={() => this.handleLabelToggle('capital')}
                  >
                    {'Capital'}
                  </Button>
                </Button.Group>
              </div>
            )}
          </div>

          {currentMap === 'world' && (
            <Form className="fmRegionSelect">
              {checkedRegionsLabels.map(region => (
                <Form.Field
                  label={region}
                  value={region}
                  key={region}
                  control="input"
                  type="checkbox"
                  checked={checkedRegions[region]}
                  onChange={this.handleCheckBox}
                />
              ))}
            </Form>
          )}
        </QuizMenu>
      );
    }
    return (
      <TimerStyles>
        <QuestionBox
          quizType={quizType}
          quizData={quizData}
          handleAnswer={handleAnswer}
        />
        <div className="statusBar-timerButtons">
          <Button
            size="mini"
            compact
            inverted
            color="red"
            className="statusBar-stop"
            icon="stop"
            onClick={this.close}
          />
          <Button
            size="mini"
            compact
            inverted
            color="blue"
            icon="pause"
            onClick={this.pause}
            style={pauseStyle}
          />
          <p>{msToTime(time)}</p>
        </div>
        <Modal
          basic
          dimmer="blurring"
          open={open}
          onClose={this.closeModal}
          closeOnDimmerClick={false}
          style={{ textAlign: 'center' }}
        >
          <Button
            inverted
            color="green"
            size="massive"
            content="Resume"
            onClick={this.closeModal}
          />
        </Modal>
      </TimerStyles>
    );
  }
}

export default QuizBox;
