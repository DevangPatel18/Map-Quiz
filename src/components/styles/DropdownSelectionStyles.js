import styled from 'styled-components';
import { isMobile } from 'react-device-detect';
import { connect } from 'react-redux';

const DropdownSelectionStyles = styled.div`
  transition: all 0.5s;
  display: flex;
  transform-origin: center center;
  transform: ${isMobile ? 'scale(0.7)' : 'scale(1)'};
  align-items: flex-end;
  flex-direction: column;

  .countrySearch {
    padding: 1em;
    width: 100%;
  }

  .regionButtons {
    padding: 1em;
    width: 100%;
  }
`;

const mapStateToProps = state => {
  const { quiz } = state.quiz;
  return { quiz };
};

export default connect(mapStateToProps)(DropdownSelectionStyles);
