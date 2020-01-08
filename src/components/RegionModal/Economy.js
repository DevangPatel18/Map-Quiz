import React from 'react';
import { Container, List } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../styles/RegionModalStyles';
import {
  generateParagraphs,
  generateTableList,
} from '../../helpers/textHelpers';
import {
  formatAnnualValue,
  formatDUVobj,
  generateImportExportTable,
  generateLaborForce,
  generateGDP,
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
    gdp,
    household_income_by_percentage_share,
    ...rest
  } = data;

  const importData = imports;
  const exportData = data.exports;
  const houseIncome = household_income_by_percentage_share;

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
      <List bulleted>
        {budget_surplus_or_deficit && (
          <>
            <List.Item>
              <strong>Budget surplus or deficit: </strong>
              {`${budget_surplus_or_deficit.percent_of_gdp}% (${budget_surplus_or_deficit.date} - global rank ${budget_surplus_or_deficit.global_rank})`}
            </List.Item>
          </>
        )}
        {dateUnitValueObj.map((obj, i) => (
          <React.Fragment key={i}>{formatDUVobj(obj)}</React.Fragment>
        ))}
        {stock_of_direct_foreign_investment && (
          <List.Item>
            <strong>Stock of direct Foreign investment</strong>
            <List>
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
          <List.Item>
            <strong>Fiscal Year: </strong>
            {fiscal_year.start} - {fiscal_year.end}
          </List.Item>
        )}
        {population_below_poverty_line && (
          <List.Item>
            <strong>Population below poverty line: </strong>
            {formatAnnualValue(population_below_poverty_line)}
            {population_below_poverty_line.note && (
              <List>
                <List.Item>
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
          <List.Item>
            <strong>Industrial production growth rate: </strong>
            {industrial_production_growth_rate.annual_percentage_increase}% (
            {industrial_production_growth_rate.date}){' '}
            <sup>
              (global rank - {industrial_production_growth_rate.global_rank})
            </sup>
          </List.Item>
        )}
        {taxes_and_other_revenues && (
          <List.Item>
            <strong>Taxes and other revenues: </strong>
            {taxes_and_other_revenues.percent_of_gdp}% of GDP (
            {taxes_and_other_revenues.date}){' '}
            <sup>(global rank - {taxes_and_other_revenues.global_rank})</sup>
          </List.Item>
        )}
        {houseIncome && (
          <List.Item>
            <strong>Household income by percentage share: </strong>
            {houseIncome.note && `(note: ${houseIncome.note})`}
            <List>
              <List.Item>
                {houseIncome.lowest_ten_percent &&
                  `lowest 10%: ${houseIncome.lowest_ten_percent.value}${houseIncome.lowest_ten_percent.units}`}
                {houseIncome.lowest_ten_percent.date &&
                  ` (${houseIncome.lowest_ten_percent.date})`}
              </List.Item>
              <List.Item>
                {houseIncome.highest_ten_percent &&
                  `highest 10%: ${houseIncome.highest_ten_percent.value}${houseIncome.highest_ten_percent.units}`}
                {houseIncome.highest_ten_percent.date &&
                  ` (${houseIncome.highest_ten_percent.date})`}
              </List.Item>
            </List>
          </List.Item>
        )}
      </List>
      {generateImportExportTable({ importData, exportData })}
      {agriculture_products &&
        generateTableList({
          list: agriculture_products.products,
          title: 'Agriculture products',
          note: agriculture_products.note,
        })}
      {industries &&
        generateTableList({
          list: industries.industries,
          title: 'Industries',
          note: industries.note,
        })}
      {generateLaborForce(labor_force)}
      {generateGDP(gdp)}
      {isRestTreeNonEmpty && <JSONTree data={abstractObj} theme={theme} />}
    </Container>
  );
};

export default Economy;
