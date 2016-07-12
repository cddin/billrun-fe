import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { Table, TableHeader, TableRow, TableHeaderColumn, TableRowColumn, TableBody, TableFooter } from 'material-ui/Table';
import ReactPaginate from 'react-paginate';
import Filter from '../Filter';

import { getUsages } from '../../actions/usageActions';
import { showProgressBar, hideProgressBar } from '../../actions/progressbarActions.js';

class UsageList extends Component {
  constructor(props) {
    super(props);

    this.buildQuery = this.buildQuery.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.onFilter = this.onFilter.bind(this);
    
    this.state = {
      page: 1,
      size: 10,
      filter: ""
    };
  }

  componentDidMount() {
    this.props.dispatch(getUsages(this.buildQuery()));
  }

  buildQuery() {
    const { page, size, filter } = this.state;
    return { page, size, filter };
  }

  handlePageClick(data) {
    let page = data.selected + 1;
    this.setState({page}, () => {
      this.props.dispatch(getUsages(this.buildQuery()))
    });
  }

  onFilter(filter) {
    this.setState({filter}, () => {
      this.props.dispatch(getUsages(this.buildQuery()))
    });
  }
  
  render() {
    let { usages } = this.props;

    const fields = [
      {id: "aid", placeholder: "Account", type: "number"},
      {id: "plan", placeholder: "Plan"}
    ];
    
    return (
      <div className="UsagesList">
        <div className="row">
          <div className="col-md-5">
            <Filter fields={fields} onFilter={this.onFilter} />
          </div>
        </div>
        <Table fixedHeader={true}
               fixedFooter={true}
               selectable={false}
               style={{marginTop: 10}}
               height={'500px'}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn tooltip="Account">Account</TableHeaderColumn>
              <TableHeaderColumn tooltip="Subscription">Subscription</TableHeaderColumn>
              <TableHeaderColumn tooltip="Plan">Plan</TableHeaderColumn>
              <TableHeaderColumn tooltip="Charge">Charge</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} stripedRows={true}>
            {usages.valueSeq().map((row, index) => (
               <TableRow key={index}>
                 <TableRowColumn>{row.get('aid')}</TableRowColumn>
                 <TableRowColumn>{row.get('sid')}</TableRowColumn>
                 <TableRowColumn>{row.get('plan')}</TableRowColumn>
                 <TableRowColumn>{row.get('aprice')}</TableRowColumn>
               </TableRow>
             ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableRowColumn style={{textAlign: 'center'}}>
                <ReactPaginate previousLabel={"previous"}
                               nextLabel={"next"}
                               breakLabel={<a>...</a>}
                               pageNum={this.state.page + 5}
                               marginPagesDisplayed={2}
                               pageRangeDisplayed={5}
                               clickCallback={this.handlePageClick}
                               containerClassName={"pagination"}
                               subContainerClassName={"pages pagination"}
                               activeClassName={"active"} />
              </TableRowColumn>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return state;
}

export default connect(mapStateToProps)(UsageList);