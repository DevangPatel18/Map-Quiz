import styled from 'styled-components';
import { isMobile } from 'react-device-detect';

const QuizMenu = styled.div`
  font-size: ${isMobile ? '5px' : '16px'};
  padding: 1.7em;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row-reverse;

  .ui.button.regionDrawer {
    margin: 1em 0;
  }

  .ui.button {
    margin-bottom: 1em;
  }

  .ui.button.App-quiz-close {
    border-radius: 0;
    padding: 4px;
  }

  &&& label,
  &&& label:hover,
  &&& .checked label {
    color: white;
    font-size: ${isMobile ? '.8em' : '1.1em'};
  }

  &&&& .fmRegionSelect label,
  &&&& .fmRegionSelect label:hover,
  &&&& .fmRegionSelect .checked label {
    color: white;
    font-size: ${isMobile ? '.6em' : '.9em'};
  }

  && .fmRegionSelect {
    display: ${props => (props.regionMenu ? 'flex' : 'none')};
    flex-direction: column;
    justify-content: center;
    margin: 0 auto;

    .field {
      margin: 0;

      label {
        display: flex;
        align-items: center;
        margin: 0;

        input {
          margin-right: 0.4em;
        }
      }
    }
  }

  .App-quiz-toggle {
    margin-top: 1em;
    border-top: 1px solid white;
  }

  .App-quiz-toggle-header {
    font-size: 1rem;
    padding: 0.7em;
    color: white;
  }

  .form {
    text-align: left;
    width: ${isMobile ? '130px' : '160px'};
    margin: 0 auto;
  }

  .ui.mini.form .field {
    margin: 0.2em;
  }

  .ui.slider.checkbox {
    background: rgba(255, 255, 255, 0.5);
    padding: 1em;
    border-radius: 2em;
    width: 11em;
    font-weight: 600;
  }
`;

export default QuizMenu;
