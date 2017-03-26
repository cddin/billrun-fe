import React from 'react';
import EntityList from '../EntityList';

const ChargingPlansList = () => {
  const filterFields = [
    { id: 'description', placeholder: 'Title' },
    { id: 'name', placeholder: 'Key' },
  ];

  const tableFields = [
    { id: 'description', title: 'Title', sort: true },
    { id: 'name', title: 'Key', sort: true },
    { id: 'code', title: 'External Code', sort: true },
    { id: 'operation', title: 'Operation', sort: true },
    { id: 'charging_value', title: 'Charging value', sort: true },
  ];

  const projectFields = {
    charging_value: 1,
    description: 1,
    operation: 1,
    name: 1,
    code: 1,
  };

  return (
    <EntityList
      collection="prepaidgroups"
      itemType="charging_plan"
      itemsType="charging_plans"
      filterFields={filterFields}
      tableFields={tableFields}
      projectFields={projectFields}
      showRevisionBy="name"
    />
  );
};

export default ChargingPlansList;
