import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { closeRegionModal } from '../actions/mapActions';
import { Modal, Button, Tab } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme, TabStyled } from './styles/RegionModalStyles';

const RegionModal = props => {
  const { modalRegionID, regionProfiles, closeRegionModal } = props;
  const profileData = regionProfiles[modalRegionID];
  const { name, ...displayData } = profileData;

  const panes = Object.keys(displayData).map(sectionName => ({
    menuItem: sectionName,
    render: () => (
      <Tab.Pane>
        <JSONTree data={displayData[sectionName]} theme={theme} />
      </Tab.Pane>
    ),
  }));

  if (modalRegionID) {
    return (
      <Modal open={true} size="large">
        <Modal.Header>{name}</Modal.Header>
        <Modal.Content scrolling style={{ height: '80vh' }}>
          <TabStyled
            menu={{
              secondary: true,
            }}
            panes={panes}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button secondary onClick={closeRegionModal}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
  return '';
};

const getAppState = createSelector(
  state => state.map.modalRegionID,
  state => state.data.regionProfiles,
  (modalRegionID, regionProfiles) => ({
    modalRegionID,
    regionProfiles,
  })
);

export default connect(getAppState, {
  closeRegionModal,
})(RegionModal);
