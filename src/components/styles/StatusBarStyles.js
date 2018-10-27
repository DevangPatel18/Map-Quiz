import styled from 'styled-components';

const StatusBarStyles = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 100%;
  transition: all 0.5s;
  padding: 1em 0;

  top: ${props => (props.quiz ? '0rem' : '-7rem')};

  .statusBar-progress {
    position: relative;
    padding-top: 1rem;
    width: 50%;
  }

  .statusBar-ratio {
    font-size: ${props => (props.mobile ? '12px' : '17px')};
    position: absolute;
    right: 1em;
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    p {
      margin: 0;
    }
  }

  .ui.progress.statusBar-progress {
    margin: 0;

    .bar {
      transition-duration: 1s;
    }
  }

  .statusBar-timerButtons {
    position: absolute;
    left: 1em;
    top: 1em;
  }

  .ui.inverted.red.button {
    margin-right: 1em;
  }
`;

export default StatusBarStyles;
