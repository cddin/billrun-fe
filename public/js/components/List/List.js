import React, { Component } from 'react';
import Immutable from 'immutable';
import moment from 'moment';

/* ACTIONS */
import { titlize } from '../../common/Util';

export default class List extends Component {
  constructor(props) {
    super(props);
  }

  displayByType(field, entity) {
    switch (field.type) {
      case 'date':
	return moment(entity.get(field.id)).format('L');
      case 'time':
	return moment(entity.get(field.id)).format('LT');
      case 'datetime':
	return moment(entity.get(field.id)).format('L LT');
      case 'text':
      default:
	return entity.get(field.id);
    }
  }
  
  printEntityField(entity = Immutable.Map(), field) {
    if (!Immutable.Iterable.isIterable(entity))
      return this.printEntityField(Immutable.fromJS(entity), field);
    if (field.parser)
      return field.parser(entity);
    if (field.type)
      return this.displayByType(field, entity);
    return entity.get(field.id);
  }
  
  buildRow(entity, fields) {
    return fields.map((field, key) => (
      <td key={key}>
        { this.printEntityField(entity, field) }
      </td>
    ));
  }

  render() {
    const {
      items,
      fields,
      onClickEdit = () => {},
      edit = false,
      editText = "edit"
    } = this.props;

    const table_header = fields.map((field, key) => {
      if (!field.title && !field.placeholder) return (<th key={key}>{ titlize(field.id) }</th>);
      return (<th key={key}>{ field.title || field.placeholder }</th>)
    });
    if (edit) table_header.push((<th>&nbsp;</th>));

    const table_body = items.size < 1 ?
                       (<tr><td colSpan={fields.length} style={{textAlign: "center"}}>No items found</td></tr>) :
                       items.map((entity, index) => (
                         <tr key={index}>
                           { this.buildRow(entity, fields) }
                           {(() => {
                              if (edit)
                                return (<td><button className="btn btn-link" onClick={onClickEdit.bind(this, entity)}>{ editText }</button></td>);
                            })()}
                         </tr>
                       ));

    return (
      <div className="List row">
        <div className="table-responsive col-lg-12">
          <table className="table table-hover table-striped">
            <thead>
              <tr>{ table_header }</tr>
            </thead>
            <tbody>
              { table_body }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
