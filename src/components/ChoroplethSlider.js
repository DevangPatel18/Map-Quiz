import React from 'react';
import { connect } from 'react-redux';
import ChoroplethSliderStyles, {
  SliderTickStyles,
} from './styles/ChoroplethSliderStyles';
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
      <div style={{ position: 'relative' }}>
        <SliderTickStyles left={'0.75rem'}>1960</SliderTickStyles>
        <SliderTickStyles left={'calc(100% - 0.75rem)'}>2018</SliderTickStyles>
      </div>
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
