import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';


const WithTooltip = ({ helpText, children }) => {

  if (children === null) {
    return null;
  }
  if (helpText === '') {
    return children;
  }
  const editTooltip = (
      <Tooltip id="tooltip">
        {helpText}
      </Tooltip>
  );
  return (
      <OverlayTrigger overlay={editTooltip} placement="top">
        { children }
      </OverlayTrigger>
  );
};

WithTooltip.defaultProps = {
  children: null,
  helpText: '',
};

WithTooltip.propTypes = {
  children: PropTypes.element,
  helpText: PropTypes.string,
};

export default WithTooltip;
