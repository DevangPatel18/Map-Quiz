import React from 'react';
import { Container } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../styles/RegionModalStyles';
import {
  generateAirportsTable,
  generateNationalSystemList,
  generateAirTransportList,
  generatePipelinesTable,
  generateMerchantMarineTable,
} from './TransportationHelpers';

const Transportation = ({ data }) => {
  const { air_transport, pipelines, merchant_marine, ...rest } = data;

  let airportsSection;
  if (air_transport) {
    const { airports, national_system, ...air_transport_rest } = air_transport;
    const airportsTable = generateAirportsTable(airports);
    const nationalSystemList = generateNationalSystemList(national_system);
    const airTransportList = generateAirTransportList(air_transport_rest);

    airportsSection = (
      <>
        {nationalSystemList}
        {airTransportList}
        {airportsTable}
      </>
    );
  }

  const isRestTreeNonEmpty = Object.keys(rest).length !== 0;

  return (
    <Container text>
      {airportsSection}
      {generatePipelinesTable(pipelines)}
      {generateMerchantMarineTable(merchant_marine)}
      {isRestTreeNonEmpty && <JSONTree data={rest} theme={theme} />}
    </Container>
  );
};

export default Transportation;
