import React from 'react';

const Price = ({ onChange, id, value, editable, disabled }) => {
  const input = editable
    ? <input type="number" step="any" id={id} className="form-control" min="0" value={value} onChange={onChange} disabled={disabled}/>
    : <span>{parseFloat(value, 10)}</span>;
  return (
    <div className="non-editable-field">{ input }</div>
  );
}

export default Price;
