import styled from 'styled-components';
import { isMobile } from 'react-device-detect';

const ChoroplethTogglesStyles = styled.div`
  color: white;
  margin: 0 auto;

  p {
    font-size: ${isMobile ? '1.1em' : '1.5em'};
  }

  form {
    transform: ${isMobile ? 'translateY(-20%) scale(.7)' : 'scale(1)'};
  }

  .choropanel-toggles {
    padding: ${isMobile ? '0.5em 0' : '1em 0'};
  }

  .ui.icon.circular.button.toggle.drawer-button {
    position: absolute;
    left: 1em;
    bottom: 1em;
    transform: translateY(-50%);
  }

  .ui.toggle.checkbox,
  .ui.slider.checkbox {
    background: rgba(255, 255, 255, 0.5);
    padding: 0.5em;
    border-radius: 2em;
    width: 11em;
    font-weight: 600;
  }

  .ui.slider.checkbox {
    width: 13em;
    padding: 1em;
  }
`;

export default ChoroplethTogglesStyles;
