import styled from 'styled-components';

const DropdownSelectionStyles = styled.div`
  position: absolute;
  top: ${props => (props.quiz ? '-8em' : '0em')};
  right: 1em;
  transition: all 0.5s;
  display: flex;
  transform-origin: top right;
  transform: ${props => (props.isMobile ? 'scale(0.7)' : 'scale(1)')};
  align-items: flex-end;

  @media (orientation: portrait) and (max-width: 500px), (max-width: 660px) {
    flex-direction: column-reverse;
  }

  .countrySearch {
    margin-top: 1em;
    width: 280px;
  }

  .regionButtons {
    margin: 1em 0 0 1em;
    width: 220px;
  }
`;

export default DropdownSelectionStyles;
