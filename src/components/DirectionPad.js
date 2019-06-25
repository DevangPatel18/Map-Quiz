import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { moveMap } from '../actions/mapActions';
import DirectionPadStyles from './styles/DirectionPadStyles';

const DirectionPad = props => {
  const { moveMap } = props;
  return (
    <DirectionPadStyles>
      <div className="b" />
      <div className="up">
        <Button icon="arrow up" onClick={() => moveMap('up')} />
      </div>
      <div className="b" />
      <div className="left">
        <Button icon="arrow left" onClick={() => moveMap('left')} />
      </div>
      <div className="b" />
      <div className="right">
        <Button icon="arrow right" onClick={() => moveMap('right')} />
      </div>
      <div className="b" />
      <div className="down">
        <Button icon="arrow down" onClick={() => moveMap('down')} />
      </div>
      <div className="b" />
    </DirectionPadStyles>
  );
};

export default connect(
  null,
  { moveMap }
)(DirectionPad);
