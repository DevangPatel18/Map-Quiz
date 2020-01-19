import React from 'react';
import { List, Table, Header, Popup, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import {
  capWithSpacing,
  remUnderscore,
  numScale,
} from '../../helpers/textHelpers';

const SubHeader = styled.p`
  font-size: 0.7em;
`;

export const formatAnnualValue = obj => {
  const { value, units, date } = obj;
  return `${numScale(value)} ${remUnderscore(units)} (${date})`;
};

export const formatDUVobj = obj => (
  <List.Item>
    {obj.attribute && (
      <List.Header>
        {`${capWithSpacing(obj.attribute)}`}
        {obj.note && (
          <Popup
            content={obj.note}
            header="Note"
            size="mini"
            trigger={
              <Icon style={{ marginLeft: '0.5rem' }} name="info circle" />
            }
          />
        )}
        {obj.global_rank && (
          <p style={{ fontSize: '0.8rem' }}>
            (global rank - {obj.global_rank})
          </p>
        )}
      </List.Header>
    )}
    {obj.annual_values && (
      <List bulleted>
        {obj.annual_values.map((annual_value, idx) => (
          <List.Item key={idx}>{formatAnnualValue(annual_value)}</List.Item>
        ))}
      </List>
    )}
  </List.Item>
);

export const generateDUVTable = obj => (
  <Table celled compact collapsing unstackable textAlign="center">
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>
          {obj.attribute && capWithSpacing(obj.attribute)}
          {obj.global_rank && (
            <SubHeader>(global rank - {obj.global_rank})</SubHeader>
          )}
        </Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {obj.annual_values &&
        obj.annual_values.map((annual_value, i) => (
          <Table.Row key={i}>
            <Table.Cell>{formatAnnualValue(annual_value)}</Table.Cell>
          </Table.Row>
        ))}
      {obj.note && (
        <Table.Row>
          <Table.Cell style={{ fontSize: '.8rem' }}>
            {obj.note && (
              <em>
                {'Note: '}
                {obj.note}
              </em>
            )}
          </Table.Cell>
        </Table.Row>
      )}
    </Table.Body>
  </Table>
);

export const generateImportExportTable = ({ importData, exportData }) => {
  if (!importData && !exportData) return '';
  return (
    <Table definition unstackable celled>
      <Table.Header>
        <Table.Row verticalAlign="top">
          <Table.HeaderCell />
          <Table.HeaderCell>Imports</Table.HeaderCell>
          <Table.HeaderCell>Exports</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row verticalAlign="top">
          <Table.Cell>Commodities</Table.Cell>
          <Table.Cell>
            {importData && importData.commodities && (
              <>
                <List bulleted>
                  {importData.commodities.by_commodity.map(commodity => (
                    <List.Item key={commodity}>{commodity}</List.Item>
                  ))}
                </List>
                {importData.commodities.date && (
                  <p>Date: {importData.commodities.date}</p>
                )}
              </>
            )}
          </Table.Cell>
          <Table.Cell>
            {exportData && exportData.commodities && (
              <>
                <List bulleted>
                  {exportData.commodities.by_commodity.map(commodity => (
                    <List.Item key={commodity}>{commodity}</List.Item>
                  ))}
                </List>
                {exportData.commodities.date && (
                  <p>Date: {exportData.commodities.date}</p>
                )}
              </>
            )}
          </Table.Cell>
        </Table.Row>
        <Table.Row verticalAlign="top">
          <Table.Cell>Partners</Table.Cell>
          <Table.Cell>
            {importData && importData.partners && (
              <>
                <List bulleted>
                  {importData.partners.by_country.map(({ name, percent }) => (
                    <List.Item key={name}>
                      {name} - {percent}%
                    </List.Item>
                  ))}
                </List>
                {importData.partners.date && (
                  <p>Date: {importData.partners.date}</p>
                )}
              </>
            )}
          </Table.Cell>
          <Table.Cell>
            {exportData && exportData.partners && (
              <>
                <List bulleted>
                  {exportData.partners.by_country.map(({ name, percent }) => (
                    <List.Item key={name}>
                      {name} - {percent}%
                    </List.Item>
                  ))}
                </List>
                {exportData.partners.date && (
                  <p>Date: {exportData.partners.date}</p>
                )}
              </>
            )}
          </Table.Cell>
        </Table.Row>
        <Table.Row verticalAlign="top">
          <Table.Cell>Total Value</Table.Cell>
          <Table.Cell>
            {importData && importData.total_value && (
              <List bulleted>
                {importData.total_value.annual_values.map(
                  (annual_value, idx) => (
                    <List.Item key={idx}>
                      {formatAnnualValue(annual_value)}
                    </List.Item>
                  )
                )}
              </List>
            )}
          </Table.Cell>
          <Table.Cell>
            {exportData && exportData.total_value && (
              <List bulleted>
                {exportData.total_value.annual_values.map(
                  (annual_value, idx) => (
                    <List.Item key={idx}>
                      {formatAnnualValue(annual_value)}
                    </List.Item>
                  )
                )}
              </List>
            )}
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export const generateLaborForce = data => {
  if (!data) return '';
  const { by_occupation, total_size } = data;

  let occupationList = '';

  if (by_occupation && by_occupation.occupation) {
    occupationList = Object.entries(by_occupation.occupation).map(entry => (
      <List.Item key={entry[0]}>
        {capWithSpacing(entry[0])}: {entry[1].value}
        {entry[1].units} {entry[1].note && ` (${entry[1].note})`}
      </List.Item>
    ));
  }
  return (
    <Table definition unstackable celled compact collapsing>
      <Table.Header>
        <Table.Row textAlign="center">
          <Table.HeaderCell />
          <Table.HeaderCell>Labor Force</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row verticalAlign="top">
          <Table.Cell>Occupation</Table.Cell>
          <Table.Cell>
            {occupationList && <List bulleted>{occupationList}</List>}
          </Table.Cell>
        </Table.Row>
        <Table.Row verticalAlign="top">
          <Table.Cell>Total size</Table.Cell>
          <Table.Cell>
            {total_size && (
              <p>
                {`${numScale(total_size.total_people)} (${total_size.date}) `}
                <sup>(global rank - {total_size.global_rank})</sup>
              </p>
            )}
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export const generateGDP = data => {
  if (!data) return '';
  const {
    composition,
    official_exchange_rate,
    per_capita_purchasing_power_parity,
    purchasing_power_parity,
    real_growth_rate,
  } = data;

  return (
    <>
      <Header textAlign="center">GDP Figures</Header>
      {official_exchange_rate && (
        <p>
          <strong>Official exchange rate:</strong> $
          {numScale(official_exchange_rate.USD)} USD (
          {official_exchange_rate.date})
        </p>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap',
        }}
      >
        {per_capita_purchasing_power_parity &&
          generateDUVTable({
            attribute: 'Per capita purchasing power parity',
            ...per_capita_purchasing_power_parity,
          })}
        {purchasing_power_parity &&
          generateDUVTable({
            attribute: 'Purchasing power parity',
            ...purchasing_power_parity,
          })}
        {real_growth_rate &&
          generateDUVTable({
            attribute: 'Real growth rate',
            ...real_growth_rate,
          })}
      </div>
      {generateGDPcompTable(composition)}
    </>
  );
};

const generateGDPcompTable = ({ by_end_use, by_sector_of_origin }) => {
  if (!by_end_use && !by_sector_of_origin) return '';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
      }}
    >
      {by_end_use && (
        <Table celled compact collapsing unstackable>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell colSpan={2}>
                GDP composition by end use
                <SubHeader>({by_end_use.date})</SubHeader>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {by_end_use.end_uses &&
              Object.entries(by_end_use.end_uses).map(entry => (
                <Table.Row key={entry[0]}>
                  <Table.Cell>{capWithSpacing(entry[0])}</Table.Cell>
                  <Table.Cell textAlign="right">
                    {entry[1].value}
                    {entry[1].units}
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      )}

      {by_sector_of_origin && (
        <Table celled compact collapsing unstackable>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell colSpan={2}>
                GDP composition by sector
                <SubHeader>({by_sector_of_origin.date})</SubHeader>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {by_sector_of_origin.sectors &&
              Object.entries(by_sector_of_origin.sectors).map(entry => (
                <Table.Row key={entry[0]}>
                  <Table.Cell>{capWithSpacing(entry[0])}</Table.Cell>
                  <Table.Cell textAlign="right">
                    {entry[1].value}
                    {entry[1].units}
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
};
