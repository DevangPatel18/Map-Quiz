import React from 'react';
import { List, Table, Header, Popup, Icon } from 'semantic-ui-react';

const cellStyle = {
  padding: '0.3rem 0.7rem',
};

export const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

export const capWithSpacing = str => capitalize(str).replace(/_/g, ' ');

export const remUnderscore = str => str.replace(/_/g, ' ');

export const objToArray = obj =>
  Object.entries(obj).map(entry => ({ category: entry[0], ...entry[1] }));

const numDescription = ['', ' thousand', ' million', ' billion', ' trillion'];

export const numScale = number => {
  const tier = (Math.log10(Math.abs(number)) / 3) | 0;

  // if zero, we don't need a suffix
  if (tier === 0) return number;

  // get suffix and determine scale
  const suffix = numDescription[tier];
  const scale = Math.pow(10, tier * 3);

  // scale the number
  const scaled = number / scale;

  // format number and add suffix
  return scaled + suffix;
};

export const generateParagraphs = text => {
  if (!text) return '';
  const lines = text.split('. ');
  let temp = '';
  const paragraphs = [];

  for (let line of lines) {
    if (temp.length + line.length > 300) {
      paragraphs.push(temp);
      temp = line + '. ';
    } else {
      temp += line + '. ';
    }
  }
  paragraphs.push(temp.substring(0, temp.length - 2));

  return (
    <div
      style={{
        margin: '0 auto',
        maxWidth: '600px',
        fontSize: '1.2em',
      }}
    >
      {paragraphs.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </div>
  );
};

export const generateList = list => (
  <List bulleted>
    {list.length > 0 ? (
      <>
        {list.map((item, i) => (
          <List.Item key={i} size="large">
            {item}
          </List.Item>
        ))}
      </>
    ) : (
      <List.Item>none</List.Item>
    )}
  </List>
);

export const generateTextItem = (obj = {}) => {
  const entries = Object.entries(obj);
  if (entries.length === 0) return '';
  const [title, text] = entries[0];
  if (typeof text === 'object' || !text) return '';
  return (
    <List.Item>
      {title && <strong>{capWithSpacing(title)}:</strong>}
      {text && ` ${text.toLocaleString()}`}
    </List.Item>
  );
};

export const generateSubListItem = (obj = {}) => {
  const entries = Object.entries(obj);
  if (!entries) return '';
  const [title, text] = entries[0];
  if (typeof text !== 'string') return '';
  return (
    <List.Item>
      {title && <List.Header>{capWithSpacing(title)}</List.Header>}
      <List>
        {text &&
          text
            .split(';')
            .filter(x => x)
            .map((item, idx) => <List.Item key={idx}>{item}</List.Item>)}
      </List>
    </List.Item>
  );
};

export const generateValueItem = (obj = {}) => {
  const entries = Object.entries(obj);
  if (entries.length === 0) return '';
  const [title, valObj] = entries[0];
  if (typeof valObj !== 'object') return '';
  return (
    <List.Item>
      {title && <strong>{capWithSpacing(title)}:</strong>}
      <span>
        {valObj.value && ` ${valObj.value && valObj.value.toLocaleString()}`}
        {valObj.units && ` ${valObj.units}`}
        {valObj.date && ` (${valObj.date})`}
        {valObj.note && (
          <Popup
            content={generateList(valObj.note.split(';'))}
            size="mini"
            trigger={
              <Icon style={{ marginLeft: '0.5rem' }} name="info circle" />
            }
          />
        )}
      </span>
    </List.Item>
  );
};

export const generateSubObjListItem = (obj = {}) => {
  const entries = Object.entries(obj);
  if (entries.length === 0) return '';
  const [title, dataObj] = entries[0];
  if (typeof dataObj !== 'object') return '';
  const listEntries = Object.entries(dataObj);
  if (listEntries.length === 0) return '';
  return (
    <List.Item>
      <List.Header>{capWithSpacing(title)}</List.Header>
      <List>
        {listEntries.map(([key, val], idx) => (
          <React.Fragment key={idx}>
            {typeof val === 'object'
              ? generateValueItem({ [key]: val })
              : generateTextItem({ [key]: val })}
          </React.Fragment>
        ))}
      </List>
    </List.Item>
  );
};

export const generateTable = (table, title) => {
  const items = Object.keys(table[0]);

  return (
    <div style={{ overflow: 'auto', margin: '1rem 0' }}>
      {title && (
        <Header size="small" textAlign="center">
          {title}
        </Header>
      )}
      <Table
        definition
        compact
        unstackable
        collapsing
        style={{ margin: '0 auto' }}
      >
        <Table.Body>
          {items.map((item, i) => (
            <Table.Row key={i}>
              <Table.Cell>{capWithSpacing(item)}</Table.Cell>
              {table.map((entry, j) => (
                <Table.Cell key={j}>
                  {typeof entry[item] === 'number'
                    ? numScale(entry[item])
                    : capWithSpacing(entry[item])}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export const generateTablefromObjArray = (obj = {}) => {
  const entries = Object.entries(obj);
  if (entries.length === 0) return '';
  const [title, array] = entries[0];

  if (!Array.isArray(array)) return;

  const columns = Object.keys(array[0]);

  if (columns.length === 0) return '';

  return (
    <Table unstackable celled compact collapsing>
      <Table.Header>
        <Table.Row textAlign="center">
          <Table.HeaderCell colSpan={columns.length}>
            {capWithSpacing(title)}
          </Table.HeaderCell>
        </Table.Row>
        <Table.Row textAlign="center">
          {columns.map((key, idx) => (
            <Table.HeaderCell key={idx}>{capWithSpacing(key)}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {array.map((entry, idx) => (
          <Table.Row key={idx}>
            <Table.Cell>
              {entry[columns[0]] && entry[columns[0]].toLocaleString()}
            </Table.Cell>
            {columns.slice(1).map((key, jdx) => (
              <Table.Cell key={jdx} textAlign="right">
                {entry[key] && entry[key].toLocaleString()}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export const generateTableList = (data = {}) => {
  const { list, title, note, ...rest } = data;
  const extraLists = Object.entries(rest).filter(entry =>
    Array.isArray(entry[1])
  );
  if (!list) return '';
  let listA = [...list],
    listB,
    columns = 1;
  if (list.length > 6) {
    listB = listA.splice(Math.ceil(listA.length / 2));
    columns = 2;
  }
  return (
    <Table columns={columns} unstackable celled compact collapsing>
      <Table.Header>
        <Table.Row textAlign="center">
          <Table.HeaderCell colSpan={columns}>
            {capWithSpacing(title)}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {listA.map((entryA, idx) => (
          <Table.Row textAlign="center" verticalAlign="top" key={idx}>
            <Table.Cell style={cellStyle}>{entryA}</Table.Cell>
            {listB && <Table.Cell style={cellStyle}>{listB[idx]}</Table.Cell>}
          </Table.Row>
        ))}
        {extraLists &&
          extraLists.map((entry, idx) => (
            <Table.Row key={idx}>
              <Table.Cell colSpan={columns}>
                <List bulleted>
                  <List.Item>
                    <List.Header>{capWithSpacing(entry[0])}</List.Header>
                    <List>
                      {entry[1].map((item, jdx) => (
                        <List.Item key={jdx}>{item}</List.Item>
                      ))}
                    </List>
                  </List.Item>
                </List>
              </Table.Cell>
            </Table.Row>
          ))}
        {note && (
          <Table.Row>
            <Table.Cell
              style={{ ...cellStyle, fontSize: '0.8rem' }}
              colSpan={columns}
            >
              {generateSubListItem({ note })}
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
};
