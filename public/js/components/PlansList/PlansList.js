import React from 'react';
import Immutable from 'immutable';
import changeCase from 'change-case';
import EntityList from '../EntityList';


const PlansList = (props) => {
  const parserTrial = (item) => {
    if (item.getIn(['price', 0, 'trial'])) {
      return `${item.getIn(['price', 0, 'to'])} ${item.getIn(['recurrence', 'periodicity'])}`;
    }
    return '';
  };

  const parserRecuringCharges = (item) => {
    const sub = item.getIn(['price', 0, 'trial']) ? 1 : 0;
    const cycles = item.get('price', Immutable.List()).size - sub;
    return `${cycles} cycles`;
  };

  const parserBillingFrequency = (item) => {
    const periodicity = item.getIn(['recurrence', 'periodicity'], '');
    return (!periodicity) ? '' : `${changeCase.upperCaseFirst(periodicity)}ly`;
  };

  const parserChargingMode = item => (item.get('upfront') ? 'Upfront' : 'Arrears');

  const filterFields = [
    { id: 'description', title: 'Title', sort: true },
    { id: 'name', title: 'Key', sort: true },
    { id: 'code', title: 'External Code', sort: true },
    { title: 'Trial', parser: parserTrial },
    { id: 'recurrence_charges', title: 'Recurring Charges', parser: parserRecuringCharges },
    { id: 'recurrence_frequency', title: 'Billing Frequency', parser: parserBillingFrequency },
    { id: 'charging_mode', title: 'Charging Mode', parser: parserChargingMode },
    { id: 'connection_type', display: false, showFilter: false },
  ];

  const tableFields = [
    { id: 'name', placeholder: 'Key' },
    { id: 'description', placeholder: 'Title' },
    { id: 'to', display: false, type: 'datetime', showFilter: false },
  ];

  const projectFields = {
    recurrence_frequency: 1,
    recurrence_charges: 1,
    connection_type: 1,
    charging_mode: 1,
    description: 1,
    recurrence: 1,
    upfront: 1,
    price: 1,
    name: 1,
    code: 1,
    to: 1,
  };

  return (
    <EntityList
      {...props}
      itemsType="plans"
      itemType="plan"
      filterFields={filterFields}
      tableFields={tableFields}
      projectFields={projectFields}
    />
  );
};

export default PlansList;
