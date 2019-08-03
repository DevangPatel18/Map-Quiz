import React from 'react';
import ChoroplethSliderStyles from './styles/ChoroplethSliderStyles';

const ChoroplethSlider = () => {
  return (
    <ChoroplethSliderStyles>
      <input
        type="range"
        min="1960"
        max="2018"
        // value="2018"
        name="choroplethSlider"
        onChange={e => console.log(e.target.value)}
      />
    </ChoroplethSliderStyles>
  );
};

export default ChoroplethSlider;
