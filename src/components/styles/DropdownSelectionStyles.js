import styled, { css } from 'styled-components';
import { isMobile } from 'react-device-detect';
import { connect } from 'react-redux';

const DropdownSelectionStyles = styled.div`
  transition: all 0.5s;
  display: flex;
  transform-origin: center center;
  align-items: flex-end;
  flex-direction: column;

  ${isMobile &&
    css`
      .ui.selection.dropdown {
        font-size: 0.8em;

        .menu > .item {
          font-size: 0.8em;
        }
      }
    `}

  .regionSearch {
    padding: 1em;
    width: 100%;
  }

  .mapViewDropdown {
    padding: 1em;
    width: 100%;
  }
`;

const mapStateToProps = state => {
  const { quiz } = state.quiz;
  return { quiz };
};

export default connect(mapStateToProps)(DropdownSelectionStyles);
