import React from 'react';
import { List, Table, Header } from 'semantic-ui-react';
import styled from 'styled-components';
import {
  capWithSpacing,
  numScale,
  objToArray,
} from '../../helpers/textHelpers';

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
