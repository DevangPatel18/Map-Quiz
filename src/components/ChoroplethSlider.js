import React from 'react';
import { connect } from 'react-redux';
import ChoroplethSliderStyles from './styles/ChoroplethSliderStyles';
import { setChoroYear } from '../actions/mapActions';

const ChoroplethSlider = props => {
  const { setChoroYear } = props;
  const { sliderYear } = props.map;
  console.log(sliderYear);
  return (
    <ChoroplethSliderStyles>
      <input
        type="range"
        min="1960"
        max="2018"
        value={sliderYear}
        name="choroplethSlider"
        onChange={e => setChoroYear(e.target.value)}
      />
    </ChoroplethSliderStyles>
  );
};

const mapStateToProps = state => ({
  map: state.map,
});

export default connect(
  mapStateToProps,
  { setChoroYear }
)(ChoroplethSlider);
