import styled from 'styled-components';

const QuizMenu = styled.div`
  font-size: ${props => (props.isMobile ? '5px' : '16px')};
  position: absolute;
  top: 98px;
  right: 14px;
  padding: 1.7em;
  min-width: 100px;
  min-height: 130px;
  border-radius: 1rem 0 1rem 1rem;
  background: rgba(0, 0, 0, 0.5);
  /* display: flex; */
  /* flex-direction: column; */
  /* justify-content: 'space-around'; */
  /* align-items: center; */
  
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
    font-size: ${props => (props.isMobile ? '.8em' : '1.1em')};
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
`;

export default QuizMenu;
