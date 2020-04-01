import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Indicator = (props) => {
  if(!props.indicator || !props.indicator.enabled) {
    return <span></span>;
  } else if(!props.indicator.loaded) {
    return (
      <span className="indicator" id={props.id}>
        <div className="preloader-wrapper indicatorLoader active orange-text">
          <div className="circle-clipper left">
            <div className="circle"></div>
          </div>
          <div className="gap-patch">
            <div className="circle"></div>
          </div>
          <div className="circle-clipper right">
            <div className="circle"></div>
          </div>
        </div>
      </span>
    );
  }

  return (
    <span className="indicator" id={props.id}>
      {props.indicator.success ? (
        <i className="material-icons green-text text-lighten-2">
          check_circle
        </i>
      ) : (
        <i className="material-icons red-text text-lighten-2">
          mood_bad
        </i>
      )}
    </span>
  );
};

Indicator.propTypes = {
  // indicatorId *must* be one of the redux indicator reducer ids.
  indicatorId: PropTypes.string.isRequired,

  // All indicators should use a DOM id.
  id: PropTypes.string.isRequired
};

const mapState = (state, ownProps) => ({
  indicator: state.progress[ownProps.indicatorId]
});

export default connect(mapState)(Indicator);
