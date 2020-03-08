import React from 'react';
import { Container, Header, List } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme, TableContainer } from '../styles/RegionModalStyles';
import {
  generatePipelinesTable,
  generateMerchantMarineTable,
  generatePortsandTerminals,
  generateAirTransport,
  generateRoadways,
  generateRailways,
} from './TransportationHelpers';
import { generateValueItem } from '../../helpers/textHelpers';

const Transportation = ({ data }) => {
  const {
    air_transport,
    pipelines,
    merchant_marine,
    ports_and_terminals,
    waterways,
    roadways,
    railways,
    ...rest
  } = data;

  const isRestTreeNonEmpty = Object.keys(rest).length !== 0;

  return (
    <Container text>
      {generateAirTransport(air_transport)}
      <Header textAlign="center" style={{ margin: '3rem 0' }}>
        Pipelines and Merchant Marine
      </Header>
      <TableContainer>
        {generatePipelinesTable(pipelines)}
        {generateMerchantMarineTable(merchant_marine)}
      </TableContainer>
      {generatePortsandTerminals(ports_and_terminals)}
      <Header textAlign="center" style={{ margin: '3rem 0' }}>
        Rail - Road - Water transports
      </Header>
      <List bulleted>
        {generateValueItem({ waterways })}
        {generateRailways(railways)}
      </List>
      {generateRoadways(roadways)}
      {isRestTreeNonEmpty && <JSONTree data={rest} theme={theme} />}
    </Container>
  );
};

export default Transportation;
