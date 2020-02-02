import React from 'react';
import { Accordion, Container, List } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../styles/RegionModalStyles';
import { generatePeopleItem } from './PeopleHelpers';

const People = ({ data }) => {
  const {
    adult_obesity,
    physicians_density,
    hospital_bed_density,
    underweight_children,
    ...rest
  } = data;

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
