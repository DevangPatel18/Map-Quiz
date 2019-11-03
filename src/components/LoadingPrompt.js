import React from 'react';
import { Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';

const LoadingPrompt = ({ data: { loadingData } }) => (
  <Loader
    size="massive"
    inverted
    active={loadingData}
    inline="centered"
    style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    }}
  >
    <span
      style={{
        fontSize: '2rem',
        fontWeight: '600',
      }}
    >
      Loading
    </span>
  </Loader>
);

const mapStateToProps = state => ({
  data: state.data,
});

export default connect(
  mapStateToProps,
  null
)(LoadingPrompt);
