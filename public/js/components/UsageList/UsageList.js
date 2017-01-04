import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router';

/* COMPONENTS */
import Pager from '../Pager';
import Filter from '../Filter';
import List from '../List';
import Usage from './Usage';

/* ACTIONS */
import { getList } from '../../actions/listActions';

class UsageList extends Component {
  constructor(props) {
    super(props);

    this.buildQuery = this.buildQuery.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onSort = this.onSort.bind(this);
    this.onClickLine = this.onClickLine.bind(this);
    this.onCancelView = this.onCancelView.bind(this);

    this.state = {
      line: null,
      viewing: false,
      page: 0,
      size: 10,
      sort: '',
      filter: ""
    };
  }

  buildQuery() {
    const { page, size, sort, filter } = this.state;
    return {
      api: "find",
      params: [
        { collection: "lines" },
        { size },
        { page },
	{ sort },
        { query: filter }
      ]
    };
  }

  onFilter(filter) {
    this.setState({filter, page: 0}, () => {
      this.props.dispatch(getList('usages', this.buildQuery()))
    });
  }

  handlePageClick(page) {
    this.setState({page}, () => {
      this.props.dispatch(getList('usages', this.buildQuery()))
    });
  }

  onSort(sort) {
    this.setState({sort}, () => {
      this.props.dispatch(getList('usages', this.buildQuery()));
    });
  }

  onClickLine(line) {
    this.setState({line, viewing: true});
  }

  onCancelView() {
    this.setState({line: null, viewing: false});
  }

  render() {
    const { line, viewing } = this.state;
    const { usages } = this.props;

    const fields = [
      {id: "type", placeholder: "Type"},
      {id: "aid", placeholder: "Customer ID", type: "number", sort: true},
      {id: "sid", placeholder: "Subscription ID", type: "number", sort: true},
      {id: "plan", placeholder: "Plan"},
      {id: "urt", placeholder: "Time", type: "datetime", cssClass: 'long-date', showFilter: false}
    ];

    const base = this.props.location.query.base ? JSON.parse(this.props.location.query.base) : {};

    const current_view = viewing ? (<Usage line={line} onClickCancel={this.onCancelView} />) : (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                <span>
                  List of all usages
                </span>
                <div className="pull-right">
                  <Link to={'/queue'} className="btn btn-default btn-xs">Go to Queue</Link>
                </div>
              </div>
              <div className="panel-body">
                <Filter fields={fields} onFilter={this.onFilter} base={base} />
                <List items={usages} fields={fields} edit={true} onClickEdit={this.onClickLine} editText="view" onSort={this.onSort} />
              </div>
            </div>
          </div>
        </div>

        <Pager onClick={this.handlePageClick}
               size={this.state.size}
               count={usages.size || 0} />
      </div>
    );

    return (
      <div>
	{ current_view }
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return { usages: state.list.get('usages') || [] };
}

export default connect(mapStateToProps)(UsageList);
