import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { closeRegionModal } from '../actions/mapActions';
import { Modal, Button } from 'semantic-ui-react';
import JSONTree from 'react-json-tree';
import { theme } from './styles/RegionModalStyles';

const RegionModal = props => {
  const { modalRegionID, regionProfiles, closeRegionModal } = props;
  const profileData = regionProfiles[modalRegionID];
  const { name, ...displayData } = profileData;

  if (modalRegionID) {
    return (
      <Modal open={true}>
        <Modal.Header>{name}</Modal.Header>
        <Modal.Content scrolling>
          <JSONTree data={displayData} theme={theme} />
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
