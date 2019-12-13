import React from 'react';
import { Tab } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../components/styles/RegionModalStyles';

export const generateTabContent = (displayData, sectionName) => (
  <Tab.Pane>
    <JSONTree data={displayData[sectionName]} theme={theme} />
  </Tab.Pane>
);

const generateParagraphs = text => {
  const lines = text.split('. ');
  let temp = '';
  const paragraphs = [];

  for (let line of lines) {
    if (temp.length + line.length > 300) {
      paragraphs.push(temp);
      temp = line + '. ';
    } else {
      temp += line + '. ';
    }
  }
  paragraphs.push(temp.substring(0, temp.length - 2));

  return (
    <div
      style={{
        margin: '0 auto',
        maxWidth: '600px',
        fontSize: '1.2em',
      }}
    >
      {paragraphs.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </div>
  );
};
