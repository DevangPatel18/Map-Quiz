import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import ChoroplethSliderStyles, {
  SliderTickStyles,
  SliderYearStyles,
} from './styles/ChoroplethSliderStyles';
import { setChoroYear } from '../actions/mapActions';

const ChoroplethSlider = ({ slider, sliderYear, setChoroYear }) =>
  slider && (
    <ChoroplethSliderStyles>
      <input
        type="range"
        min="1960"
        max="2018"
        value={sliderYear}
        name="choroplethSlider"
        onChange={e => setChoroYear(e.target.value)}
      />
      <div style={{ position: 'relative' }}>
        <SliderTickStyles left={'0.75rem'}>1960</SliderTickStyles>
        <SliderTickStyles left={'calc(100% - 0.75rem)'}>2018</SliderTickStyles>
      </div>
      <SliderYearStyles>{sliderYear}</SliderYearStyles>
    </ChoroplethSliderStyles>
  );

const getAppState = createSelector(
  state => state.map.slider,
  state => state.map.sliderYear,
  (slider, sliderYear) => ({
    slider,
    sliderYear,
  })
);

export default connect(
  getAppState,
  { setChoroYear }
)(ChoroplethSlider);
