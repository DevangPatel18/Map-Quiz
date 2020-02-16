import React from 'react';
import { List, Table, Header } from 'semantic-ui-react';
import styled from 'styled-components';
import {
  capWithSpacing,
  numScale,
  objToArray,
  generateTableList,
  generateSubListItem,
  generateValueItem,
  generateTextItem,
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
          {generateValueItem({ global_rank })}
          {generateSubListItem({ comparative })}
          {generateSubListItem({ note })}
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
        {lowest_point &&
          generateValueItem({ lowest_point: lowest_point.elevation })}
        {highest_point &&
          generateValueItem({ highest_point: highest_point.elevation })}
        {generateValueItem({ mean_elevation })}
        {generateTextItem({ note })}
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

export const generateBoundaries = (data = {}) => {
  const { border_countries, total, note } = data;

  if (!border_countries) return '';

  return (
    <>
      <Table celled compact collapsing unstackable>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell colSpan={2}>Land boundaries</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {border_countries.map((obj, idx) => (
            <React.Fragment key={idx}>
              {obj.border_length && (
                <Table.Row>
                  <Table.Cell>
                    {obj.country}
                    {obj.note && (
                      <p style={{ fontSize: '.8rem' }}>
                        <em>Note: {obj.note}</em>
                      </p>
                    )}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {obj.border_length.value} {obj.border_length.units}
                  </Table.Cell>
                </Table.Row>
              )}
            </React.Fragment>
          ))}
          {total && (
            <Table.Row>
              <Table.Cell>Total</Table.Cell>
              <Table.Cell textAlign="right">
                {total.value} {total.units}
              </Table.Cell>
            </Table.Row>
          )}

          {note && (
            <Table.Row>
              <Table.Cell colSpan={2} style={{ fontSize: '.8rem' }}>
                <em>Note: {note}</em>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </>
  );
};

export const generateNaturalHazards = data => {
  let volcanism;
  let list =
    data &&
    data
      .filter(obj => {
        if (obj.type === 'volcanism') {
          volcanism = obj.description.split(';').filter(x => x);
          return false;
        }
        return true;
      })
      .map(obj => obj.description);
  return generateTableList({ list, title: 'Natural Hazards', volcanism });
};

export const generateMaritimeClaims = (data = {}) => {
  const entries = Object.entries(data);
  if (entries.length === 0) return '';
  return (
    <List.Item>
      <List.Header>Maritime Claims</List.Header>
      <List>
        {entries.map((entry, idx) => {
          const itemObj = { [entry[0]]: entry[1] };
          const item =
            typeof entry[1] === 'string'
              ? generateTextItem(itemObj)
              : generateValueItem(itemObj);
          return <React.Fragment key={idx}>{item}</React.Fragment>;
        })}
      </List>
    </List.Item>
  );
};
