import React from 'react';
import { Container, List, Header } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../styles/RegionModalStyles';
import {
  generateList,
  generateSubListItem,
  generateTextItem,
} from '../../helpers/textHelpers';
import { generateValueUnitTable } from './PeopleHelpers';

const Communications = ({ data }) => {
  const { broadcast_media, note, telephones, internet, ...rest } = data;
  const isRestTreeNonEmpty = Object.keys(rest).length !== 0;

  let tableData;
  let telephoneSublist;
  if (telephones) {
    const { system, ...rest_telephones } = telephones;
    tableData = rest_telephones;
    if (system) {
      const { domestic, general_assessment, international } = system;
      telephoneSublist = (
        <List bulleted>
          {generateSubListItem({ domestic })}
          {generateSubListItem({ general_assessment })}
          {generateSubListItem({ international })}
        </List>
      );
    }
  }

  let internetList;
  if (internet) {
    const { country_code, users } = internet;
    let userItem;
    if (users) {
      const { total, percent_of_population, date, global_rank } = users;
      userItem = (
        <>
          {total && (
            <List.Item>
              <strong>Total:</strong>
              {total && ` ${total.toLocaleString()}`}
              {global_rank && <sup> (global rank - {global_rank})</sup>}
            </List.Item>
          )}
          {percent_of_population && (
            <List.Item>
              <strong>Percent of population:</strong>
              {percent_of_population && ` ${percent_of_population}%`}
              {date && ` (${date})`}
            </List.Item>
          )}
        </>
      );
    }
    internetList = (
      <List bulleted>
        {userItem}
        {generateTextItem({ country_code })}
      </List>
    );
  }

  return (
    <Container text>
      {broadcast_media && (
        <>
          <Header textAlign="center">Broadcast media</Header>
          {generateList(broadcast_media.split(';'))}
        </>
      )}

      {telephones && (
        <>
          <Header textAlign="center">Telephones</Header>
          {telephoneSublist}
          {generateValueUnitTable({ telephones: tableData })}
        </>
      )}

      {internet && (
        <>
          <Header textAlign="center">Internet</Header>
          {internetList}
        </>
      )}

      {note && (
        <>
          <Header textAlign="center">Note</Header>
          {generateList(note.split(';'))}
        </>
      )}
      {isRestTreeNonEmpty && <JSONTree data={rest} theme={theme} />}
    </Container>
  );
};

export default Communications;
