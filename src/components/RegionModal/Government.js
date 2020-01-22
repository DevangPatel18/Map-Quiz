import React from 'react';
import { Accordion } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../styles/RegionModalStyles';

const Government = ({ data }) => {
  const { ...rest } = data;
  const isRestTreeNonEmpty = Object.keys(rest).length !== 0;

  const panels = [];

  if (isRestTreeNonEmpty) {
    panels.push({
      key: 'jsonTree',
      title: 'Other',
      content: {
        content: <JSONTree data={rest} theme={theme} />,
      },
    });
  }

  return <Accordion styled fluid exclusive={false} panels={panels} />;
};

export default Government;
