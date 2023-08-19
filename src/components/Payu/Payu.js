import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Panel } from "react-bootstrap";
import { LoadingItemPlaceholder } from "@/components/Elements";

class Payu extends Component {
  static entityName = "Payu";

  componentWillReceiveProps(nextProps) {}

  render() {
    const { mode } = this.props;
    if (mode === "loading") {
      return <LoadingItemPlaceholder />;
    }

    return (
      <div className="ProductSetup">
        <Panel>Payu test</Panel>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({});

export default withRouter(connect(mapStateToProps)(Payu));
