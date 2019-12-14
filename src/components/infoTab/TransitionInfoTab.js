import React from 'react';
import { connect } from 'react-redux';
import { TransitionMotion, spring } from 'react-motion';
import InfoTab from './InfoTab';

const MOTIONCONFIG = { stiffness: 300, damping: 15 };

const TransitionInfoTab = ({ name, infoTabShow }) => {
  return (
    <TransitionMotion
      defaultStyles={[
        {
          key: name,
          style: { x: -230, opacity: 0 },
        },
      ]}
      styles={[
        {
          key: name,
          style: {
            x: spring(infoTabShow ? 15 : -230, MOTIONCONFIG),
            opacity: spring(infoTabShow ? 1 : 0, MOTIONCONFIG),
          },
        },
      ]}
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
              <InfoTab />
            </div>
          ))}
        </div>
      )}
    </TransitionMotion>
  );
};

const mapStateToProps = state => ({
  name: state.quiz.selectedProperties.name,
  infoTabShow: state.quiz.infoTabShow,
});

export default connect(mapStateToProps)(TransitionInfoTab);
