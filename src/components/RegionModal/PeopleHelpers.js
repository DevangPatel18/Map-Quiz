import React from 'react';
import { List, Header, Table, Popup, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import { capWithSpacing, remUnderscore } from '../../helpers/textHelpers';
import { generateTableList, generateList } from '../../helpers/textHelpers';

const SubHeader = styled.p`
  font-size: 0.7em;
`;

const union = (setA, setB) => {
  let _union = new Set(setA);
  for (let elem of setB) {
    _union.add(elem);
  }
  return _union;
};

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

  const popUpNote = global_rank && (
    <Popup
      content={
        <p>
          <strong>Global rank: </strong>
          {global_rank}
        </p>
      }
      size="mini"
      trigger={<Icon style={{ marginLeft: '0.5rem' }} name="info circle" />}
    />
  );

  let rows = Object.entries(rest)
    .map(([category, dataObj]) => ({
      category: capWithSpacing(category),
      ...dataObj,
    }))
    .filter(obj => Object.values(obj).every(val => typeof val !== 'object'))
    .reduce((acc, entry) => {
      if (entry.category.toLowerCase().includes('total')) {
        return [...acc, entry];
      }
      acc.push(entry);
      return acc;
    }, []);

  const units = rows.reduce((acc, { units }) => {
    if (units && !acc.includes(units)) {
      acc.push(units);
    }
    return acc;
  }, []);

  let unitHeader;
  if (units.length > 1) {
    rows = rows.map(({ value, units, ...rest }) => ({
      value: `${value.toLocaleString()} ${remUnderscore(units)}`,
      ...rest,
    }));
  } else if (units.length === 1) {
    unitHeader = `(in ${remUnderscore(units[0])})`;
    rows = rows.map(({ value, units, ...rest }) => ({
      value: value.toLocaleString(),
      ...rest,
    }));
  }

  const cols = [...rows.reduce((acc, obj) => union(acc, Object.keys(obj)), [])];
  const categoryIdx = cols.indexOf('category');
  cols.splice(categoryIdx, 1);
  cols.unshift('category');

  return (
    <Table unstackable celled compact collapsing>
      <Table.Header>
        <Table.Row textAlign="center">
          <Table.HeaderCell colSpan={cols.length}>
            {capWithSpacing(title)} - {date}
            {popUpNote}
            {unitHeader && <SubHeader>{unitHeader}</SubHeader>}
          </Table.HeaderCell>
        </Table.Row>
        <Table.Row textAlign="center">
          {cols.map(col => (
            <Table.HeaderCell key={col}>{capWithSpacing(col)}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((entry, idx) => (
          <Table.Row key={idx}>
            {cols.map(col => (
              <Table.Cell key={col}>{entry[col].toLocaleString()}</Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};