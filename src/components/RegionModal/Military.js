import React from 'react';
import { Container } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from '../styles/RegionModalStyles';

const Military = ({ data }) => {
  const { ...rest } = data;
  const isRestTreeNonEmpty = Object.keys(rest).length !== 0;

  return (
    <Container text>
      {isRestTreeNonEmpty && <JSONTree data={rest} theme={theme} />}
    </Container>
  );
};

export default Military;
