import React from 'react';
import { Accordion, Container, List } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../styles/RegionModalStyles';
import { generateSubListItem } from './GeographyHelpers';
import { capWithSpacing } from '../../helpers/textHelpers';

const Government = ({ data }) => {
  const { ...rest } = data;
  const other = {};
  const subListSections = Object.entries(rest).reduce(
    (acc, [section, value]) => {
      if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.values(value).every(val => typeof val === 'string')
      ) {
        acc.push({ [section]: value });
      } else {
        other[section] = value;
      }
      return acc;
    },
    []
  );

  const isOtherTreeNonEmpty = Object.keys(other).length !== 0;

  const panels = [];

  subListSections.forEach(subList => {
    const sectionName = Object.keys(subList)[0];
    panels.push({
      key: sectionName,
      title: capWithSpacing(sectionName),
      content: {
        content: (
          <Container text>
            <List bulleted>
              {Object.entries(subList[sectionName]).map(([key, value], idx) => (
                <React.Fragment key={idx}>
                  {generateSubListItem({ [key]: value })}
                </React.Fragment>
              ))}
            </List>
          </Container>
        ),
      },
    });
  });

  if (isOtherTreeNonEmpty) {
    panels.push({
      key: 'jsonTree',
      title: 'Other',
      content: {
        content: <JSONTree data={other} theme={theme} />,
      },
    });
  }

  return <Accordion styled fluid exclusive={false} panels={panels} />;
};

export default Government;
