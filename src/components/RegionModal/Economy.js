import React from 'react';
import { Container, List } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../styles/RegionModalStyles';
import { generateParagraphs } from '../../helpers/textHelpers';
import { formatDUVobj, generateImportExportTable } from './EconomyHelpers';

const Economy = ({ data }) => {
  const {
    overview,
    agriculture_products,
    budget_surplus_or_deficit,
    budget,
    imports,
    exports,
    ...rest
  } = data;

  const importData = imports;
  const exportData = data.exports;

  let dateUnitValueObj = [];
  const abstractObj = {};

  for (let attribute in rest) {
    if (rest[attribute].annual_values) {
      dateUnitValueObj.push({ attribute, ...rest[attribute] });
    } else {
      abstractObj[attribute] = rest[attribute];
    }
  }

  const isRestTreeNonEmpty = Object.keys(dateUnitValueObj).length !== 0;

  return (
    <Container text>
      {generateParagraphs(overview)}
      <List as="ul">
        {agriculture_products && (
          <>
            <List.Item as="li">
              <strong>Agriculture products: </strong>
              {agriculture_products.products.join(', ')}
              {agriculture_products.note && (
                <List as="ul">
                  <List.Item as="li">{agriculture_products.note}</List.Item>
                </List>
              )}
            </List.Item>
          </>
        )}
        {budget_surplus_or_deficit && (
          <>
            <List.Item as="li">
              <strong>Budget surplus or deficit: </strong>
              {`${budget_surplus_or_deficit.percent_of_gdp}% (${budget_surplus_or_deficit.date} - global rank ${budget_surplus_or_deficit.global_rank})`}
            </List.Item>
          </>
        )}
        {dateUnitValueObj.map((obj, i) => (
          <React.Fragment key={i}>{formatDUVobj(obj)}</React.Fragment>
        ))}
      </List>
      {generateImportExportTable({ importData, exportData })}
      {isRestTreeNonEmpty && <JSONTree data={abstractObj} theme={theme} />}
    </Container>
  );
};

export default Economy;
