import React from 'react';
import { Table, List, Header } from 'semantic-ui-react';
import styled from 'styled-components';
import {
  capWithSpacing,
  generateTextItem,
  generateTableList,
  generateTablefromObjArray,
} from '../../helpers/textHelpers';
import { TableContainer } from '../styles/RegionModalStyles';

const SubHeader = styled.p`
  font-size: 0.7em;
`;

export const generateAirTransport = (obj = {}) => {
  if (typeof obj !== 'object') return;
  const { airports, national_system, ...air_transport_rest } = obj;
  const airportsTable = generateAirportsTable(airports);
  const nationalSystemList = generateNationalSystemList(national_system);
  const airTransportList = generateAirTransportList(air_transport_rest);

  return (
    <>
      {nationalSystemList}
      {airTransportList}
      {airportsTable}
    </>
  );
};

export const generateAirportsTable = (obj = {}) => {
  if (typeof obj !== 'object') return;
  const { paved, unpaved, total } = obj;
  if (!paved || !unpaved) return;
  const date = total?.date;
  const airports = total?.airports;
  const global_rank = total?.global_rank;
  paved.category = 'Paved';
  unpaved.category = 'Unpaved';

  const cols = [
    'category',
    'date',
    'under_914_metres',
    '914_to_1523_metres',
    '1524_to_2437_metres',
    '2438_to_3047_metres',
    'over_3047_metres',
    'total',
  ];

  return (
    <Table unstackable celled compact collapsing>
      <Table.Header>
        <Table.Row textAlign="center">
          <Table.HeaderCell colSpan={cols.length}>
            Airports
            {airports && (
              <SubHeader>
                ( Total: {airports.toLocaleString()}
                {date && ` - Date: ${date}`}
                {global_rank && ` - Global rank: ${global_rank}`} )
              </SubHeader>
            )}
          </Table.HeaderCell>
        </Table.Row>
        <Table.Row textAlign="center">
          {cols.map(col => (
            <Table.HeaderCell key={col}>{capWithSpacing(col)}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {[paved, unpaved].map((obj, idx) => (
          <Table.Row key={idx} textAlign="center">
            <Table.Cell textAlign="left">{obj.category}</Table.Cell>
            {cols.slice(1).map(col => (
              <Table.Cell key={col}>
                {obj[col] && obj[col].toLocaleString()}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export const generateNationalSystemList = (obj = {}) => {
  if (typeof obj !== 'object') return;
  const { date, ...rest } = obj;
  const entries = Object.entries(rest);
  if (entries.length === 0) return;

  return (
    <List bulleted>
      <List.Item>
        <List.Header>National System{date && ` (${date})`}</List.Header>
        <List>
          {entries.map(([key, val], idx) => (
            <React.Fragment key={idx}>
              {generateTextItem({ [key]: val })}
            </React.Fragment>
          ))}
        </List>
      </List.Item>
    </List>
  );
};

export const generateAirTransportList = (obj = {}) => {
  if (typeof obj !== 'object') return;
  const { heliports, civil_aircraft_registration_country_code_prefix } = obj;

  return (
    <List bulleted>
      {heliports && (
        <List.Item>
          <strong>Heliports: </strong>
          {`${heliports.total?.toLocaleString()} (${heliports.date})`}
        </List.Item>
      )}
      {civil_aircraft_registration_country_code_prefix && (
        <List.Item>
          <strong>Civil aircraft registration countrycode: </strong>
          {`${civil_aircraft_registration_country_code_prefix.prefix} (${civil_aircraft_registration_country_code_prefix.date})`}
        </List.Item>
      )}
    </List>
  );
};

export const generatePipelinesTable = (obj = {}) => {
  if (typeof obj !== 'object') return;
  const { by_type, date } = obj;

  if (!by_type) return;

  return (
    <Table unstackable celled compact collapsing>
      <Table.Header>
        <Table.Row textAlign="center">
          <Table.HeaderCell colSpan={2}>
            {'Pipelines'}
            {date && ` - ${date}`}
          </Table.HeaderCell>
        </Table.Row>
        <Table.Row textAlign="center">
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Length</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {by_type.map(({ type, length, units }, idx) => (
          <Table.Row key={idx}>
            <Table.Cell>{capWithSpacing(type)}</Table.Cell>
            <Table.Cell>{`${length?.toLocaleString()} ${units}`}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export const generateMerchantMarineTable = (obj = {}) => {
  if (typeof obj !== 'object') return;
  const { by_type, date, global_rank, total } = obj;

  if (!by_type) return;

  return (
    <Table unstackable celled compact collapsing>
      <Table.Header>
        <Table.Row textAlign="center">
          <Table.HeaderCell colSpan={2}>
            {'Merchant Marine'}
            {date && ` - ${date}`}
            <SubHeader>
              {[
                total && `Total: ${total.toLocaleString()}`,
                global_rank && `Global rank: ${global_rank}`,
              ].join(' - ')}
            </SubHeader>
          </Table.HeaderCell>
        </Table.Row>
        <Table.Row textAlign="center">
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Count</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {by_type.map(({ type, count }, idx) => (
          <Table.Row key={idx}>
            <Table.Cell>{capWithSpacing(type)}</Table.Cell>
            <Table.Cell>{`${count?.toLocaleString()}`}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export const generatePortsandTerminals = (obj = {}) => {
  if (typeof obj !== 'object') return;
  const {
    date,
    cargo_ports,
    major_ports,
    cruise_departure_ports_passengers,
    ...rest
  } = obj;

  const textList = Object.entries(rest)
    .filter(([_, value]) => typeof value === 'string')
    .map(([key, value], idx) => (
      <React.Fragment key={idx}>
        {generateTextItem({ [key]: value })}
      </React.Fragment>
    ));

  const tables = Object.keys(obj)
    .filter(key => Array.isArray(obj[key]))
    .map(key => {
      if (obj[key].every(entry => typeof entry === 'string')) {
        return generateTableList({
          title: key,
          list: obj[key],
        });
      }
      return generateTablefromObjArray({ [key]: obj[key] });
    });

  Object.entries({
    cargo_ports,
    major_ports,
    cruise_departure_ports_passengers,
  })
    .filter(([_, value]) => value)
    .forEach(([key, value]) => {
      tables.push(
        generateTableList({
          title: capWithSpacing(key),
          list: value.split(', '),
        })
      );
    });

  return (
    <div>
      <Header textAlign="center" style={{ margin: '3rem 0' }}>
        Ports and Terminals
        {date && ` (${date})`}
      </Header>
      {textList.length > 0 && <List bulleted>{textList}</List>}
      {tables.map((table, idx) => (
        <React.Fragment key={idx}>{table}</React.Fragment>
      ))}
    </div>
  );
};
