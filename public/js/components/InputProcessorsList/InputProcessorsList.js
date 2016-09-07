import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Table, PageHeader } from 'react-bootstrap';
import { DropdownButton, MenuItem } from "react-bootstrap";

//import { getInputProcessors, setInputProcessor } from '../../actions/inputProcessorActions';
import { getList } from '../../actions/listActions';

class InputProcessorsList extends Component {
  constructor(props) {
    super(props);

    this.onClickCell = this.onClickCell.bind(this);
    this.onClickNew = this.onClickNew.bind(this);
  }

  componentDidMount() {
    const params = {
      api: "settings",
      params: [
        { category: "file_types" },
        { data: JSON.stringify({}) }
      ]
    };
    this.props.dispatch(getList("input_processors", params));
  }
  
  onClickCell(cell_idx, e) {
    const file_type = this.props.inputProcessors.valueSeq().get(cell_idx).get('file_type');
    this.context.router.push({
      pathname: 'input_processor',
      query: {
        file_type,
        action: 'update'
      }
    });
  }
  
  onClickNew() {
    this.context.router.push({
      pathname: 'input_processor',
      query: {
        action: 'new'
      }
    });
  }

  render() {
    const { inputProcessors } = this.props;

    const table_headers = (
      <th>File Type</th>
    );

    const table_body = inputProcessors.size < 1 ?
          (<tr><td colSpan="1" style={{textAlign: "center"}}>No input processors</td></tr>) :
          inputProcessors.map((proc, key) => (
              <tr key={key}>
              <td onClick={this.onClickCell.bind(this, key)}>
              { proc.get('file_type') }
            </td>
              </tr>
          ));

    return (
      <div className="InputProcessorsList">

        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                <span>
                  All available input processors
                </span>
                <div className="pull-right">
                  <DropdownButton title="Actions" id="ActionsDropDown" bsSize="xs" pullRight>
                    <MenuItem eventKey="1" onClick={this.onClickNew}>New</MenuItem>
                  </DropdownButton>
                </div>
              </div>
              <div className="panel-body">
                <Table responsive hover striped>
                  <thead>
                    <tr>{ table_headers }</tr>
                  </thead>
                  <tbody>
                    { table_body }
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

InputProcessorsList.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
  return {
    inputProcessors: state.list.get('input_processors') || []
  };
}

export default connect(mapStateToProps)(InputProcessorsList);
