import React, { Component } from 'react';

export default class Price extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { onChange, id, value, editable, disabled } = this.props;

    const input = editable ? (<div className="input-group">
        <div className="input-group-addon">{globalSetting.currency}</div>
        <input type="number" id={id} className="form-control" min="0" value={value} onChange={onChange} disabled={disabled}/>
      </div>) : (<span>{`${globalSetting.currency}${parseFloat(value, 10)}`}</span>);

    return (
      <div>{ input }</div>
    );
  }
}
