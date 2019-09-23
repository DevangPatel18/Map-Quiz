import React, { Component } from 'react';
import { Button, Form, Radio } from 'semantic-ui-react';
import { isMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import QuizMenu from '../styles/QuizMenuStyles';
import { setRegionCheckbox, tooltipToggle } from '../../actions/mapActions';
import {
  startQuiz,
  closeQuiz,
  setLabel,
  toggleExternalRegions,
} from '../../actions/quizActions';

const generateQuizOptions = regionType => [
  { label: `Click ${regionType}`, value: 'click_name' },
  { label: `Type ${regionType}`, value: 'type_name' },
  { label: 'Click Capital', value: 'click_capital' },
  { label: 'Type Capital', value: 'type_capital' },
  { label: `Click ${regionType} from matching Flag`, value: 'click_flag' },
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

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

class QuizBox extends Component {
  constructor() {
    super();

    this.state = {
      quizType: 'click_name',
      regionMenu: false,
    };
  }

  handleQuizChange = (event, { value }) => {
    this.setState({ quizType: value });
  };

  handleLabelToggle = marker => {
    const { setLabel, quiz } = this.props;
    const { markerToggle } = quiz;
    const parentMarker =
      markerToggle === '' || marker !== markerToggle ? marker : '';
    setLabel(parentMarker);
  };

  handleRegionMenu = () => {
    this.setState({ regionMenu: !this.state.regionMenu });
  };

  handleCheckBox = e => {
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
  };

  start = () => {
    const { startQuiz } = this.props;
    const { quizType } = this.state;
    startQuiz(quizType);
  };

  render() {
    const { quizType, regionMenu } = this.state;
    const { quiz, map, toggleExternalRegions, tooltipToggle } = this.props;
    const { markerToggle, areExternalRegionsOnQuiz } = quiz;
    const { checkedRegions, currentMap, subRegionName, tooltip } = map;
    const regionLabel = markerToggle === 'name';
    const capitalLabel = markerToggle === 'capital';
    const formSize = isMobile ? 'mini' : 'small';

    const subRegionNameCap = capitalize(subRegionName);
    const quizOptions = generateQuizOptions(subRegionNameCap);

    return (
      <QuizMenu regionMenu={regionMenu}>
        <div>
          <Button
            size={formSize}
            onClick={this.start}
            className="startButton"
            aria-label="start quiz"
          >
            START QUIZ
          </Button>
          <Form size={formSize}>
            {quizOptions.map(form => (
              <Form.Field key={form.value}>
                <Radio
                  aria-label={form.label}
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
              aria-label="Toggle Quiz Regions"
              size={formSize}
              className="regionDrawer"
              onClick={this.handleRegionMenu}
            />
          )}
          {currentMap !== 'World' && (
            <div className="App-quiz-toggle">
              <Button
                toggle
                size={formSize}
                active={areExternalRegionsOnQuiz}
                onClick={toggleExternalRegions}
                aria-label="toggle external regions for quizzes"
                style={{ width: '9em', margin: '1.5em 0', padding: '0.8em' }}
              >
                {'Include external regions'}
              </Button>
              <div className="App-quiz-toggle-header">TOGGLE LABEL</div>
              <Button.Group size={formSize} compact>
                <Button
                  toggle
                  active={regionLabel}
                  onClick={() => this.handleLabelToggle('name')}
                  aria-label="toggle region names"
                >
                  {subRegionNameCap}
                </Button>
                <Button.Or aria-label="or" />
                <Button
                  toggle
                  active={capitalLabel}
                  onClick={() => this.handleLabelToggle('capital')}
                  aria-label="toggle region capitals"
                >
                  {'Capital'}
                </Button>
              </Button.Group>
            </div>
          )}

          <div style={{ marginTop: '2rem' }}>
            <Radio
              slider
              fitted
              size={formSize}
              label={`Tooltip`}
              checked={tooltip}
              onChange={tooltipToggle}
              style={{}}
            />
          </div>
        </div>

        {currentMap === 'World' && (
          <Form className="fmRegionSelect">
            {checkedRegionsLabels.map(region => (
              <Form.Field
                aria-label={region}
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
}

const mapStateToProps = state => ({
  map: state.map,
  quiz: state.quiz,
});

export default connect(
  mapStateToProps,
  {
    setRegionCheckbox,
    startQuiz,
    closeQuiz,
    setLabel,
    tooltipToggle,
    toggleExternalRegions,
  }
)(QuizBox);
