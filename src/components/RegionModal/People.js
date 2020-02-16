import React from 'react';
import { Accordion, Container, List } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme, TableContainer } from '../styles/RegionModalStyles';
import {
  generatePeopleItem,
  generateHealthTable,
  generateHealthMID,
  generateValueUnitTable,
  generateNamePercentTable,
  generateMajorUrbanAreasTable,
} from './PeopleHelpers';
import {
  generateSubListItem,
  generateParagraphs,
  generateSubObjListItem,
} from '../../helpers/textHelpers';

const People = ({ data }) => {
  const {
    adult_obesity,
    physicians_density,
    hospital_bed_density,
    underweight_children,
    drinking_water_source,
    sanitation_facility_access,
    hiv_aids,
    major_infectious_diseases,
    contraceptive_prevalence_rate,
    birth_rate,
    maternal_mortality_rate,
    mothers_mean_age_at_first_birth,
    death_rate,
    total_fertility_rate,
    life_expectancy_at_birth,
    infant_mortality_rate,
    population,
    population_growth_rate,
    population_distribution,
    age_structure,
    median_age,
    sex_ratio,
    demographic_profile,
    nationality,
    ethnic_groups,
    religions,
    languages,
    school_life_expectancy,
    dependency_ratios,
    youth_employment,
    youth_unemployment,
    literacy,
    major_urban_areas,
    education_expenditures,
    net_migration_rate,
    urbanization,
    note,
    ...rest
  } = data;

  const HIVsection = hiv_aids && (
    <List.Item>
      <List.Header>HIV Aids</List.Header>
      <List>
        {Object.entries(hiv_aids).map(([item, itemObj], idx) => (
          <React.Fragment key={idx}>
            {generatePeopleItem({ [item]: itemObj })}
          </React.Fragment>
        ))}
      </List>
    </List.Item>
  );

  const isOtherTreeNonEmpty = Object.keys(rest).length !== 0;

  const panels = [];

  panels.push({
    key: 'health',
    title: 'Health',
    content: {
      content: (
        <Container text>
          <List bulleted>
            {generatePeopleItem({ adult_obesity })}
            {generatePeopleItem({ physicians_density })}
            {generatePeopleItem({ hospital_bed_density })}
            {generatePeopleItem({ underweight_children })}
            {HIVsection}
          </List>
          {generateHealthTable({ drinking_water_source })}
          {generateHealthTable({ sanitation_facility_access })}
          {generateHealthMID(major_infectious_diseases)}
        </Container>
      ),
    },
  });

  panels.push({
    key: 'birth_and_mortality',
    title: 'Birth and Mortality',
    content: {
      content: (
        <Container text>
          <List bulleted>
            {generatePeopleItem({ contraceptive_prevalence_rate })}
            {generatePeopleItem({ birth_rate })}
            {generatePeopleItem({ maternal_mortality_rate })}
            {generatePeopleItem({ mothers_mean_age_at_first_birth })}
            {generatePeopleItem({ death_rate })}
            {generatePeopleItem({ total_fertility_rate })}
          </List>
          <TableContainer>
            {generateValueUnitTable({ life_expectancy_at_birth })}
            {generateValueUnitTable({ infant_mortality_rate })}
          </TableContainer>
        </Container>
      ),
    },
  });

  let updated_sex_ratio = {};
  if (sex_ratio) {
    updated_sex_ratio = { ...sex_ratio, ...sex_ratio.by_age };
  }

  panels.push({
    key: 'population',
    title: 'Population',
    content: {
      content: (
        <>
          <Container text>
            <List bulleted>
              {generatePeopleItem({ population })}
              {generatePeopleItem({ population_growth_rate })}
              {typeof population_distribution === 'string' &&
                generateSubListItem({ population_distribution })}
            </List>
          </Container>
          <TableContainer>
            {generateMajorUrbanAreasTable(major_urban_areas)}
            {generateValueUnitTable({ age_structure })}
            {generateValueUnitTable({ sex_ratio: updated_sex_ratio })}
          </TableContainer>
          <TableContainer>
            {generateValueUnitTable({ median_age })}
            {generateValueUnitTable({ school_life_expectancy })}
            {generateValueUnitTable({ literacy })}
            {generateValueUnitTable({ youth_employment })}
            {generateValueUnitTable({ youth_unemployment })}
            {dependency_ratios &&
              generateValueUnitTable({
                dependency_ratios: {
                  ...dependency_ratios,
                  ...dependency_ratios.ratios,
                },
              })}
          </TableContainer>
        </>
      ),
    },
  });

  if (demographic_profile) {
    panels.push({
      key: 'demographic_profile',
      title: 'Demographic profile',
      content: {
        content: generateParagraphs(demographic_profile),
      },
    });
  }

  panels.push({
    key: 'ethnic_language_religion',
    title: 'Ethnicity - Language - Religion',
    content: {
      content: (
        <TableContainer>
          {generateNamePercentTable({ ethnic_groups })}
          {generateNamePercentTable({ languages })}
          {generateNamePercentTable({ religions })}
        </TableContainer>
      ),
    },
  });

  panels.push({
    key: 'miscellaneous',
    title: 'Miscellaneous',
    content: {
      content: (
        <Container text>
          <List bulleted>
            {generatePeopleItem({ education_expenditures })}
            {generatePeopleItem({ net_migration_rate })}
            {generateSubObjListItem({ urbanization })}
            {generateSubObjListItem({ nationality })}
            {generateSubListItem({ note })}
          </List>
        </Container>
      ),
    },
  });

  if (isOtherTreeNonEmpty) {
    panels.push({
      key: 'jsonTree',
      title: 'Other',
      content: {
        content: <JSONTree data={rest} theme={theme} />,
      },
    });
  }

  return <Accordion styled fluid exclusive={false} panels={panels} />;
};

export default People;
