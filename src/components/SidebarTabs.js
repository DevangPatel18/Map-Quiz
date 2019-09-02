import React from 'react';
import { Tab } from 'semantic-ui-react';
import TabStyles from './styles/TabStyles';
import DropdownSelectionStyles from './styles/DropdownSelectionStyles';
import RegionButtons from './regionButtons';
import RegionSearch from './RegionSearch';
import QuizBox from './quizBox/quizBox';
import ChoroplethToggles from './ChoroplethToggles';
import About from './About';

const panes = [
  {
    menuItem: { key: 'Quiz', content: 'Quiz' },
    render: () => (
      <Tab.Pane attached={false}>
        <DropdownSelectionStyles>
          <RegionButtons />
          <RegionSearch />
        </DropdownSelectionStyles>
        <QuizBox />
      </Tab.Pane>
    ),
  },
  {
    menuItem: { key: 'Choropleth', content: 'Choropleth' },
    render: () => (
      <Tab.Pane attached={false}>
        <ChoroplethToggles />
      </Tab.Pane>
    ),
  },
  {
    menuItem: { key: 'About', icon: 'question circle outline' },
    render: () => (
      <Tab.Pane attached={false}>
        <About />
      </Tab.Pane>
    ),
  },
];

const SidebarTabs = () => (
  <TabStyles menu={{ secondary: true, pointing: true }} panes={panes} />
);

export default SidebarTabs;
