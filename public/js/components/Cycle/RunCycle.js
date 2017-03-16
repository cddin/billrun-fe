import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Col, Row, Panel, Form, FormGroup, ControlLabel, Label, Button, HelpBlock } from 'react-bootstrap';
import { Map, List } from 'immutable';
import Select from 'react-select';
import { getCyclesQuery, getCycleQuery } from '../../common/ApiQueries';
import { getList, clearList } from '../../actions/listActions';
import { runBillingCycle, confirmCycleInvoice, confirmCycle } from '../../actions/cycleActions';
import ConfirmModal from '../../components/ConfirmModal';
import EntityList from '../EntityList';
import { getConfig } from '../../common/Util';

class RunCycle extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    cycles: PropTypes.instanceOf(List),
    cycleAdditionalData: PropTypes.instanceOf(Map),
  };

  static defaultProps = {
    cycles: List(),
    cycleAdditionalData: Map(),
  };

  state = {
    selectedCycle: Map(),
    selectedCycleName: '',
    showRerunConfirm: false,
  }

  componentDidMount() {
    this.props.dispatch(getList('cycles_list', getCyclesQuery()));
  }

  getSelectedCycleStatus = () => {
    const { cycleAdditionalData } = this.props;
    const { selectedCycle } = this.state;
    return cycleAdditionalData.get('cycle_status', selectedCycle.get('cycle_status', ''));
  }

  runCycle = (rerun = false) => {
    const { selectedCycle } = this.state;
    this.props.dispatch(runBillingCycle(selectedCycle.get('billrun_key', ''), rerun))
    .then(
      (response) => {
        if (response.status) {
          this.reloadCycleData();
        }
      }
    );
  }

  onClickRun = () => {
    this.runCycle();
  }

  onClickRerun = () => {
    this.setState({ showRerunConfirm: true });
  }

  onClickRefresh = () => {
    this.reloadCycleData();
  }

  renderRefreshButton = () => (
    this.getSelectedCycleStatus() === 'running' &&
    (<div className="pull-right">
      <Button bsSize="xsmall" className="btn-primary" onClick={this.onClickRefresh}>
        <i className="fa fa-refresh" />&nbsp;Refresh
      </Button>
    </div>)
  )

  renderPanelHeader = () => (
    <div>
      Run a billing cycle
      {this.renderRefreshButton()}
    </div>
  );


  getDateToDisplay = str => str.substr(0, str.indexOf(' '));

  getCycleName = cycle => `cycle of ${this.getDateToDisplay(cycle.get('start_date', ''))}-${this.getDateToDisplay(cycle.get('end_date', ''))}`;

  getCyclesSelectOptions = () => {
    const { cycles } = this.props;
    const cycleStatusesToDisplay = List(['running', 'to_run', 'finished', 'confirmed']);
    return cycles
      .filter(cycle => cycleStatusesToDisplay.contains(cycle.get('cycle_status', '')))
      .map(cycle => ({
        value: cycle.get('billrun_key', ''),
        label: this.getCycleName(cycle),
      })).toArray();
  }

  clearCycleData = () => {
    this.props.dispatch(clearList('cycle_data'));
  }

  reloadCycleData = (selectedCycle = this.state.selectedCycle) => {
    this.clearCycleData();
    const selectedBillrunKey = selectedCycle.get('billrun_key', '');
    if (selectedBillrunKey === '') {
      return;
    }
    this.props.dispatch(getList('cycle_data', getCycleQuery(selectedBillrunKey)));
  }

  getCycleData = (cycleName) => {
    const { cycles } = this.props;
    const selectedCycle = cycles.find(cycle => (cycle.get('billrun_key', '') === cycleName)) || Map();
    this.reloadCycleData(selectedCycle);
    return selectedCycle;
  }

  onChangeSelectedCycle = (selectedCycleName) => {
    this.setState({
      selectedCycle: this.getCycleData(selectedCycleName),
      selectedCycleName,
    });
  }

  renderCyclesSelect = () => {
    const { selectedCycleName } = this.state;
    return (
      <Select
        id="cycle"
        value={selectedCycleName}
        onChange={this.onChangeSelectedCycle}
        options={this.getCyclesSelectOptions()}
      />
    );
  };

  getStatusStyle = (status) => {
    switch (status) {
      case 'to_run':
        return 'info';
      case 'running':
      case 'current':
        return 'primary';
      case 'future':
        return 'warning';
      case 'finished':
      case 'confirmed':
        return 'success';
      default:
        return 'default';
    }
  }

  renderCycleStatus = () => {
    const cycleStatus = this.getSelectedCycleStatus();
    return (<Label bsStyle={this.getStatusStyle(cycleStatus)} className={'non-editble-field'}>{cycleStatus.toUpperCase()}</Label>);
  }

  renderStartDate = () => {
    const { cycleAdditionalData } = this.props;
    const { selectedCycle } = this.state;
    return (
      <div className={'non-editble-field'}>
        {cycleAdditionalData.get('start_date', selectedCycle.get('start_date', '-'))}
      </div>
    );
  }

  renderEndDate = () => {
    const { cycleAdditionalData } = this.props;
    const { selectedCycle } = this.state;
    return (
      <div className={'non-editble-field'}>
        {cycleAdditionalData.get('end_date', selectedCycle.get('end_date', '-'))}
      </div>
    );
  }

  renderCycleCompletionPercentage = () => {
    const { cycleAdditionalData } = this.props;
    const completionPercentage = cycleAdditionalData.get('completion_percentage', false);
    return (
      <div className={'non-editble-field'}>
        {completionPercentage ? `${completionPercentage}%` : '-'}
      </div>
    );
  }

  renderCycleConfirmationPercentage = () => {
    const { cycleAdditionalData } = this.props;
    const confirmationPercentage = cycleAdditionalData.get('confirmation_percentage', false);
    return (
      <div className={'non-editble-field'}>
        {confirmationPercentage ? `${confirmationPercentage}%` : '-'}
      </div>
    );
  }

  fields = List([
    { label: 'Select cycle', renderFunc: this.renderCyclesSelect },
    { label: 'Status', renderFunc: this.renderCycleStatus },
    { label: 'Start date', renderFunc: this.renderStartDate },
    { label: 'End date', renderFunc: this.renderEndDate },
    { label: 'Completion percentage', renderFunc: this.renderCycleCompletionPercentage },
    { label: 'Confirmation percentage', renderFunc: this.renderCycleConfirmationPercentage },
  ]);

  renderFields = () => (
    this.fields.map(
      (field, key) =>
        (<FormGroup key={key}>
          <Col sm={3} lg={2} componentClass={ControlLabel}>{field.label}</Col>
          <Col sm={6} lg={6}>
            {field.renderFunc()}
          </Col>
        </FormGroup>)
    )
  );

  renderRunButton = () => (
    this.getSelectedCycleStatus() === 'to_run' &&
      (<Button onClick={this.onClickRun}>Run!</Button>)
  )

  renderRerunButton = () => (
    this.getSelectedCycleStatus() === 'finished' &&
      (<Button onClick={this.onClickRerun}>Re-run</Button>)
  )

  renderConfirmAllButton = () => (
    this.getSelectedCycleStatus() === 'finished' &&
      (<Button onClick={this.onClickConfirmAllClick}>Confirm All</Button>)
  )

  onRerunCancel = () => {
    this.setState({ showRerunConfirm: false });
  }

  onRerunOk = () => {
    this.runCycle(true);
    this.setState({ showRerunConfirm: false });
  }

  renderRerunConfirmationModal = () => {
    const { showRerunConfirm, selectedCycle } = this.state;
    const confirmMessage = `Are you sure you want to re-run ${this.getCycleName(selectedCycle)}?`;
    const warningMessage = 'Cycle data will be reset';
    return (
      <ConfirmModal onOk={this.onRerunOk} onCancel={this.onRerunCancel} show={showRerunConfirm} message={confirmMessage} labelOk="Yes">
        <FormGroup validationState="error">
          <HelpBlock>{warningMessage}</HelpBlock>
        </FormGroup>
      </ConfirmModal>
    );
  }

  parseCycleDataFirstName = entity => entity.getIn(['attributes', 'firstname'], '');
  parseCycleDataLastName = entity => entity.getIn(['attributes', 'lastname'], '');
  parseCycleDataInvoiceTotal = entity => entity.getIn(['totals', 'after_vat_rounded'], '');
  parseCycleDataSubscriptionNum = entity => entity.get('subs', List()).size;

  downloadURL = (aid, billrunKey, invoiceId) =>
    `${getConfig('serverUrl')}/api/accountinvoices?action=download&aid=${aid}&billrun_key=${billrunKey}&iid=${invoiceId}`;

  parseCycleDataDownload = (entity) => {
    const downloadUrl = this.downloadURL(entity.get('aid'), entity.get('billrun_key'), entity.get('invoice_id'));
    return (
      <form method="post" action={downloadUrl} target="_blank">
        <button className="btn btn-link" type="submit">
          <i className="fa fa-download" /> Download
        </button>
      </form>
    );
  };

  onInvoiceConfirmClick = (entity) => {
    const { selectedCycle } = this.state;
    this.props.dispatch(confirmCycleInvoice(selectedCycle.get('billrun_key', ''), entity.get('invoice_id', '')))
      .then(
        (response) => {
          if (response.status) {
            this.reloadCycleData();
          }
        }
      );
  }

  onClickConfirmAllClick = () => {
    const { selectedCycle } = this.state;
    this.props.dispatch(confirmCycle(selectedCycle.get('billrun_key', '')))
      .then(
        (response) => {
          if (response.status) {
            this.reloadCycleData();
          }
        }
      );
  }

  parseCycleDataConfirm = entity => (
    entity.get('billed', false)
      ? (<Label bsStyle={'success'} className={'non-editble-field'}>CONFIRMED</Label>)
      : (<Button onClick={this.onInvoiceConfirmClick.bind(this, entity)}>confirm</Button>)
  );

  render() {
    const { selectedCycle } = this.state;
    const shouldDisplayBillrunData = List(['running', 'finished', 'confirmed']).contains(this.getSelectedCycleStatus());
    const baseFilter = {
      billrun_key: selectedCycle.get('billrun_key', ''),
    };

    const filterFields = [
      { id: 'aid', placeholder: 'Customer Number', type: 'number' },
      { id: 'attributes.firstname', placeholder: 'Customer First Name' },
      { id: 'attributes.lastname', placeholder: 'Customer Last Name' },
    ];

    const tableFields = [
      { id: 'aid', title: 'Customer Number', sort: true },
      { id: 'attributes.firstname', title: 'Customer First Name', sort: true, parser: this.parseCycleDataFirstName },
      { id: 'attributes.lastname', title: 'Customer Last Name', sort: true, parser: this.parseCycleDataLastName },
      { id: 'totals.after_vat_rounded', title: 'Invoice Total', parser: this.parseCycleDataInvoiceTotal },
      { id: 'subss', title: '# of Subscriptions', parser: this.parseCycleDataSubscriptionNum },
      { id: 'download', title: 'Invoice', parser: this.parseCycleDataDownload },
      { id: 'confirm', title: 'Confirm', parser: this.parseCycleDataConfirm },
    ];

    return (
      <Row>
        <Col lg={12}>
          <Panel header={this.renderPanelHeader()}>
            <Form horizontal>
              {this.renderFields()}

              <FormGroup>
                <Col sm={3} lg={2} componentClass={ControlLabel} />
                <Col sm={6} lg={6}>
                  {this.renderRunButton()}
                  {this.renderRerunButton()}
                  {this.renderConfirmAllButton()}
                </Col>
              </FormGroup>
            </Form>

            {
              shouldDisplayBillrunData &&
              <EntityList
                collection="billrun"
                api="get"
                itemType="billrun"
                itemsType="billruns"
                filterFields={filterFields}
                baseFilter={baseFilter}
                tableFields={tableFields}
                showAddButton={false}
                editable={false}
              />
            }

            {this.renderRerunConfirmationModal()}
          </Panel>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  cycles: state.list.get('cycles_list'),
  cycleAdditionalData: state.list.get('cycle_data', List()).get(0) || Map(),
});

export default connect(mapStateToProps)(RunCycle);
