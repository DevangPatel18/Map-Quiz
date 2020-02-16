import React from 'react';
import { List, Table, Header, Popup, Icon } from 'semantic-ui-react';
import styled, { css } from 'styled-components';
import { isMobile } from 'react-device-detect';
import {
  capWithSpacing,
  remUnderscore,
  numScale,
  generateList,
} from '../../helpers/textHelpers';
import { TableContainer } from '../styles/RegionModalStyles';

const SubHeader = styled.p`
  font-size: 0.7em;
`;

const RowHeaderTextStyled = styled.div`
  ${isMobile &&
    css`
      transform-origin: right center;
      transform: rotate(-90deg) translateX(-2rem);
      white-space: nowrap;
      width: 0;
    `}
`;

export const formatAnnualValue = obj => {
  const { value, units, date } = obj;
  return `${numScale(value)} ${remUnderscore(units)} (${date})`;
};

const tableProps = {
  celled: true,
  compact: true,
  collapsing: true,
  unstackable: true,
};

const centerStyle = { margin: '0 auto' };

export const formatDUVobj = obj => (
  <List.Item>
    {obj.attribute && (
      <List.Header>
        {`${capWithSpacing(obj.attribute)}`}
        {obj.note && (
          <Popup
            content={generateList(obj.note.split(';'))}
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
  <Table {...tableProps} textAlign="center">
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

export const generateImportExportTable = (dataObj = {}) => {
  if (
    Object.entries(dataObj).length === 0 ||
    (!dataObj.importData && !dataObj.exportData)
  )
    return '';

  const cols = ['importData', 'exportData'];

  return (
    <Table
      {...tableProps}
      definition
      size={isMobile ? 'small' : 'large'}
      style={centerStyle}
    >
      <Table.Header>
        <Table.Row verticalAlign="top">
          <Table.HeaderCell />
          <Table.HeaderCell>Imports</Table.HeaderCell>
          <Table.HeaderCell>Exports</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row verticalAlign="top">
          <Table.Cell verticalAlign="middle">
            <RowHeaderTextStyled>Commodities</RowHeaderTextStyled>
          </Table.Cell>
          {cols.map(col => (
            <Table.Cell key={col}>
              {dataObj[col]?.commodities && (
                <>
                  <List bulleted>
                    {dataObj[col]?.commodities?.by_commodity?.map(commodity => (
                      <List.Item key={commodity}>{commodity}</List.Item>
                    ))}
                  </List>
                  {dataObj[col]?.commodities?.date && (
                    <p>Date: {dataObj[col].commodities.date}</p>
                  )}
                </>
              )}
            </Table.Cell>
          ))}
        </Table.Row>
        <Table.Row verticalAlign="top">
          <Table.Cell verticalAlign="middle">
            <RowHeaderTextStyled>Partners</RowHeaderTextStyled>
          </Table.Cell>
          {cols.map(col => (
            <Table.Cell key={col}>
              {dataObj[col]?.partners && (
                <>
                  <List bulleted>
                    {dataObj[col]?.partners?.by_country?.map(
                      ({ name, percent }) => (
                        <List.Item key={name}>
                          {name} - {percent}%
                        </List.Item>
                      )
                    )}
                  </List>
                  {dataObj[col]?.partners?.date && (
                    <p>Date: {dataObj[col]?.partners?.date}</p>
                  )}
                </>
              )}
            </Table.Cell>
          ))}
        </Table.Row>
        <Table.Row verticalAlign="top">
          <Table.Cell verticalAlign="middle">
            <RowHeaderTextStyled>Total Value</RowHeaderTextStyled>
          </Table.Cell>
          {cols.map(col => (
            <Table.Cell key={col}>
              {dataObj[col]?.total_value && (
                <List bulleted>
                  {dataObj[col]?.total_value?.annual_values?.map(
                    (annual_value, idx) => (
                      <List.Item key={idx}>
                        {formatAnnualValue(annual_value)}
                      </List.Item>
                    )
                  )}
                </List>
              )}
            </Table.Cell>
          ))}
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
    <Table {...tableProps} definition style={centerStyle}>
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
      <TableContainer>
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
      </TableContainer>
      {generateGDPcompTable(composition)}
    </>
  );
};

const generateGDPcompTable = data => {
  if (!data) return '';
  const { by_end_use, by_sector_of_origin } = data;
  if (!by_end_use && !by_sector_of_origin) return '';
  return (
    <TableContainer>
      {by_end_use && (
        <Table {...tableProps}>
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
    </TableContainer>
  );
};
