import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { moveMap } from '../actions/mapActions';
import DirectionPadStyles from './styles/DirectionPadStyles';

const DirectionPad = ({ moveMap }) => (
  <DirectionPadStyles>
    <div className="b" />
    <div className="up">
      <Button
        icon="arrow up"
        value="up"
        inverted
        onClick={moveMap}
        aria-label="move up"
      />
    </div>
    <div className="b" />
    <div className="left">
      <Button
        icon="arrow left"
        value="left"
        inverted
        onClick={moveMap}
        aria-label="move left"
      />
    </div>
    <div className="b" />
    <div className="right">
      <Button
        icon="arrow right"
        value="right"
        inverted
        onClick={moveMap}
        aria-label="move right"
      />
    </div>
    <div className="b" />
    <div className="down">
      <Button
        icon="arrow down"
        value="down"
        inverted
        onClick={moveMap}
        aria-label="move down"
      />
    </div>
    <div className="b" />
  </DirectionPadStyles>
);

export default connect(
  null,
  { moveMap }
)(DirectionPad);
