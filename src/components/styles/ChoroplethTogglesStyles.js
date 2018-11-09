import styled from 'styled-components';

const ChoroplethTogglesStyles = styled.div`
  .ui.icon.circular.button.toggle.drawer-button {
    position: absolute;
    left: 1em;
    top: 50%;
    transform: translateY(-50%);

    :hover {
    }
  }

  .choropanel {
    display: ${props => (props.show ? 'block' : 'none')};
    position: absolute;
    padding: 1.7em;
    border-radius: 1rem;
    top: 30%;
    transform: translateX(-50%);
    left: 50%;
    background: rgba(0, 0, 0, 0.5);
    color: white;
  }

  .choropanel-toggles {
    padding: 1em 0;
  }

  .ui.toggle.checkbox {
    background: rgba(255, 255, 255, 0.5);
    padding: 0.5em;
    border-radius: 2em;
    width: 11em;
    font-weight: 600;
  }

  .chorolegend {
    position: absolute;
    bottom: 1em;
    left: 1em;
    padding: 1em;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: 1rem;

    .legendColor {
      margin-right: 5px;
    }
  }
`;

export default ChoroplethTogglesStyles;
