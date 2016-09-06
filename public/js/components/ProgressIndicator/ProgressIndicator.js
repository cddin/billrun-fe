import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ProgressBar } from 'react-bootstrap';


class ProgressIndicator extends Component {

  render() {
    const { progressIndicator } = this.props;

    if(!progressIndicator) return null;

    // return (
    //   <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1001}}>
    //     <div className="system-progress-indecator"></div>
    //   </div>
    // );
    return (
      <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1001}}>
        <ProgressBar active now={100} style={{ height: 5, marginBottom: 0, backgroundColor: 'transparent', borderRadius: 0}}  />
      </div>
    );
  }

}

function mapStateToProps(state) {
  return { progressIndicator: state.progressIndicator > 0 }
}
export default connect(mapStateToProps)(ProgressIndicator);
