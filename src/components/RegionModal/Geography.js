import React from 'react';
import { Container, Header, Divider } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../styles/RegionModalStyles';
import {
  generateArea,
  generateElevation,
  generateEnvironment,
  generateLandUse,
  generateBoundaries,
  generateNaturalHazards,
} from './GeographyHelpers';
import { generateTableList } from '../../helpers/textHelpers';

const Economy = ({ data }) => {
  const {
    area,
    elevation,
    environment,
    land_use,
    land_boundaries,
    natural_resources,
    natural_hazards,
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
      <Divider />
      {natural_resources &&
        generateTableList({
          list: natural_resources.resources,
          title: 'Natural Resources',
        })}
      {natural_hazards && generateNaturalHazards(natural_hazards)}
      {isRestTreeNonEmpty && <JSONTree data={rest} theme={theme} />}
    </Container>
  );
};

export default Economy;
