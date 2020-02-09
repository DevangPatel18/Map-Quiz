import React from 'react';
import { Accordion, Container, List } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../styles/RegionModalStyles';
import {
  generatePeopleItem,
  generateHealthTable,
  generateHealthMID,
  generateValueUnitTable,
} from './PeopleHelpers';

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
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-evenly',
              flexWrap: 'wrap',
            }}
          >
            {generateValueUnitTable({ life_expectancy_at_birth })}
            {generateValueUnitTable({ infant_mortality_rate })}
          </div>
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
