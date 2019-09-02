import React, { Component } from 'react';
import { TransitionMotion, spring } from 'react-motion';
import { Button } from 'semantic-ui-react';
import { isMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import InfoTab from './components/infoTab/infoTab';
import handleDoubleClick from './components/handleDoubleClick';
import regionEllipses from './components/regionEllipses';
import regionLabels from './components/regionLabels';
import StatusBar from './components/statusBar/statusBar';
import { loadPaths, loadData } from './actions/dataActions';
import { regionClick } from './actions/quizActions';
import {
  setRegionCheckbox,
  zoomMap,
  recenterMap,
  setMap,
  tooltipMove,
  tooltipLeave,
} from './actions/mapActions';
import MobileMessage from './components/mobileMessage';
import SidebarContainer from './components/SidebarContainer';
import ChoroplethLegend from './components/ChoroplethLegend';
import ChoroplethSlider from './components/ChoroplethSlider';
import DirectionPad from './components/DirectionPad';
import QuestionBox from './components/quizBox/questionBox';
import Map from './Map';

const MOTIONCONFIG = { stiffness: 300, damping: 15 };

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

  markerClick = geographyPath => {
    this.props.regionClick(geographyPath);
  };

  handleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  render() {
    const { quiz, selectedProperties, infoTabShow } = this.props.quiz;
    const { zoomFactor, slider } = this.props.map;
    const { menuOpen } = this.state;

    const footerStyle = isMobile ? { fontSize: '10px' } : {};
    const infoArray = [selectedProperties];

    return (
      <div className="App">
        {!quiz && (
          <header className="App-header">
            <h1 className="App-title">Map Quiz</h1>
          </header>
        )}

        {isMobile && <MobileMessage />}

        <div className="zoomButtons">
          <Button.Group size="tiny" vertical>
            <Button
              onClick={() => this.props.zoomMap(zoomFactor)}
              icon="plus"
              inverted
              aria-label="map zoom in"
            />
            <Button
              onClick={() => this.props.zoomMap(1 / zoomFactor)}
              icon="minus"
              inverted
              aria-label="map zoom out"
            />
            <Button
              onClick={this.props.recenterMap}
              icon="undo"
              inverted
              aria-label="map zoom reset"
            />
          </Button.Group>
        </div>

        {quiz && <QuestionBox />}

        {quiz && <StatusBar />}

        <TransitionMotion
          defaultStyles={infoArray.map(infoProp => ({
            key: infoProp.name,
            style: { x: -230, opacity: 0 },
            data: infoProp,
          }))}
          styles={infoArray.map(infoProp => ({
            key: infoProp.name,
            style: {
              x: spring(infoTabShow ? 15 : -230, MOTIONCONFIG),
              opacity: spring(infoTabShow ? 1 : 0, MOTIONCONFIG),
            },
            data: infoProp,
          }))}
        >
          {interpolatedStyles => (
            <div>
              {interpolatedStyles.map(config => (
                <div
                  key={config.key}
                  style={{
                    position: 'absolute',
                    zIndex: '2',
                    left: `${config.style.x}px`,
                    top: '182px',
                    opacity: `${config.style.opacity}`,
                  }}
                >
                  <InfoTab regionData={config.data} />
                </div>
              ))}
            </div>
          )}
        </TransitionMotion>

        <DirectionPad />

        {!quiz && <ChoroplethLegend />}

        {!quiz && slider && <ChoroplethSlider />}

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
    recenterMap,
    setMap,
    regionClick,
    tooltipMove,
    tooltipLeave,
  }
)(App);
