import styled from 'styled-components';
import { isMobile } from 'react-device-detect';

const StatusBarStyles = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 100%;
  transition: all 0.5s;
  padding: 1em 0;

  top: ${props => (props.isQuizActive ? '0rem' : '-7rem')};

  .statusBar-progress {
    position: relative;
    width: 45%;
  }

  .statusBar-ratio {
    font-size: ${isMobile ? '12px' : '17px'};
    color: white;
    font-weight: bolder;
    text-shadow: 2px 2px 4px black;
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
`;

export default StatusBarStyles;
