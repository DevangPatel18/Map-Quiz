import React from 'react';
import { Container } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../styles/RegionModalStyles';
import {
  generatePipelinesTable,
  generateMerchantMarineTable,
  generatePortsandTerminals,
  generateAirTransport,
} from './TransportationHelpers';

const Transportation = ({ data }) => {
  const {
    air_transport,
    pipelines,
    merchant_marine,
    ports_and_terminals,
    ...rest
  } = data;

  const isRestTreeNonEmpty = Object.keys(rest).length !== 0;

  return (
    <Container text>
      {generateAirTransport(air_transport)}
      {generatePipelinesTable(pipelines)}
      {generateMerchantMarineTable(merchant_marine)}
      {generatePortsandTerminals(ports_and_terminals)}
      {isRestTreeNonEmpty && <JSONTree data={rest} theme={theme} />}
    </Container>
  );
};

export default Transportation;
