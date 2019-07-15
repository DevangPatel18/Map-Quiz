import React, { Component } from 'react';
import WheelReact from 'wheel-react';
import { Button, Sidebar } from 'semantic-ui-react';
import { isMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import InfoTab from './components/infoTab/infoTab';
import RegionButtons from './components/regionButtons';
import QuizBox from './components/quizBox/quizBox';
import handleDoubleClick from './components/handleDoubleClick';
import CountrySearch from './components/countrySearch';
import regionEllipses from './components/regionEllipses';
import countryLabels from './components/countryLabels';
import StatusBar from './components/statusBar/statusBar';
import { loadPaths, loadData } from './actions/dataActions';
import { countryClick } from './actions/quizActions';
import {
  setRegionCheckbox,
  zoomMap,
  recenterMap,
  setMap,
} from './actions/mapActions';
import MobileMessage from './components/mobileMessage';
import ChoroplethToggles from './components/ChoroplethToggles';
import DropdownSelectionStyles from './components/styles/DropdownSelectionStyles';
import DirectionPad from './components/DirectionPad';
import QuestionBox from './components/quizBox/questionBox';
import Map from './Map';

class App extends Component {
  constructor() {
    super();

    this.state = {
      menuOpen: true,
    };

    WheelReact.config({
      left: () => {
        // console.log('wheel left detected.');
      },
      right: () => {
        // console.log('wheel right detected.');
      },
      up: () => {
        // console.log('wheel up detected.');
        this.props.zoomMap(0.5);
      },
      down: () => {
        // console.log('wheel down detected.');
        this.props.zoomMap(2);
      },
    });

    this.handleDoubleClick = handleDoubleClick.bind(this);
    this.regionEllipses = regionEllipses.bind(this);
    this.countryLabels = countryLabels.bind(this);
    this.toggleOrientation = this.toggleOrientation.bind(this);
    this.adjustMapSize = this.adjustMapSize.bind(this);
    this.handleMenu = this.handleMenu.bind(this);
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
    window.addEventListener('resize', this.adjustMapSize);
  }

  componentWillUnmount() {
    WheelReact.clearTimeout();
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

  handleMoveStart(currentCenter) {
    // console.log("Current center: ", currentCenter)
  }

  handleMoveEnd(newCenter) {
    // console.log("New center: ", newCenter)
  }

  markerClick = geographyPath => {
    this.props.countryClick(geographyPath);
  };

  handleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  render() {
    const { quiz } = this.props.quiz;
    const { zoomFactor, currentMap } = this.props.map;
    const { menuOpen } = this.state;

    const footerStyle = isMobile ? { fontSize: '10px' } : {};

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
            />
            <Button
              onClick={() => this.props.zoomMap(1 / zoomFactor)}
              icon="minus"
              inverted
            />
            <Button onClick={this.props.recenterMap} icon="undo" inverted />
          </Button.Group>
        </div>

        {quiz && <QuestionBox />}

        {quiz && <StatusBar />}

        <InfoTab />

        <ChoroplethToggles />

        <DirectionPad />

        <Button
          icon="sidebar"
          circular
          inverted
          style={{
            position: 'absolute',
            margin: '0',
            right: '1em',
            top: '1em',
            transition: 'all 0.3s ease-in-out',
            visibility: quiz ? 'hidden' : 'visible',
            zIndex: '200',
          }}
          onClick={this.handleMenu}
        />
        <Sidebar
          animation="overlay"
          vertical="true"
          visible={quiz ? false : menuOpen}
          direction="right"
          width={
            isMobile
              ? currentMap === 'World'
                ? null
                : 'thin'
              : currentMap === 'World'
              ? 'wide'
              : null
          }
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            paddingTop: '50px',
          }}
        >
          <DropdownSelectionStyles>
            <RegionButtons />
            <CountrySearch />
          </DropdownSelectionStyles>
          <QuizBox />
        </Sidebar>

        <div {...WheelReact.events}>
          <Map app={this} />
        </div>
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
    countryClick,
  }
)(App);
