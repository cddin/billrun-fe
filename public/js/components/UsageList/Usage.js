import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Form, FormGroup, ControlLabel, Col, Row, Panel, Button } from 'react-bootstrap';
import { getFieldName } from '../../common/Util';


const Usage = ({ line, onClickCancel, hiddenFields, cancelLabel }) => {
  const renderMainPanelTitle = () => (
    <div>{line.get('type', '')}
      <div className="pull-right">
        <Button bsSize="xsmall" onClick={onClickCancel}>{cancelLabel}</Button>
      </div>
    </div>
  );

  const renderFields = (data) => {
    const fields = [];
    data.forEach((value, key) => {
      if (!hiddenFields.includes(key)) {
        fields.push(
          <FormGroup key={key}>
            <Col componentClass={ControlLabel} sm={3} lg={2}>{ getFieldName(key, 'lines') }</Col>
            <Col sm={8} lg={9}>
              <input disabled className="form-control" value={(value === null) ? '' : value} />
            </Col>
          </FormGroup>
        );
      }
    });
    return fields;
  };

  return (
    <Row>
      <Col lg={12}>
        <Form horizontal>
          <Panel header={renderMainPanelTitle()}>
            <Panel header={<h3>BillRun fields</h3>}>
              { renderFields(line) }
            </Panel>
            <Panel header={<h3>User fields</h3>}>
              { renderFields(line.get('uf', Immutable.Map())) }
            </Panel>
            <Button onClick={onClickCancel}>{cancelLabel}</Button>
          </Panel>
        </Form>
      </Col>
    </Row>
  );
};

Usage.defaultProps = {
  line: Immutable.Map(),
  hiddenFields: ['_id', 'in_plan', 'over_plan', 'interconnect_aprice', 'out_plan', 'uf'],
  onClickCancel: () => {},
  cancelLabel: 'Back',
};

Usage.propTypes = {
  line: PropTypes.instanceOf(Immutable.Map),
  hiddenFields: PropTypes.arrayOf(PropTypes.string),
  onClickCancel: PropTypes.func,
  cancelLabel: PropTypes.string,
};

export default Usage;
