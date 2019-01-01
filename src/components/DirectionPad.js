import React from 'react';
import { Button } from 'semantic-ui-react';
import DirectionPadStyles from './styles/DirectionPadStyles';

const DirectionPad = () => {
  return (
    <DirectionPadStyles>
      <div className="b" />
      <div className="up">
        <Button icon="arrow up" />
      </div>
      <div className="b" />
      <div className="left">
        <Button icon="arrow left" />
      </div>
      <div className="b" />
      <div className="right">
        <Button icon="arrow right" />
      </div>
      <div className="b" />
      <div className="down">
        <Button icon="arrow down" />
      </div>
      <div className="b" />
    </DirectionPadStyles>
  );
};

export default DirectionPad;
