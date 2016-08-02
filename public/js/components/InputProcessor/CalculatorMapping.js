import React, { Component } from 'react';
import { connect } from 'react-redux';

export default class CalculatorMapping extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { settings,
            onSetCustomerMapping,
            onSetRating } = this.props;
    const available_fields = [(<option disabled value="-1" key={-1}>Select Field</option>),
                              ...settings.get('fields').map((field, key) => (
                                <option value={field} key={key}>{field}</option>
                              ))];
    const available_target_fields = [(<option disabled value="-1" key={-1}>Select Field</option>),
                                     ...["imsi", "sid", "aid"].map((field, key) => (
                                       <option value={field} key={key}>{field}</option>
                                     ))];
    const available_usagetypes = settings.getIn(['processor', 'usaget_mapping']).map(usaget => {
      return usaget.get('usaget');
    });

    return (
      <div className="CalculatorMapping">
        <div className="row">
          <div className="col-xs-3">
            <label>Customer identification</label>
          </div>
          <div className="col-xs-3">
            <select id="src_key"
                    className="form-control"
                    onChange={onSetCustomerMapping}
                    value={settings.getIn(['customer_identification_fields', 0, 'src_key'])}
                    defaultValue="-1">
              { available_fields }
            </select>
            <p className="help-block">Map customer identification field in record to Billrun field</p>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-3">
          </div>
          <div className="col-xs-3">
            <select id="target_key"
                    className="form-control"
                    onChange={onSetCustomerMapping}
                    value={settings.getIn(['customer_identification_fields', 0, 'target_key'])}
                    defaultValue="-1">
              { available_target_fields }
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-3">
            <h4>Rate by</h4>
          </div>
        </div>
        {
          available_usagetypes.map((usaget, key) => (
            <div key={key}>
              <div className="row">
                <div className="col-xs-3">
                  <label>{usaget}</label>
                </div>
                {/* <div className="col-xs-2">
                <select id="line_key"
                className="form-control"
                data-usaget={usaget}
                onChange={onSetRating}
                value={settings.getIn(['rate_calculators', usaget, 'line_key'])}
                defaultValue="-1">
                { available_fields }
                </select>
                </div> */}
                <div className="col-xs-1">
                  <input type="radio"
                         name={`${usaget}-type`}
                         value="match"
                         data-usaget={usaget}
                         data-rate_key="key"
                         onChange={onSetRating} />By rate key
                </div>
                <div className="col-xs-1">
                  <input type="radio"
                         name={`${usaget}-type`}
                         value="longestPrefix"
                         data-usaget={usaget}
                         data-rate_key="params.prefix"
                         onChange={onSetRating} />By longest prefix
                </div>
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}
