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
    dataFigure = ` ${value.toLocaleString()} ${units}`;
  } else {
    const numFigureObj = Object.entries(rest)[0];
    const [text, num] = numFigureObj;
    dataFigure = ` ${num && num.toLocaleString()} ${remUnderscore(text)}`;
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
  if (!dataObj) return '';
  const { date, improved, unimproved } = dataObj;
  if (!improved || !unimproved) return '';

  const rows = ['improved', 'unimproved'];
  const cols = ['rural', 'urban', 'total'];

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
          {rows.map((row, idx) => (
            <Table.Row key={idx}>
              <Table.Cell>{row}</Table.Cell>
              {cols.map((col, jdx) => (
                <Table.Cell
                  key={jdx}
                >{`${dataObj[row]?.[col]?.value} ${dataObj[row]?.[col]?.units}`}</Table.Cell>
              ))}
            </Table.Row>
          ))}
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
  if (!dataObj) return '';
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

  const primitiveVals = [];

  let rows = Object.entries(rest)
    .filter(([key, val]) => {
      if (typeof val === 'object') {
        return true;
      }
      primitiveVals.push([key, val]);
      return false;
    })
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
      value: `${value && value.toLocaleString()} ${remUnderscore(units)}`,
      ...rest,
    }));
  } else if (units.length === 1) {
    unitHeader = `(in ${remUnderscore(units[0])})`;
    rows = rows.map(({ value, units, ...rest }) => ({
      value: value && value.toLocaleString(),
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
            {capWithSpacing(title)}
            {date && ` - ${date}`}
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
          <Table.Row key={idx} textAlign="center">
            <Table.Cell textAlign="left">
              {entry.category && entry.category.toLocaleString()}
            </Table.Cell>
            {cols.slice(1).map(col => (
              <Table.Cell key={col}>
                {entry[col] && entry[col].toLocaleString()}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
        {primitiveVals.length > 0 && (
          <Table.Row>
            <Table.Cell colSpan="2">
              <List bulleted style={{ fontSize: '0.8rem' }}>
                {primitiveVals.map(([item, val], idx) => (
                  <List.Item key={idx}>
                    <strong>{capWithSpacing(item)}: </strong>
                    {val}
                  </List.Item>
                ))}
              </List>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
};

export const generateNamePercentTable = (obj = {}) => {
  const entries = Object.entries(obj);
  if (entries.length === 0) return '';
  const [title, dataObj] = entries[0];
  const { date, note, ...rest } = dataObj;

  let rows = Object.values(rest)
    .filter(
      value =>
        Array.isArray(value) &&
        value.some(val => typeof val === 'object' && val.name)
    )
    .reduce((acc, array) => [...acc, ...array], []);

  if (rows.length === 0) return '';

  const noPercent = rows.every(({ percent }) => !percent);

  return (
    <Table unstackable celled compact collapsing>
      <Table.Header>
        <Table.Row textAlign="center">
          <Table.HeaderCell colSpan={noPercent ? 1 : 2}>
            {capWithSpacing(title)}
            {date && ` - ${date}`}
          </Table.HeaderCell>
        </Table.Row>
        <Table.Row textAlign="center">
          <Table.HeaderCell>Name</Table.HeaderCell>
          {!noPercent && <Table.HeaderCell>Percent</Table.HeaderCell>}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((entry, idx) => (
          <Table.Row key={idx}>
            <Table.Cell>
              {entry?.name}
              {entry?.note && (
                <Popup
                  content={generateList(entry.note.split(';'))}
                  size="mini"
                  trigger={
                    <Icon style={{ marginLeft: '0.5rem' }} name="info circle" />
                  }
                />
              )}
            </Table.Cell>
            {!noPercent && <Table.Cell>{entry?.percent}</Table.Cell>}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export const generateMajorUrbanAreasTable = (obj = {}) => {
  const { date, places } = obj;
  if (!places || !Array.isArray(places)) return '';

  return (
    <Table unstackable celled compact collapsing>
      <Table.Header>
        <Table.Row textAlign="center">
          <Table.HeaderCell colSpan="2">
            {'Major Urban Areas'}
            {date && ` - ${date}`}
          </Table.HeaderCell>
        </Table.Row>
        <Table.Row textAlign="center">
          <Table.HeaderCell>Place</Table.HeaderCell>
          <Table.HeaderCell>Population</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {places.map((obj, idx) => (
          <Table.Row key={idx}>
            <Table.Cell>
              {obj.is_capital ? `${obj.place} (capital)` : obj.place}
            </Table.Cell>
            <Table.Cell>
              {obj.population && obj.population.toLocaleString()}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
