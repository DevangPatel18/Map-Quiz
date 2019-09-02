import React from 'react';
import { connect } from 'react-redux';
import { Button, Sidebar } from 'semantic-ui-react';
import { isMobile } from 'react-device-detect';
import SidebarTabs from './SidebarTabs';

const SidebarContainer = props => {
  const { handleMenu, menuOpen } = props;
  const { quiz } = props.quiz;
  const { currentMap } = props.map;

  return (
    <>
      <Button
        icon={menuOpen ? 'close' : 'sidebar'}
        circular
        inverted={!menuOpen}
        style={{
          position: 'absolute',
          margin: '0',
          right: '1em',
          top: '1em',
          transition: 'all 0.3s ease-in-out',
          visibility: quiz ? 'hidden' : 'visible',
          zIndex: '200',
        }}
        onClick={handleMenu}
        aria-label="sidebar button"
      />
      <Sidebar
        animation="overlay"
        vertical="true"
        visible={quiz ? false : menuOpen}
        direction="right"
        width={!isMobile && currentMap === 'World' ? 'wide' : null}
        style={{
          background: 'rgba(0, 0, 0, 0.5)',
        }}
        children={<SidebarTabs />}
      />
    </>
  );
};

const mapStateToProps = state => ({
  quiz: state.quiz,
  map: state.map,
});

export default connect(
  mapStateToProps,
  null
)(SidebarContainer);
