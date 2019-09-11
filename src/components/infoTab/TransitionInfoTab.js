import React from 'react';
import { connect } from 'react-redux';
import { TransitionMotion, spring } from 'react-motion';
import InfoTab from './InfoTab';

const MOTIONCONFIG = { stiffness: 300, damping: 15 };

const TransitionInfoTab = ({ quiz }) => {
  return (
    <TransitionMotion
      defaultStyles={[quiz.selectedProperties].map(infoProp => ({
        key: infoProp.name,
        style: { x: -230, opacity: 0 },
        data: infoProp,
      }))}
      styles={[quiz.selectedProperties].map(infoProp => ({
        key: infoProp.name,
        style: {
          x: spring(quiz.infoTabShow ? 15 : -230, MOTIONCONFIG),
          opacity: spring(quiz.infoTabShow ? 1 : 0, MOTIONCONFIG),
        },
        data: infoProp,
      }))}
    >
      {interpolatedStyles => (
        <div>
          {interpolatedStyles.map(config => (
            <div
              key={config.key}
              style={{
                position: 'absolute',
                zIndex: '2',
                left: `${config.style.x}px`,
                top: '182px',
                opacity: `${config.style.opacity}`,
              }}
            >
              <InfoTab regionData={config.data} />
            </div>
          ))}
        </div>
      )}
    </TransitionMotion>
  );
};

const mapStateToProps = state => ({
  quiz: state.quiz,
});

export default connect(
  mapStateToProps,
  null
)(TransitionInfoTab);
