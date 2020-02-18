import React from 'react';
import { Container, List, Header } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../styles/RegionModalStyles';
import { generateList } from '../../helpers/textHelpers';
import { generateValueUnitTable } from './PeopleHelpers';

const Communications = ({ data }) => {
  const { broadcast_media, note, telephones, ...rest } = data;
  const isRestTreeNonEmpty = Object.keys(rest).length !== 0;

  let tableData;
  if (telephones) {
    const { system, ...rest_telephones } = telephones;
    tableData = rest_telephones;
    rest.telephones_system = system;
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
          {generateValueUnitTable({ telephones: tableData })}
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
