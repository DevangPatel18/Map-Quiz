import React from 'react';
import { Container } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../styles/RegionModalStyles';
import { generateArea, generateElevation } from './GeographyHelpers';

const Economy = ({ data }) => {
  const { area, elevation, ...rest } = data;

  const isRestTreeNonEmpty = Object.keys(rest).length !== 0;

  return (
    <Container text>
      {generateArea(area)}
      {generateElevation(elevation)}
      {isRestTreeNonEmpty && <JSONTree data={rest} theme={theme} />}
    </Container>
  );
};

export default Economy;