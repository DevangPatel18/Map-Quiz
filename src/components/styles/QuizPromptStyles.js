import styled, { css } from 'styled-components';
import { isMobile } from 'react-device-detect';

const QuizPrompt = styled.div`
  position: absolute;
  top: 53px;
  right: 50%;
  transform: translateX(50%);
  padding: 0.7em;
  border-radius: 0.5em;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 1.1em;
  z-index: 2;

  ${props =>
    isMobile &&
    props.typeTest &&
    css`
      font-size: 11px;
      padding: 0.2em;
      width: 230px;
      top: auto;
      bottom: 0.5em;
    `}

  div {
    padding: 0.5em 0.3em;
  }

  .qInputText {
    ${isMobile &&
      css`
        padding: 0.1em 0.3em;
      `};
  }

  form {
    display: flex;
    align-items: center;
  }

  .ui.mini.input,
  .ui.small.input {
    width: 100%;
  }

  .ui.mini.form .field {
    margin: 0.2em;
  }

  .ui.small.form {
    width: 160px;
    text-align: left;
  }

  .ui.mini.form {
    width: 130px;
    text-align: left;
  }

  .ui.small.button {
    margin-left: 0.3em;
    padding: ${isMobile ? '5px 0.5em' : '12.7px 0.5em'};
  }

  button.ui.button {
    margin: 0;
  }

  .quizName {
    font-size: 1.5rem;
    font-weight: bolder;
  }
`;

const QuizFlag = styled.div`
  .qFlag {
    position: absolute;
    top: 53px;
    right: 50%;
    transform: translateX(50%);
    border: 1px solid black;
  }
`;

export const FinalDialogButtons = styled.div`
  display: flex;
  margin-top: 0.5em;
  justify-content: center;
`;

export const TableContainer = styled.div`
  max-height: ${props =>
    isMobile && props.orientation === 'landscape' ? '35vh' : '60vh'};
  overflow: auto;
  background: rgba(255, 255, 255, 0.1);
`;

export default QuizPrompt;
export { QuizFlag };
