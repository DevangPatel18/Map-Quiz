import React from 'react';
import { Container, Header, Divider, List } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme, TableContainer } from '../styles/RegionModalStyles';
import {
  generateArea,
  generateElevation,
  generateEnvironment,
  generateLandUse,
  generateBoundaries,
  generateNaturalHazards,
  generateMaritimeClaims,
} from './GeographyHelpers';
import {
  generateSubListItem,
  generateValueItem,
  generateTableList,
} from '../../helpers/textHelpers';

const Economy = ({ data }) => {
  const {
    area,
    elevation,
    environment,
    land_use,
    land_boundaries,
    natural_resources,
    natural_hazards,
    climate,
    location,
    population_distribution,
    terrain,
    geographic_coordinates,
    coastline,
    irrigated_land,
    maritime_claims,
    map_references,
    ...rest
  } = data;

  const isRestTreeNonEmpty = Object.keys(rest).length !== 0;

  return (
    <Container text>
      <List bulleted>
        {generateSubListItem({ location })}
        {generateSubListItem({ climate })}
        {generateSubListItem({ population_distribution })}
        {generateSubListItem({ terrain })}
        {generateValueItem({ coastline })}
        {geographic_coordinates && (
          <List.Item>
            <strong>Coordinates: </strong>
            {geographic_coordinates.latitude &&
              `${geographic_coordinates.latitude.degrees} ${geographic_coordinates.latitude.minutes} ${geographic_coordinates.latitude.hemisphere}`}
            {geographic_coordinates.longitude &&
              `, ${geographic_coordinates.longitude.degrees} ${geographic_coordinates.longitude.minutes} ${geographic_coordinates.longitude.hemisphere}`}
          </List.Item>
        )}
        {generateValueItem({ irrigated_land })}
        {generateMaritimeClaims(maritime_claims)}
      </List>
      {generateArea(area)}
      {generateElevation(elevation)}
      {generateEnvironment(environment)}
      <Header textAlign="center">Land</Header>
      <TableContainer>
        {generateLandUse(land_use)}
        {generateBoundaries(land_boundaries)}
      </TableContainer>
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
