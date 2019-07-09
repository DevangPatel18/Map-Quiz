import React, { Component } from 'react';
import { Button, Form, Radio } from 'semantic-ui-react';
import { isMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import QuizMenu from '../styles/QuizMenuStyles';
import { setRegionCheckbox } from '../../actions/mapActions';
import { startQuiz, closeQuiz, setLabel } from '../../actions/quizActions';

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
    };
    this.handleQuizChange = this.handleQuizChange.bind(this);
    this.handleLabelToggle = this.handleLabelToggle.bind(this);
    this.handleCheckBox = this.handleCheckBox.bind(this);
    this.handleRegionMenu = this.handleRegionMenu.bind(this);

    this.start = this.start.bind(this);
  }

  handleQuizChange(event, { value }) {
    this.setState({ quizType: value });
  }

  handleLabelToggle(marker) {
    const { setLabel, quiz } = this.props;
    const { markerToggle } = quiz;
    const parentMarker =
      markerToggle === '' || marker !== markerToggle ? marker : '';
    setLabel(parentMarker);
  }

  handleRegionMenu(display) {
    this.setState({ regionMenu: !this.state.regionMenu });
  }

  handleCheckBox(e) {
    const { setRegionCheckbox, map } = this.props;
    const { checkedRegions } = map;
    const { value, checked } = e.target;
    // check if nothing is selected
    const nothing = Object.keys(checkedRegions)
      .filter(region => region !== value)
      .every(region => !checkedRegions[region]);

    if (!(!checked && nothing)) {
      setRegionCheckbox(value);
    }
  }

  start() {
    const { startQuiz } = this.props;
    const { quizType } = this.state;

    startQuiz(quizType);
  }

  render() {
    const { quizType, regionMenu } = this.state;
    const { markerToggle, quiz } = this.props.quiz;
    const { checkedRegions, currentMap } = this.props.map;
    const countryLabel = markerToggle === 'name';
    const capitalLabel = markerToggle === 'capital';
    const formSize = isMobile ? 'mini' : 'small';

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
            {currentMap === 'World' && (
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
            {currentMap !== 'World' && (
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

          {currentMap === 'World' && (
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
    return null;
  }
}

const mapStateToProps = state => ({
  map: state.map,
  quiz: state.quiz,
});

export default connect(
  mapStateToProps,
  { setRegionCheckbox, startQuiz, closeQuiz, setLabel }
)(QuizBox);
