import React from 'react';
import { List, Table, Header } from 'semantic-ui-react';
import styled from 'styled-components';
import {
  capWithSpacing,
  numScale,
  objToArray,
  generateTableList,
} from '../../helpers/textHelpers';

const SubHeader = styled.p`
  font-size: 0.7em;
`;

const AreaContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const ListStyled = styled(List)`
  flex: 1;
  margin: 1rem;
  min-width: 50%;
`;

export const generateArea = data => {
  const { total, land, water, note, comparative, global_rank } = data;
  const areaTable = objToArray({ land, water, total });

  return (
    <>
      <Header textAlign="center">Area</Header>
      <AreaContainer>
        <ListStyled bulleted>
          {global_rank && <List.Item>Global rank: {global_rank}</List.Item>}
          {comparative && (
            <List.Item>
              Comparitive:
              <List>
                {comparative.split(';').map((fact, idx) => (
                  <List.Item key={idx}>{fact}</List.Item>
                ))}
              </List>
            </List.Item>
          )}
          {note && (
            <List.Item>
              Note:
              <List>
                {note.split(';').map((fact, idx) => (
                  <List.Item key={idx}>{fact}</List.Item>
                ))}
              </List>
            </List.Item>
          )}
        </ListStyled>
        <Table celled compact collapsing unstackable>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell colSpan={2}>Breakdown</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {areaTable.map((row, idx) => (
              <Table.Row key={idx}>
                <Table.Cell>{capWithSpacing(row.category)}</Table.Cell>
                <Table.Cell>
                  {numScale(row.value)} {row.units}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </AreaContainer>
    </>
  );
};

export const generateElevation = data => {
  const { mean_elevation, lowest_point, highest_point, note } = data;

  return (
    <>
      <Header textAlign="center">Elevation</Header>

      <List bulleted>
        {lowest_point && (
          <List.Item>
            <strong>Lowest point: </strong>
            {`${lowest_point.name} `}
            {lowest_point.elevation &&
              `${lowest_point.elevation.value} ${lowest_point.elevation.units}`}
          </List.Item>
        )}
        {highest_point && (
          <List.Item>
            <strong>Highest point: </strong>
            {`${highest_point.name} `}
            {highest_point.elevation &&
              `${highest_point.elevation.value} ${highest_point.elevation.units}`}
          </List.Item>
        )}
        {mean_elevation && (
          <List.Item>
            <strong>Mean Elevation: </strong>
            {`${mean_elevation.value} ${mean_elevation.units}`}
          </List.Item>
        )}
        {note && (
          <List.Item>
            <strong>Note: </strong>
            {note}
          </List.Item>
        )}
      </List>
    </>
  );
};

export const generateEnvironment = data => {
  const { current_issues, international_agreements } = data;

  return (
    <>
      <Header textAlign="center">Environment</Header>

      {generateTableList({
        list: current_issues,
        title: 'Current Issues',
      })}

      {international_agreements && (
        <>
          {generateTableList({
            list: international_agreements.party_to,
            title: 'International agreements (party to)',
          })}
          {generateTableList({
            list: international_agreements.signed_but_not_ratified,
            title: 'International agreements (signed but not ratified)',
          })}
        </>
      )}
    </>
  );
};

export const generateLandUse = (data = {}) => {
  const { by_sector, date, note } = data;

  if (!by_sector) return '';

  return (
    <Table celled compact collapsing unstackable>
      <Table.Header>
        <Table.Row textAlign="center">
          <Table.HeaderCell colSpan={3}>
            Land use by sector
            {date && <SubHeader>({date})</SubHeader>}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {landUseList.map((landUse, idx) => {
          const nestedRow = agriculturalList.includes(landUse);
          return (
            <Table.Row key={idx}>
              {nestedRow && <Table.Cell />}
              <Table.Cell colSpan={nestedRow ? 1 : 2}>
                {capWithSpacing(landUse)}
              </Table.Cell>
              <Table.Cell textAlign="right">
                {by_sector[landUse].value}
                {by_sector[landUse].units}
              </Table.Cell>
            </Table.Row>
          );
        })}
        {note && (
          <Table.Row>
            <Table.Cell colSpan={3} style={{ fontSize: '0.8rem' }}>
              <em>Note: {note}</em>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
};

const landUseList = [
  'agricultural_land_total',
  'arable_land',
  'permanent_crops',
  'permanent_pasture',
  'forest',
  'other',
];

const agriculturalList = [
  'arable_land',
  'permanent_crops',
  'permanent_pasture',
];
