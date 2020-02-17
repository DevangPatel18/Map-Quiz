import React from 'react';
import { Container, List } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../styles/RegionModalStyles';
import { generateSubListItem } from '../../helpers/textHelpers';
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
      <List bulleted>
        {generateSubListItem({ broadcast_media })}
        {generateSubListItem({ note })}
      </List>

      {generateValueUnitTable({ telephones: tableData })}

      {isRestTreeNonEmpty && <JSONTree data={rest} theme={theme} />}
    </Container>
  );
};

export default Communications;
