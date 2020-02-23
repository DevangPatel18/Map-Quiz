import React from 'react';
import { Container } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../styles/RegionModalStyles';
import {
  generateAirportsTable,
  generateNationalSystemList,
} from './TransportationHelpers';

const Transportation = ({ data }) => {
  const { air_transport, ...rest } = data;

  let airportsSection;
  if (air_transport) {
    const { airports, national_system, ...air_transport_rest } = air_transport;
    const airportsTable = generateAirportsTable(airports);
    const nationalSystemList = generateNationalSystemList(national_system);
    rest.air_transport = air_transport_rest;

    airportsSection = (
      <>
        {nationalSystemList}
        {airportsTable}
      </>
    );
  }

  const isRestTreeNonEmpty = Object.keys(rest).length !== 0;

  return (
    <Container text>
      {airportsSection}
      {isRestTreeNonEmpty && <JSONTree data={rest} theme={theme} />}
    </Container>
  );
};

export default Transportation;
