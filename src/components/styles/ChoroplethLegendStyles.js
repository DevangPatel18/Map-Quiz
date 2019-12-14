import styled from 'styled-components';
import { isMobile } from 'react-device-detect';

const ChoroplethLegendStyles = styled.div`
    position: absolute;
    bottom: 1em;
    left: 1em;
    padding: 1em;
    font-size: ${isMobile ? '0.5em' : '1em'};
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: 1rem;
    letter-spacing: 1px;

    .legendTitle {
      margin-bottom: 0.7em;
      font-weight: 600;
    }

    .legendItem {
      display: flex;
      flex-direction: row;
      line-height: 1.5em;
    }

    .legendColor {
      margin-right: 5px;
      width: 2em;

      :hover {
        border: 1px solid rgb(255, 255, 0);
      }
    }
`;

export default ChoroplethLegendStyles;
