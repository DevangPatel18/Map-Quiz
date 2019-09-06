import React, { Component } from 'react';
import { isMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import handleDoubleClick from './helpers/handleDoubleClick';
import regionEllipses from './helpers/regionEllipses';
import regionLabels from './helpers/regionLabels';
import { loadPaths, loadData } from './actions/dataActions';
import {
  processClickAnswer,
  loadNewInfoTab,
  toggleInfoTab,
} from './actions/quizActions';
import {
  setRegionCheckbox,
  zoomMap,
  setMap,
  tooltipMove,
  tooltipLeave,
} from './actions/mapActions';
import SidebarContainer from './components/SidebarContainer';
import InterfaceElements from './components/InterfaceElements';
import Map from './Map';
import { checkIfQuizIncomplete } from './helpers/quizActionHelpers';

class App extends Component {
  constructor() {
    super();

    this.state = {
      menuOpen: true,
    };

    this.handleDoubleClick = handleDoubleClick.bind(this);
    this.regionEllipses = regionEllipses.bind(this);
    this.regionLabels = regionLabels.bind(this);
    this.toggleOrientation = this.toggleOrientation.bind(this);
    this.adjustMapSize = this.adjustMapSize.bind(this);
    this.handleMenu = this.handleMenu.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
  }

  async componentDidMount() {
    const { loadPaths, loadData, setRegionCheckbox, setMap } = this.props;

    const width = window.innerWidth;
    const height = window.innerHeight;

    if (isMobile) {
      const dimensions = height > width ? [310, 551] : [980, 551];
      setMap({ dimensions, zoomFactor: 1.5 });
    } else {
      this.adjustMapSize();
    }

    await loadPaths();
    await loadData();
    setRegionCheckbox();
    window.addEventListener('orientationchange', this.toggleOrientation);

    // Disable on mobile due to keyboard triggering resize
    if (!isMobile) {
      window.addEventListener('resize', this.adjustMapSize);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('orientationchange', this.toggleOrientation);
    window.removeEventListener('resize', this.adjustMapSize);
  }

  toggleOrientation() {
    const { map, setMap } = this.props;
    const { dimensions, zoomFactor } = map;
    const newDimensions = dimensions[0] === 310 ? [980, 551] : [310, 551];
    setMap({ dimensions: newDimensions, zoomFactor });
  }

  adjustMapSize() {
    const { map, setMap } = this.props;
    const { dimensions } = map;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratio = width / height;
    let newDimensions;
    if (ratio > 1.43) {
      newDimensions = [980, 551];
    } else if (ratio > 0.85) {
      newDimensions = [645, 551];
    } else {
      newDimensions = [420, 551];
    }
    if (newDimensions[0] !== dimensions[0]) {
      setMap({ dimensions: newDimensions, zoomFactor: 2 });
    }
  }

  handleWheel(event) {
    if (event.deltaY > 0) {
      this.props.zoomMap(0.5);
    }
    if (event.deltaY < 0) {
      this.props.zoomMap(2);
    }
  }

  handleMoveStart(currentCenter) {
    // console.log("Current center: ", currentCenter)
  }

  handleMoveEnd(newCenter) {
    // console.log("New center: ", newCenter)
  }

  handleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  handleRegionClick = geographyPath => {
    const { isTypeQuizActive, selectedProperties } = this.props.quiz;
    const { processClickAnswer, loadNewInfoTab, toggleInfoTab } = this.props;
    if (isTypeQuizActive) return;
    const geoProperties = geographyPath.properties;
    if (checkIfQuizIncomplete()) {
      processClickAnswer(geoProperties);
    } else if (geoProperties.name !== selectedProperties.name) {
      loadNewInfoTab(geoProperties);
    } else {
      toggleInfoTab();
    }
  };

  render() {
    const { isQuizActive } = this.props.quiz;
    const { menuOpen } = this.state;

    const footerStyle = isMobile ? { fontSize: '10px' } : {};

    return (
      <div className="App">
        {!isQuizActive && (
          <header className="App-header">
            <h1 className="App-title">Map Quiz</h1>
          </header>
        )}
        <InterfaceElements />
        <SidebarContainer handleMenu={this.handleMenu} menuOpen={menuOpen} />

        <Map app={this} />
        <footer>
          <div style={footerStyle}>
            Copyright © 2018 Devang Patel. All rights reserved.
          </div>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data,
  map: state.map,
  quiz: state.quiz,
});

export default connect(
  mapStateToProps,
  {
    loadPaths,
    loadData,
    setRegionCheckbox,
    zoomMap,
    setMap,
    processClickAnswer,
    loadNewInfoTab,
    toggleInfoTab,
    tooltipMove,
    tooltipLeave,
  }
)(App);
