import React from 'react';
import { Container, List, Header } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../styles/RegionModalStyles';
import { generateDUVTable } from './EconomyHelpers';
import {
  generateSubListItem,
  generateTextItem,
  generateList,
} from '../../helpers/textHelpers';

const Military = ({ data }) => {
  const {
    expenditures,
    service_age_and_obligation,
    branches,
    note,
    ...rest
  } = data;
  const isRestTreeNonEmpty = Object.keys(rest).length !== 0;

  let serviceAge;

  if (service_age_and_obligation) {
    const { years_of_age, date, note } = service_age_and_obligation;

    serviceAge = (
      <div style={{ flex: '1', marginRight: '1rem', minWidth: '60%' }}>
        <Header>Service age and obligation {date && ` (${date})`}</Header>
        <List bulleted>
          {generateTextItem({ years_of_age })}
          {generateSubListItem({ note })}
        </List>
      </div>
    );
  }

  let branchesList;

  if (branches) {
    const { by_name, date } = branches;

    branchesList = (
      <>
        <Header>Branches {date && ` (${date})`}</Header>
        {generateList(by_name)}
      </>
    );
  }

  let noteList;

  if (note) {
    noteList = (
      <>
        <Header>Note</Header>
        {generateList(note.split(';'))}
      </>
    );
  }

  return (
    <Container text>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {serviceAge}
        {expenditures &&
          generateDUVTable({ ...expenditures, attribute: 'expenditures' })}
      </div>
      {branchesList}
      {noteList}
      {isRestTreeNonEmpty && <JSONTree data={rest} theme={theme} />}
    </Container>
  );
};

export default Military;
