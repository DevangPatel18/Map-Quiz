import React from 'react';
import { Container, Header } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../styles/RegionModalStyles';
import {
  generateArea,
  generateElevation,
  generateEnvironment,
  generateLandUse,
  generateBoundaries,
} from './GeographyHelpers';

const Economy = ({ data }) => {
  const {
    area,
    elevation,
    environment,
    land_use,
    land_boundaries,
    ...rest
  } = data;

  const isRestTreeNonEmpty = Object.keys(rest).length !== 0;

  return (
    <Container text>
      {generateArea(area)}
      {generateElevation(elevation)}
      {generateEnvironment(environment)}
      <Header textAlign="center">Land</Header>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap',
        }}
      >
        {generateLandUse(land_use)}
        {generateBoundaries(land_boundaries)}
      </div>
      {isRestTreeNonEmpty && <JSONTree data={rest} theme={theme} />}
    </Container>
  );
};

export default Economy;
