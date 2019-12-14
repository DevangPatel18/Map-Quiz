import styled from 'styled-components';
import { isMobile } from 'react-device-detect';

const InfoTabStyles = styled.div`
  text-align: left;
  font-size: ${isMobile ? '9px' : '14px'};

  .infoTab-flag {
    display: block;
    max-width: 16em;
    max-height: 10em;
    background: white;
    border: 1px solid black;
  }

  .infoTab-desc {
    background: rgba(0, 0, 0, 0.6);
    list-style-type: none;
    padding: 0.3em;
    color: white;
    line-height: 1.4;
    letter-spacing: 1px;
  }

  sup {
    font-size: 0.6em;
  }

  .infoTab-moreInfo {
    text-align: center;
    padding: 0.5em 0;

    .ui.button {
      margin: 0;
      font-size: 1em;
    }
  }
`;

export default InfoTabStyles;
