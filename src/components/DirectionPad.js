import React from 'react';
import { Button } from 'semantic-ui-react';
import DirectionPadStyles from './styles/DirectionPadStyles';

const DirectionPad = props => {
  const {handleMapMove} = props
  return (
    <DirectionPadStyles>
      <div className="b" />
      <div className="up">
        <Button icon="arrow up" onClick={()=> handleMapMove("up")}/>
      </div>
      <div className="b" />
      <div className="left">
        <Button icon="arrow left" onClick={()=> handleMapMove("left")}/>
      </div>
      <div className="b" />
      <div className="right">
        <Button icon="arrow right" onClick={()=> handleMapMove("right")}/>
      </div>
      <div className="b" />
      <div className="down">
        <Button icon="arrow down" onClick={()=> handleMapMove("down")}/>
      </div>
      <div className="b" />
    </DirectionPadStyles>
  );
};

export default DirectionPad;
