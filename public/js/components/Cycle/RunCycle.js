import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Col, Row, Panel, Form, FormGroup, ControlLabel, Label, Button, HelpBlock } from 'react-bootstrap';
import { Map, List } from 'immutable';
import Select from 'react-select';
import { getCyclesQuery, getCycleQuery, getChargeStatusQuery, getOperationsQuery } from '../../common/ApiQueries';
import { getList, clearList } from '../../actions/listActions';
import { runBillingCycle, chargeAllCycle } from '../../actions/cycleActions';
import ConfirmModal from '../../components/ConfirmModal';
import CycleData from './CycleData';

class RunCycle extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    cycles: PropTypes.instanceOf(List),
    cycleAdditionalData: PropTypes.instanceOf(Map),
    chargeStatus: PropTypes.instanceOf(Map),
    chargeStatusRefreshed: PropTypes.oneOfType([
      PropTypes.instanceOf(Map),
      PropTypes.instanceOf(List),
    ]),
  };

  static defaultProps = {
    cycles: List(),
    cycleAdditionalData: Map(),
    chargeStatus: Map(),
    chargeStatusRefreshed: Map(),
  };

  constructor(props) {
    super(props);
    this.autoRefresh = null;
    this.autoRefreshChargingStatus = null;
  }

  state = {
    selectedCycle: Map(),
    selectedCycleName: '',
    showRerunConfirm: false,
    showChargeAllConfirm: false,
    autoRefreshRunning: false,
    autoRefreshStep: 0,
    autoRefreshIterations: 0,
    showRefreshButton: false,
    ChargedAllClicked: false,
  }

  componentDidMount() {
    this.props.dispatch(getList('cycles_list', getCyclesQuery()));
    this.props.dispatch(getList('charge_status', getChargeStatusQuery()));
  }

  componentWillReceiveProps() {
    const { cycleAdditionalData } = this.props;
    const { autoRefreshRunning, showRefreshButton } = this.state;
    if (!showRefreshButton && !autoRefreshRunning && cycleAdditionalData.get('cycle_status', '') === 'running') {
      this.initAutoRefresh();
    }
  }

  componentWillUnmount() {
    this.unsetAutoRefresh();
    clearTimeout(this.autoRefreshChargingStatus);
  }

  initAutoRefresh = () => {
    this.unsetAutoRefresh();
    this.setState({
      autoRefreshRunning: true,
      autoRefreshIterations: 0,
      autoRefreshStep: 0,
    });
    this.autoRefresh = setTimeout(this.runAutoRefresh, this.refreshSteps[0].timeout);
  }

  initAutoRefreshChargingStatus = () => {
    this.setState({ ChargedAllClicked: true });
    clearTimeout(this.autoRefreshChargingStatus);
    this.autoRefreshChargingStatus = setTimeout(() =>
      this.runAutoRefreshChargingStatus(true), 10000);
  }

  runAutoRefreshChargingStatus = (firstTime = false) => {
    const { chargeStatusRefreshed } = this.props;
    clearTimeout(this.autoRefreshChargingStatus);
    if (!firstTime && chargeStatusRefreshed.get('start_date', null) === null) {
      this.setState({ ChargedAllClicked: false });
      return;
    }
    this.props.dispatch(getList('charge_status_refresh', getOperationsQuery()));
    this.autoRefreshChargingStatus = setTimeout(this.runAutoRefreshChargingStatus, 10000);
  }

  refreshSteps = [
    { timeout: 10000, iterations: 6 },
    { timeout: 60000, iterations: 60 },
  ];

  unsetAutoRefresh = () => {
    clearTimeout(this.autoRefresh);
  }

  runAutoRefresh = () => {
    const { cycleAdditionalData } = this.props;
    if (cycleAdditionalData.get('cycle_status', '') !== 'running') {
      this.unsetAutoRefresh();
      this.setState({ autoRefreshRunning: false });
      return;
    }
    this.reloadCycleData();
    const { autoRefreshIterations, autoRefreshStep } = this.state;
    const refreshStep = this.refreshSteps[autoRefreshStep];
    this.unsetAutoRefresh();
    if (autoRefreshIterations < refreshStep.iterations - 1) {
      this.setState({ autoRefreshIterations: autoRefreshIterations + 1 });
      this.autoRefresh = setTimeout(this.runAutoRefresh, refreshStep.timeout);
    } else {
      const newAutoRefreshStep = autoRefreshStep + 1;
      if (newAutoRefreshStep >= this.refreshSteps.length) {
        this.setState({ showRefreshButton: true, autoRefreshRunning: false });
        return;
      }
      const newRefreshStep = this.refreshSteps[newAutoRefreshStep];
      this.autoRefresh = setTimeout(this.runAutoRefresh, newRefreshStep.timeout);
      this.setState({
        autoRefreshStep: newAutoRefreshStep,
        autoRefreshIterations: 0,
      });
    }
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

  onClickChargeAll = () => {
    this.setState({ showChargeAllConfirm: true });
  }

  chargeAll = () => {
    this.initAutoRefreshChargingStatus();
    this.props.dispatch(chargeAllCycle());
  }

  onClickRefresh = () => {
    this.reloadCycleData();
  }

  renderRefreshButton = () => (
    this.state.showRefreshButton && this.getSelectedCycleStatus() === 'running' &&
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
    return (<Label bsStyle={this.getStatusStyle(cycleStatus)} className={'non-editable-field'}>{cycleStatus.toUpperCase()}</Label>);
  }

  renderStartDate = () => {
    const { cycleAdditionalData } = this.props;
    const { selectedCycle } = this.state;
    return (
      <div className={'non-editable-field'}>
        {cycleAdditionalData.get('start_date', selectedCycle.get('start_date', '-'))}
      </div>
    );
  }

  renderEndDate = () => {
    const { cycleAdditionalData } = this.props;
    const { selectedCycle } = this.state;
    return (
      <div className={'non-editable-field'}>
        {cycleAdditionalData.get('end_date', selectedCycle.get('end_date', '-'))}
      </div>
    );
  }

  renderCycleCompletionPercentage = () => {
    const { cycleAdditionalData } = this.props;
    const completionPercentage = cycleAdditionalData.get('completion_percentage', false);
    return (
      <div className={'non-editable-field'}>
        {completionPercentage ? `${completionPercentage}%` : '-'}
      </div>
    );
  }

  renderCycleConfirmationPercentage = () => {
    const { cycleAdditionalData } = this.props;
    const confirmationPercentage = cycleAdditionalData.get('confirmation_percentage', false);
    return (
      <div className={'non-editable-field'}>
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

  isChargingStatusProcessing = () => {
    const { chargeStatusRefreshed } = this.props;
    const { ChargedAllClicked } = this.state;
    const processing = chargeStatusRefreshed.get('start_date', null) !== null;
    return ChargedAllClicked && processing;
  }

  renderChargeAllButton = () => {
    const { chargeStatus } = this.props;
    let disabled = false;
    let title = 'Charge All';
    if (this.isChargingStatusProcessing()) {
      disabled = true;
      title = 'Processing...';
    } else if (!chargeStatus.get('status', false)) {
      disabled = true;
      title = chargeStatus.get('amount_owed', 0) === 0 ? 'Nothing to charge' : 'Cycle running...';
    }

    return (<Button disabled={disabled} onClick={this.onClickChargeAll}>{title}</Button>);
  }

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

  onChargeAllCancel = () => {
    this.setState({ showChargeAllConfirm: false });
  }

  onChargeAllOk = () => {
    this.setState({ showChargeAllConfirm: false });
    this.chargeAll();
  }

  renderChargeAllConfirmationModal = () => {
    const { showChargeAllConfirm } = this.state;
    const confirmMessage = 'Are you sure you want to run a "Charge All" request?';
    const warningMessage = 'The action will charge all customers';
    return (
      <ConfirmModal onOk={this.onChargeAllOk} onCancel={this.onChargeAllCancel} show={showChargeAllConfirm} message={confirmMessage} labelOk="Yes">
        <FormGroup validationState="error">
          <HelpBlock>{warningMessage}</HelpBlock>
        </FormGroup>
      </ConfirmModal>
    );
  }

  render() {
    const { selectedCycle } = this.state;
    const billrunKey = selectedCycle.get('billrun_key', '');
    const shouldDisplayBillrunData = List(['running', 'finished', 'confirmed']).contains(this.getSelectedCycleStatus());
    const showConfirmAllButton = this.getSelectedCycleStatus() === 'finished';
    const baseFilter = {
      billrun_key: billrunKey,
    };

    return (
      <div>
        <Row>
          <Col lg={12}>
            <div className="pull-right" style={{ paddingBottom: 10 }}>
              {this.renderChargeAllButton()}
            </div>
          </Col>
        </Row>
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
                  </Col>
                </FormGroup>
              </Form>

              {
                shouldDisplayBillrunData &&
                <CycleData
                  billrunKey={billrunKey}
                  selectedCycle={selectedCycle}
                  baseFilter={baseFilter}
                  reloadCycleData={this.reloadCycleData}
                  showConfirmAllButton={showConfirmAllButton}
                />
              }

              {this.renderRerunConfirmationModal()}
              {this.renderChargeAllConfirmationModal()}
            </Panel>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cycles: state.list.get('cycles_list'),
  cycleAdditionalData: state.list.get('cycle_data', List()).get(0) || Map(),
  chargeStatus: state.list.get('charge_status', Map()),
  chargeStatusRefreshed: state.list.get('charge_status_refresh', List()).get(0) || Map({}),
});

export default connect(mapStateToProps)(RunCycle);