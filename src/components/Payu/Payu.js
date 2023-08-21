import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Panel } from "react-bootstrap";
import { PayuComp } from "./PayuComp";
import {
  Form,
  FormGroup,
  ControlLabel,
  Col,
  Row,
  HelpBlock,
} from "react-bootstrap";
import Field from "@/components/Field";
import { ActionButtons, LoadingItemPlaceholder } from "@/components/Elements";

class Payu extends Component {
  static entityName = "Payu";

  componentWillReceiveProps(nextProps) {}

  onUserNameChange = (e) => {
    const { value } = e.target;
    // this.props.onUpdateValue('username', value);
  };

  onFileChange = (e) => {
    // setFile(e.target.files[0]);
  };

  onBack = () => {
    this.props.router.push("/users");
  };

  onSave = () => {
    const { item, mode } = this.props;
  };

  render() {
    const { mode } = this.props;
    if (mode === "loading") {
      return <LoadingItemPlaceholder />;
    }

    return <PayuComp />;
  }
}

const mapStateToProps = (state, props) => ({});

export default withRouter(connect(mapStateToProps)(Payu));
