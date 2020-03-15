import React from 'react';
import { Tab } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../styles/RegionModalStyles';
import { generateParagraphs } from '../../helpers/textHelpers';
import TransnationalIssues from './TransnationalIssues';
import Energy from './Energy';
import Economy from './Economy';
import Geography from './Geography';
import Government from './Government';
import Military from './Military';
import People from './People';
import Communications from './Communications';
import Transportation from './Transportation';

export const generateTabContent = (displayData, sectionName) => {
  switch (sectionName) {
    case 'introduction':
      return generateParagraphs(displayData[sectionName].background);
    case 'transnational_issues':
      return <TransnationalIssues data={displayData[sectionName]} />;
    case 'energy':
      return <Energy data={displayData[sectionName]} />;
    case 'economy':
      return <Economy data={displayData[sectionName]} />;
    case 'geography':
      return <Geography data={displayData[sectionName]} />;
    case 'government':
      return <Government data={displayData[sectionName]} />;
    case 'military_and_security':
      return <Military data={displayData[sectionName]} />;
    case 'people':
      return <People data={displayData[sectionName]} />;
    case 'communications':
      return <Communications data={displayData[sectionName]} />;
    case 'transportation':
      return <Transportation data={displayData[sectionName]} />;
    default:
      return (
        <Tab.Pane>
          <JSONTree data={displayData[sectionName]} theme={theme} />
        </Tab.Pane>
      );
  }
};
