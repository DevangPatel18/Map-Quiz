import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Button, Sidebar } from 'semantic-ui-react';
import { isMobile } from 'react-device-detect';
import SidebarTabs from './SidebarTabs';

const SidebarContainer = ({ handleMenu, menuOpen, isQuizActive, currentMap }) => (
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
        visibility: isQuizActive ? 'hidden' : 'visible',
        zIndex: '200',
      }}
      onClick={handleMenu}
      aria-label="sidebar button"
    />
    <Sidebar
      animation="overlay"
      vertical="true"
      visible={isQuizActive ? false : menuOpen}
      direction="right"
      width={!isMobile && currentMap === 'World' ? 'wide' : null}
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
      }}
      children={<SidebarTabs />}
    />
  </>
);

const getAppState = createSelector(
  state => state.quiz.isQuizActive,
  state => state.map.currentMap,
  (isQuizActive, currentMap) => ({
    isQuizActive,
    currentMap,
  })
);

export default connect(
  getAppState,
  null
)(SidebarContainer);
