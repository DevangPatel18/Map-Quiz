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
import LoadingPrompt from './LoadingPrompt';
import RegionModal from './RegionModal/RegionModal';

const InterfaceElements = ({ isQuizActive, modalRegionID }) => (
  <>
    <ZoomButtons />
    <TransitionInfoTab />
    <DirectionPad />
    <LoadingPrompt />
    {modalRegionID && <RegionModal />}
    {isMobile && <MobileMessage />}
    {isQuizActive && <QuestionBox />}
    {isQuizActive && <StatusBar />}
    {!isQuizActive && <ChoroplethLegend />}
    {!isQuizActive && <ChoroplethSlider />}
  </>
);

const mapStateToProps = state => ({
  isQuizActive: state.quiz.isQuizActive,
  modalRegionID: state.map.modalRegionID,
});

export default connect(mapStateToProps, null)(InterfaceElements);
