import React from 'react';
import Immutable from 'immutable';
import EntityList from '../EntityList';


const ProductsList = () => {
  const parserUsegt = (item) => {
    const usegt = item.get('rates', Immutable.Map()).keySeq().first();
    return (typeof usegt !== 'undefined') ? usegt : '';
  };

  const filterFields = [
    { id: 'key', placeholder: 'Key' },
  ];

  const tableFields = [
    { id: 'description', title: 'Title', sort: true },
    { id: 'key', title: 'Key', sort: true },
    { id: 'unit_type', title: 'Unit Type', parser: parserUsegt },
    { id: 'code', title: 'External Code', sort: true },
    { id: 'from', title: 'Modified', type: 'mongodatetime', cssClass: 'long-date', sort: true },
  ];

  const projectFields = {
    description: 1,
    unit_type: 1,
    rates: 1,
    from: 1,
    code: 1,
    key: 1,
  };

  return (
    <EntityList
      collection="rates"
      itemType="product"
      itemsType="products"
      filterFields={filterFields}
      tableFields={tableFields}
      projectFields={projectFields}
    />
  );
};

export default ProductsList;
