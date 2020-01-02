import React from 'react';
import EntityList from '../../EntityList';
import {
  getConfig,
} from '@/common/Util';


const TaxList = () => {
  const filterFields = [
    { id: 'description', placeholder: 'Title' },
    { id: 'key', placeholder: 'Key' },
  ];

  const tableFields = [
    { id: 'description', title: 'Title', sort: true },
    { id: 'key', title: 'Key', sort: true },

  ];

  const projectFields = {
    key: 1,
    description: 1,
  };

  const actions = [
    { type: 'edit' },
  ];

  return (
    <EntityList
      itemsType={getConfig(['systemItems', 'tax', 'itemsType'], '')}
      itemType={getConfig(['systemItems', 'tax', 'itemType'], '')}
      filterFields={filterFields}
      tableFields={tableFields}
      projectFields={projectFields}
      showRevisionBy="key"
      actions={actions}
    />
  );
}

export default TaxList;
