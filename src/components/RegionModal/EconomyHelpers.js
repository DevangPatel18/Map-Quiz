import React from 'react';
import { List, Table } from 'semantic-ui-react';
import {
  capWithSpacing,
  remUnderscore,
  numScale,
} from '../../helpers/textHelpers';

export const formatAnnualValue = obj => {
  const { value, units, date } = obj;
  return `${numScale(value)} ${remUnderscore(units)} (${date})`;
};

export const formatDUVobj = obj => (
  <List.Item as="li">
    {obj.attribute && <strong>{`${capWithSpacing(obj.attribute)}: `}</strong>}
    {obj.annual_values &&
      obj.annual_values
        .map(annual_value => formatAnnualValue(annual_value))
        .join(', ')}
    {obj.note && (
      <List as="ul">
        <List.Item as="li">
          <em>
            {'Note: '}
            {obj.note}
          </em>
        </List.Item>
      </List>
    )}
  </List.Item>
);

export const generateImportExportTable = ({ importData, exportData }) => {
  if (!importData && !exportData) return '';
  return (
    <Table definition unstackable celled>
      <Table.Header>
        <Table.Row verticalAlign="top">
          <Table.HeaderCell />
          {importData && <Table.HeaderCell>Imports</Table.HeaderCell>}
          {exportData && <Table.HeaderCell>Exports</Table.HeaderCell>}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row verticalAlign="top">
          <Table.Cell>Commodities</Table.Cell>
          {importData.commodities && (
            <Table.Cell>
              <List as="ul">
                {importData.commodities.by_commodity.map(commodity => (
                  <List.Item key={commodity} as="li">
                    {commodity}
                  </List.Item>
                ))}
              </List>
              {importData.commodities.date && (
                <p>Date: {importData.commodities.date}</p>
              )}
            </Table.Cell>
          )}
          {exportData.commodities && (
            <Table.Cell>
              <List as="ul">
                {exportData.commodities.by_commodity.map(commodity => (
                  <List.Item key={commodity} as="li">
                    {commodity}
                  </List.Item>
                ))}
              </List>
              {exportData.commodities.date && (
                <p>Date: {exportData.commodities.date}</p>
              )}
            </Table.Cell>
          )}
        </Table.Row>
        <Table.Row verticalAlign="top">
          <Table.Cell>Partners</Table.Cell>
          {importData.partners && (
            <Table.Cell>
              {
                <List as="ul">
                  {importData.partners.by_country.map(({ name, percent }) => (
                    <List.Item key={name} as="li">
                      {name} - {percent}%
                    </List.Item>
                  ))}
                </List>
              }
              {importData.partners.date && (
                <p>Date: {importData.partners.date}</p>
              )}
            </Table.Cell>
          )}
          {exportData.partners && (
            <Table.Cell>
              {
                <List as="ul">
                  {exportData.partners.by_country.map(({ name, percent }) => (
                    <List.Item key={name} as="li">
                      {name} - {percent}%
                    </List.Item>
                  ))}
                </List>
              }
              {exportData.partners.date && (
                <p>Date: {exportData.partners.date}</p>
              )}
            </Table.Cell>
          )}
        </Table.Row>
        <Table.Row verticalAlign="top">
          <Table.Cell>Total Value</Table.Cell>
          {importData.total_value && (
            <Table.Cell>
              <List as="ul">{formatDUVobj(importData.total_value)}</List>
            </Table.Cell>
          )}
          {exportData.total_value && (
            <Table.Cell>
              <List as="ul">{formatDUVobj(exportData.total_value)}</List>
            </Table.Cell>
          )}
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export const generateIndustries = data => {
  if (!data) return '';
  const { industries, note } = data;
  let listA = [...industries];
  let listB = listA.splice(Math.ceil(listA.length / 2));
  return (
    <Table columns={2} unstackable celled>
      <Table.Header>
        <Table.Row textAlign="center">
          <Table.HeaderCell colSpan="2">Industries</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row textAlign="center" verticalAlign="top">
          <Table.Cell>
            <List items={listA} />
          </Table.Cell>
          <Table.Cell>
            <List items={listB} />
          </Table.Cell>
        </Table.Row>
        {note && (
          <Table.Row>
            <Table.Cell colSpan="2">
              <em>Note: {note}</em>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
};
