import React from 'react';
import { isMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import TransitionInfoTab from './infoTab/TransitionInfoTab';
import StatusBar from './StatusBar';
import MobileMessage from './MobileMessage';
import ZoomButtons from './ZoomButtons';
import ChoroplethLegend from './ChoroplethLegend';
import ChoroplethSlider from './ChoroplethSlider';
import DirectionPad from './DirectionPad';
import QuestionBox from './quizBox/QuestionBox';

const InterfaceElements = ({ quiz: { isQuizActive } }) => (
  <>
    <ZoomButtons />
    <TransitionInfoTab />
    <DirectionPad />
    {isMobile && <MobileMessage />}
    {isQuizActive && <QuestionBox />}
    {isQuizActive && <StatusBar />}
    {!isQuizActive && <ChoroplethLegend />}
    {!isQuizActive && <ChoroplethSlider />}
  </>
);

const mapStateToProps = state => ({
  quiz: state.quiz,
});

export default connect(
  mapStateToProps,
  null
)(InterfaceElements);
