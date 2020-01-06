import React from 'react';
import { Container, List } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../styles/RegionModalStyles';
import { generateParagraphs } from '../../helpers/textHelpers';
import {
  formatAnnualValue,
  formatDUVobj,
  generateImportExportTable,
  generateIndustries,
  generateLaborForce,
} from './EconomyHelpers';

const Economy = ({ data }) => {
  const {
    overview,
    agriculture_products,
    budget_surplus_or_deficit,
    budget,
    imports,
    exports,
    stock_of_direct_foreign_investment,
    fiscal_year,
    population_below_poverty_line,
    industrial_production_growth_rate,
    taxes_and_other_revenues,
    industries,
    labor_force,
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
        {stock_of_direct_foreign_investment && (
          <List.Item as="li">
            <strong>Stock of direct Foreign investment</strong>
            <List as="ul">
              {Object.keys(stock_of_direct_foreign_investment).map(subAttr => (
                <React.Fragment key={subAttr}>
                  {formatDUVobj({
                    attribute: subAttr,
                    ...stock_of_direct_foreign_investment[subAttr],
                  })}
                </React.Fragment>
              ))}
            </List>
          </List.Item>
        )}
        {fiscal_year && (
          <List.Item as="li">
            <strong>Fiscal Year: </strong>
            {fiscal_year.start} - {fiscal_year.end}
          </List.Item>
        )}
        {population_below_poverty_line && (
          <List.Item as="li">
            <strong>Population below poverty line: </strong>
            {formatAnnualValue(population_below_poverty_line)}
            {population_below_poverty_line.note && (
              <List as="ul">
                <List.Item as="li">
                  <em>
                    {'Note: '}
                    {population_below_poverty_line.note}
                  </em>
                </List.Item>
              </List>
            )}
          </List.Item>
        )}
        {industrial_production_growth_rate && (
          <List.Item as="li">
            <strong>Industrial production growth rate: </strong>
            {industrial_production_growth_rate.annual_percentage_increase}% (
            {industrial_production_growth_rate.date}){' '}
            <sup>
              (global rank - {industrial_production_growth_rate.global_rank})
            </sup>
          </List.Item>
        )}
        {taxes_and_other_revenues && (
          <List.Item as="li">
            <strong>Taxes and other revenues: </strong>
            {taxes_and_other_revenues.percent_of_gdp}% of GDP (
            {taxes_and_other_revenues.date}){' '}
            <sup>(global rank - {taxes_and_other_revenues.global_rank})</sup>
          </List.Item>
        )}
      </List>
      {generateImportExportTable({ importData, exportData })}
      {generateIndustries(industries)}
      {generateLaborForce(labor_force)}
      {isRestTreeNonEmpty && <JSONTree data={abstractObj} theme={theme} />}
    </Container>
  );
};

export default Economy;
