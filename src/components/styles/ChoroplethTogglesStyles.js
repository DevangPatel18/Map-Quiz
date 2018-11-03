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
`;

export default ChoroplethTogglesStyles;
