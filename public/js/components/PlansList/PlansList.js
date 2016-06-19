import React, { Component } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import List from './List';

export default class PlansList extends Component {
  constructor(props) {
    super(props);

    this.onClickCell = this.onClickCell.bind(this);

    this.state = {
      dataList: [
        {
          "_id" : {"$id": "5720a6d09144dbb2de3ee716"},
	  "name" : "DATA_OFFER",
	  "technical_name" : "Data Only",
	  "key" : "DATA_OFFER",
	  "invoice_label" : "Forfait Data Only",
	  "invoice_type" : "mobile",
	  "from" : "2014-01-01T22:00:00Z",
	  "to" : "2113-12-31T22:00:00Z"
        },
        {
          "_id" : {"$id": "5720a6d09144dbb2de3ee716"},
	  "name" : "MOBILE_OFFER",
	  "technical_name" : "Mobile Only",
	  "key" : "MOBILE_OFFER",
	  "invoice_label" : "Forfait Mobile Only",
	  "invoice_type" : "mobile",
	  "from" : "2014-01-01T22:00:00Z",
	  "to" : "2113-12-31T22:00:00Z",
        },
        {
          "_id" : {"$id": "5720a6d09144dbb2de3ee716"},
	  "name" : "CALL_OFFER",
	  "technical_name" : "Call Only",
	  "key" : "CALL_OFFER",
	  "invoice_label" : "Forfait Call Only",
	  "invoice_type" : "mobile",
	  "from" : "2014-01-01T22:00:00Z",
	  "to" : "2113-12-31T22:00:00Z",
        },        
      ]
    };
  }

  onClickCell(cell_idx, col_idx, e) {
    let selected = this.state.dataList[cell_idx];
    this.context.router.push(`plan_setup/${selected._id.$id}`);
  }
  
  render() {
    let {dataList} = this.state;

    return (
      <Table onCellClick={this.onClickCell}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false} fixedHeader={true}>
          <TableRow>
            <TableHeaderColumn tooltip="Name">Name</TableHeaderColumn>
            <TableHeaderColumn tooltip="Technical Name">Technical Name</TableHeaderColumn>
            <TableHeaderColumn tooltip="Invoice Label">Invoice Label</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {dataList.map((row, index) => (
             <TableRow key={index}>
               <TableRowColumn>{row.name}</TableRowColumn>
               <TableRowColumn>{row.technical_name}</TableRowColumn>
               <TableRowColumn>{row.invoice_label}</TableRowColumn>
             </TableRow>
           ))}
        </TableBody>
      </Table>
    );
  }
}

PlansList.contextTypes = {
  router: React.PropTypes.object.isRequired
};