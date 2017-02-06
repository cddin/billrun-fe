import React from 'react';
import EntityList from '../EntityList';


const PrepaidIncludesList = () => {
  const fields = [
    { id: 'name' },
    { id: 'charging_by', showFilter: false },
    { id: 'charging_by_usaget', showFilter: false },
    { id: 'priority', showFilter: false },
  ];

  const projectFields = {
    charging_by_usaget: 1,
    charging_by: 1,
    priority: 1,
    name: 1,
  };

  return (
    <EntityList
      collection="prepaidincludes"
      itemType="prepaid_include"
      itemsType="prepaid_includes"
      filterFields={fields}
      tableFields={fields}
      projectFields={projectFields}
    />
  );
};


export default PrepaidIncludesList;
