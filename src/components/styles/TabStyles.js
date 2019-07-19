import styled from 'styled-components';
import { Tab } from 'semantic-ui-react';

const TabStyles = styled(Tab)`
  &&& .ui.pointing.secondary.menu .item {
    color: white;
  }

  &&& .ui.pointing.secondary.menu {
    border-bottom: 2px solid rgba(255, 255, 255, 0.4);

    .active {
      border-color: white;
    }
  }

  &&& .ui.segment.active.tab {
    background: rgba(0, 0, 0, 0);
    box-shadow: none;
    border: none;
    padding: 0;
  }
`;

export default TabStyles;
