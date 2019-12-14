import React from 'react';
import { Tab } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../components/styles/RegionModalStyles';
import { generateParagraphs } from './textHelpers';

export const generateTabContent = (displayData, sectionName) => {
  switch (sectionName) {
    case 'introduction':
      return generateParagraphs(displayData[sectionName].background);
    default:
      return (
        <Tab.Pane>
          <JSONTree data={displayData[sectionName]} theme={theme} />
        </Tab.Pane>
      );
  }
};
