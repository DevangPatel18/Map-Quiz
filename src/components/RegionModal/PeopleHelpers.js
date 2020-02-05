import React from 'react';
import { List, Header, Table } from 'semantic-ui-react';
import { capWithSpacing } from '../../helpers/textHelpers';

export const generatePeopleItem = (obj = {}) => {
  const entries = Object.entries(obj);
  if (entries.length === 0) return '';
  const [title, dataObj] = entries[0];
  if (typeof dataObj !== 'object') return '';
  const { date, global_rank, ...rest } = dataObj;
  const numFigureObj = Object.entries(rest)[0];
  const [text, num] = numFigureObj;
  return (
    <List.Item>
      {title && <strong>{capWithSpacing(title)}:</strong>}
      {num && ` ${num}`}
      {text && ` ${capWithSpacing(text)}`}
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
