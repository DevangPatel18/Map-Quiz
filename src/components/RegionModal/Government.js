import React from 'react';
import { Accordion, Container, List } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../styles/RegionModalStyles';
import {
  capWithSpacing,
  generateSubListItem,
  generateTableList,
} from '../../helpers/textHelpers';
import { reviseCapitalObj } from './GovernmentHelpers';

const Government = ({ data }) => {
  const {
    capital,
    dependent_areas,
    administrative_divisions,
    international_organization_participation,
    ...rest
  } = data;
  const other = {};

  const subListSections = Object.entries({
    capital: reviseCapitalObj(capital),
    ...rest,
  }).reduce((acc, [section, value]) => {
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
  }, []);

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

  if (dependent_areas) {
    panels.push({
      key: 'dependent_areas',
      title: 'Dependant Areas',
      content: {
        content: generateTableList({
          list: dependent_areas.areas,
          title: 'Dependant Areas',
          note: dependent_areas.note,
        }),
      },
    });
  }

  if (administrative_divisions) {
    panels.push({
      key: 'administrative_divisions',
      title: 'Administrative divisions',
      content: {
        content: generateTableList({
          list: administrative_divisions.map(({ name }) => name),
          title: 'Administrative divisions',
        }),
      },
    });
  }

  if (international_organization_participation) {
    panels.push({
      key: 'international_organization_participation',
      title: 'International Organization Participation',
      content: {
        content: generateTableList({
          list: international_organization_participation.map(
            ({ organization, note }) =>
              `${organization}${note ? ` (${note})` : ''}`
          ),
          title: 'International Organization Participation',
        }),
      },
    });
  }

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
