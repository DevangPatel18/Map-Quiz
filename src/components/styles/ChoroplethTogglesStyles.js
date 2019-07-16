import styled from 'styled-components';

const ChoroplethTogglesStyles = styled.div`
  .ui.icon.circular.button.toggle.drawer-button {
    position: absolute;
    left: 1em;
    bottom: 1em;
    transform: translateY(-50%);
  }

  .choropanel {
    background: rgba(0, 0, 0, 0, 0);
    color: white;
    margin: 0 auto;

    p {
      font-size: ${props => (props.isMobile ? '1.1em' : '1.5em')};
    }

    form {
      transform: ${props =>
        props.isMobile ? 'translateY(-20%) scale(.7)' : 'scale(1)'};
    }

    .close-button {
      position: absolute;
      top: 0px;
      right: 0px;
      border-top-right-radius: 1rem;
      margin: 3px 8px;
      cursor: pointer;
    }
  }

  .choropanel-toggles {
    padding: ${props => (props.isMobile ? '0.5em 0' : '1em 0')};
  }

  .ui.toggle.checkbox {
    background: rgba(255, 255, 255, 0.5);
    padding: 0.5em;
    border-radius: 2em;
    width: 11em;
    font-weight: 600;
    /* font-size: .8em */
  }

  .chorolegend {
    position: absolute;
    bottom: 6rem;
    left: 1em;
    padding: 1em;
    font-size: ${props => (props.isMobile ? '0.5em' : '1em')};
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
      /* line-height: ${props => (props.isMobile ? '1.4em' : '2em')}; */
    }

    .legendColor {
      margin-right: 5px;
      width: 2em;
    }
  }
`;

export default ChoroplethTogglesStyles;
