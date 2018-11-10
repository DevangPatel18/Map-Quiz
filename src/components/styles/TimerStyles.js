import styled from 'styled-components';

const TimerStyles = styled.div`
  .statusBar-timerButtons {
    position: absolute;
    transition: all 0.5s;
    position: absolute;
    left: 1em;
    top: 1em;
    z-index: 2;
  }

  .statusBar-timer {
    position: absolute;
    font-size: ${props => (props.mobile ? '12px' : '17px')};
    right: 1em;
    top: 3.9em;
  }

  .ui.inverted.red.button {
    margin-right: 1em;
  }
`;

export default TimerStyles;
