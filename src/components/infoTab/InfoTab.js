import React, { Component } from 'react';
import { connect } from 'react-redux';
import InfoTabStyles from '../styles/InfoTabStyles';

class InfoTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFlagImgPresent: true,
      isFlagImgReady: false,
    };
  }

  componentDidMount() {
    const { flag } = this.props.selectedProperties;
    const flagImg = new Image();
    flagImg.src = flag;
    if (!flag) {
      this.setState({ isFlagImgPresent: false });
      return;
    }

    flagImg.onload = () => {
      this.setState({ isFlagImgReady: true });
    };
  }

  render() {
    const { selectedProperties } = this.props
    let { name, capital, population, area, regionOf, flag } = selectedProperties;
    const { isFlagImgPresent, isFlagImgReady } = this.state;
    if (!isFlagImgReady && isFlagImgPresent) return '';
    population = population ? `${population.toLocaleString()}` : 'N/A';
    area = area ? `${area.toLocaleString()} km²` : 'N/A';
    return (
      <InfoTabStyles>
        {isFlagImgPresent && (
          <img className="infoTab-flag" src={flag} alt={`${name}-flag`} />
        )}
        <div className="infoTab-desc">
          <li>{name}</li>
          <li>Capital: {capital}</li>
          <li>Population: {population}</li>
          <li>Area: {area}</li>
          {regionOf ? <li>Region of {regionOf}</li> : ''}
        </div>
      </InfoTabStyles>
    );
  }
}

const mapStateToProps = state => ({
  selectedProperties: state.quiz.selectedProperties,
});

export default connect(mapStateToProps)(InfoTab);
