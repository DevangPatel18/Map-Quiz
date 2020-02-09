import React from 'react';
import { List, Header, Table } from 'semantic-ui-react';
import styled from 'styled-components';
import { capWithSpacing } from '../../helpers/textHelpers';
import { generateTableList, generateList } from '../../helpers/textHelpers';

const SubHeader = styled.p`
  font-size: 0.7em;
`;

export const generatePeopleItem = (obj = {}) => {
  const entries = Object.entries(obj);
  if (entries.length === 0) return '';
  const [title, dataObj] = entries[0];
  if (typeof dataObj !== 'object') return '';
  const { value, units, date, global_rank, ...rest } = dataObj;
  let dataFigure;
  if (value) {
    dataFigure = ` ${value} ${units}`;
  } else {
    const numFigureObj = Object.entries(rest)[0];
    const [text, num] = numFigureObj;
    dataFigure = ` ${num} ${capWithSpacing(text)}`;
  }
  return (
    <List.Item>
      {title && <strong>{capWithSpacing(title)}:</strong>}
      {dataFigure}
      {date && ` (${date})`}
      {global_rank && <sup> (global rank - {global_rank})</sup>}
    </List.Item>
  );
};

export const generateHealthTable = (obj = {}) => {
  const entries = Object.entries(obj);
  if (entries.length === 0) return '';
  const [title, dataObj] = entries[0];
  const { date, improved, unimproved } = dataObj;
  if (!improved || !unimproved) return '';

  return (
    <>
      <Header size="small" textAlign="center">
        {capWithSpacing(title)}
        {date && ` (${date})`}
      </Header>
      <Table unstackable celled compact definition>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Rural</Table.HeaderCell>
            <Table.HeaderCell>Urban</Table.HeaderCell>
            <Table.HeaderCell>Total</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>improved</Table.Cell>
            <Table.Cell>{`${improved?.rural?.value} ${improved?.rural?.units}`}</Table.Cell>
            <Table.Cell>{`${improved?.urban?.value} ${improved?.urban?.units}`}</Table.Cell>
            <Table.Cell>{`${improved?.total?.value} ${improved?.total?.units}`}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>unimproved</Table.Cell>
            <Table.Cell>{`${unimproved?.rural?.value} ${unimproved?.rural?.units}`}</Table.Cell>
            <Table.Cell>{`${unimproved?.urban?.value} ${unimproved?.urban?.units}`}</Table.Cell>
            <Table.Cell>{`${unimproved?.total?.value} ${unimproved?.total?.units}`}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  );
};

export const generateHealthMID = (obj = {}) => {
  const { date, note, degree_of_risk, ...rest } = obj;
  const textLists = Object.entries(rest).filter(
    ([_, val]) => Array.isArray(val) && val.every(x => typeof x === 'string')
  );
  if (!note && textLists.length < 1) return '';

  return (
    <>
      <Header size="small" textAlign="center">
        Major infectious diseases
        {date && ` (${date})`}
      </Header>
      {note && generateList(note.split(';'))}
      {textLists &&
        textLists.map(([title, list], idx) => (
          <React.Fragment key={idx}>
            {generateTableList({ title, list })}
          </React.Fragment>
        ))}
    </>
  );
};

export const generateValueUnitTable = (obj = {}) => {
  const entries = Object.entries(obj);
  if (entries.length === 0) return '';
  const [title, dataObj] = entries[0];
  const { date, global_rank, ...rest } = dataObj;
  const subHeaderText = [date, global_rank && `global rank - ${global_rank}`]
    .filter(x => x)
    .join(', ');
  const totalRows = [];
  const rows = Object.entries(rest)
    .map(([category, dataObj]) => ({
      category,
      ...dataObj,
    }))
    .filter(entry => {
      if (entry.category.includes('total')) {
        totalRows.push(entry);
        return false;
      }
      return true;
    });

  return (
    <Table unstackable celled compact collapsing>
      <Table.Header>
        <Table.Row textAlign="center">
          <Table.HeaderCell colSpan={2}>
            {capWithSpacing(title)}
            <SubHeader>({subHeaderText})</SubHeader>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((entry, idx) => (
          <Table.Row key={idx}>
            <Table.Cell>{capWithSpacing(entry.category)}</Table.Cell>
            <Table.Cell>{`${entry.value} ${capWithSpacing(
              entry.units
            )}`}</Table.Cell>
          </Table.Row>
        ))}
        {totalRows.map((entry, idx) => (
          <Table.Row key={idx}>
            <Table.Cell>{capWithSpacing(entry.category)}</Table.Cell>
            <Table.Cell>{`${entry.value} ${capWithSpacing(
              entry.units
            )}`}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
