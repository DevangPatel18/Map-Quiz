import React from 'react';
import { Tab } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../components/styles/RegionModalStyles';

export const generateTabContent = (displayData, sectionName) => (
  <Tab.Pane>
    <JSONTree data={displayData[sectionName]} theme={theme} />
  </Tab.Pane>
);
