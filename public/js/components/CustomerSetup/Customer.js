import React, {Component} from 'react';
import {Link} from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';
import { Form, FormGroup, Col, FormControl, ControlLabel} from 'react-bootstrap';
import Select from 'react-select';
import Field from '../Field';
import countries from './countries.data.json';

class Customer extends Component {
  constructor(props) {
    super(props);

    this.onCountryChange = this.onCountryChange.bind(this);
  }

  onCountryChange(val) {
    var pseudoE = {};
    pseudoE.target = {id: 'country', value: val};
    this.props.onChange(pseudoE);
  }

  onSelect = (value, field) => {
    const e = {target: {id: field[0].field, value}};
    this.props.onChange(e);
  };

  renderInCollection = () => {
    const { customer } = this.props;
    if (customer.get('in_collection', false) === true || customer.get('in_collection', 0) === 1) {
      const fromDate = moment(customer.get('in_collection_from', '')).format(globalSetting.dateFormat);
      return (<p className="danger-red">In collection from {fromDate}</p>);
    }
    return null;
  }
  
  render() {
    const {customer, onChange, settings, action, invalidFields} = this.props;

    //in update mode wait for item before render edit screen
    if(action === 'update' && typeof customer.getIn(['_id', '$id']) === 'undefined'){
      return ( <div> <p>Loading...</p> </div> );
    }

    let options = [];
    countries.forEach((country) => {
      options.push({value: country.name, label: country.name})
    });

    const fields = settings.filter(field => {
      return field.get('display') !== false &&
             field.get('editable') !== false;
    }).map((setting, key) => {
      let invalid = invalidFields
        .filter(invf => invf.get('name') === setting.get('field_name'))
        .size > 0;
      let validationState = invalid ? {validationState: "error"} : {};
      let field_name = setting.get('field_name');
      let value;
      if (action === 'new' && !setting.get('select_list', false)) {
        value = customer.get(field_name, setting.get('default_value', ''));
      } else {
        value = customer.get(field_name, '');
      }
      let options;
      if (setting.get('select_list', false)) {
        options =
          setting.get('default_value', '')
                 .split(',')
                 .map(val => {
                   return {
                     field: setting.get('field_name'),
                     value: val,
                     label: val
                   }
                 });
      }
      return (
        <FormGroup { ...validationState }
                   controlId={ field_name }
                   key={key}>
          <Col componentClass={ ControlLabel } md={2}>
            {setting.get('title') || field_name}
          </Col>
          <Col sm={7}>
            {
              setting.get('select_list', false)
              ? (<Select
                     onChange={ this.onSelect }
                     options={ options }
                     value={ value } />)
              : (<Field onChange={ onChange }
                        id={ field_name }
                        value={ value }
                 />)
            }
          </Col>
        </FormGroup>
      );
    });

    return (
      <div className="Customer">
        <Form horizontal>
          { fields }
        </Form>
        {(action !== "new") &&
          <div>
            <hr />
            { this.renderInCollection() }
            <p>See Customer <Link to={`/usage?base={"aid": ${customer.get('aid')}}`}>Usage</Link></p>
            <p>See Customer <Link to={`/invoices?base={"aid": ${customer.get('aid')}}`}>Invoices</Link></p>
          </div>
        }
      </div>
    );
  }
}

export default connect()(Customer);
