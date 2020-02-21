import React from 'react';
import { Container } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../styles/RegionModalStyles';
import { generateAirportsTable } from './TransportationHelpers';

const Transportation = ({ data }) => {
  const { air_transport, ...rest } = data;

  let airportsTable;
  if (air_transport) {
    const { airports, ...air_transport_rest } = air_transport;
    if (airports) {
      const { paved, unpaved } = airports;
      const paved_vs_unpaved = { paved, unpaved };
      airportsTable = generateAirportsTable(paved_vs_unpaved);
    }
    rest.air_transport = air_transport_rest;
  }

  const isRestTreeNonEmpty = Object.keys(rest).length !== 0;

  return (
    <Container text>
      {airportsTable}
      {isRestTreeNonEmpty && <JSONTree data={rest} theme={theme} />}
    </Container>
  );
};

export default Transportation;
