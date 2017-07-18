import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Button, Col, FormGroup, InputGroup } from 'react-bootstrap';
import Select from 'react-select';
import { getSettings, updateSetting, saveSettings } from '../../actions/settingsActions';
import { usageTypesDataSelector, propertyTypeSelector } from '../../selectors/settingsSelector';
import UsageTypeForm from '../UsageTypes/UsageTypeForm';

class UsageTypesSelector extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    usageTypesData: PropTypes.instanceOf(Immutable.List),
    propertyTypes: PropTypes.instanceOf(Immutable.List),
    usaget: PropTypes.string,
    unit: PropTypes.string,
    onChangeUsaget: PropTypes.func,
    onChangeUnit: PropTypes.func,
    enabled: PropTypes.bool,
    showUnits: PropTypes.bool,
  };

  static defaultProps = {
    usageTypesData: Immutable.List(),
    propertyTypes: Immutable.List(),
    usaget: '',
    unit: '',
    onChangeUsaget: () => {},
    onChangeUnit: () => () => {},
    enabled: true,
    showUnits: true,
  };

  state = {
    currentItem: null,
  }

  componentWillMount() {
    this.props.dispatch(getSettings(['usage_types', 'property_types']));
  }

  onChangeUsaget = (usaget) => {
    this.props.onChangeUsaget(usaget);
    this.onChangeUnit(usaget)('');
  }

  onChangeUnit = usaget => (unit) => {
    this.props.onChangeUnit(unit, usaget);
  }

  onCancelNewUsageType = () => {
    this.setState({ currentItem: null });
  }

  onSaveNewUsageType = () => {
    const { usageTypesData } = this.props;
    const { currentItem } = this.state;
    this.setState({ currentItem: null });
    this.props.dispatch(updateSetting('usage_types', usageTypesData.size, currentItem));
    this.props.dispatch(saveSettings('usage_types'));
    this.props.onChangeUsaget(currentItem.get('usage_type', ''));
  }

  onClickNewUsageType = () => {
    this.setState({ currentItem: Immutable.Map() });
  }

  onUpdateUsageType = (fieldNames, fieldValues) => {
    const { currentItem } = this.state;
    const keys = Array.isArray(fieldNames) ? fieldNames : [fieldNames];
    const values = Array.isArray(fieldValues) ? fieldValues : [fieldValues];
    this.setState({
      currentItem: currentItem.withMutations((itemwithMutations) => {
        keys.forEach((key, index) => itemwithMutations.set(key, values[index]));
      }),
    });
  }

  getAvailableUsageTypes = () => {
    const { usageTypesData } = this.props;
    return usageTypesData.map(usaget => ({
      value: usaget.get('usage_type', ''),
      label: usaget.get('label', ''),
    })).toJS();
  }

  getAvailableUnits = () => {
    const { propertyTypes, usageTypesData, usaget } = this.props;
    const selectedUsaget = usageTypesData.find(usageType => usageType.get('usage_type', '') === usaget) || Immutable.Map();
    const uom = (propertyTypes.find(prop => prop.get('type', '') === selectedUsaget.get('property_type', '')) || Immutable.Map()).get('uom', Immutable.List());
    return uom
      .filter(unit => unit.get('unit', false) !== false)
      .map(unit => ({ value: unit.get('name', ''), label: unit.get('label', '') })).toArray();
  }

  renderUsageTypeSelect = () => {
    const { enabled, usaget } = this.props;
    return (
      <Select
        options={this.getAvailableUsageTypes()}
        value={usaget}
        style={{ marginTop: 3 }}
        disabled={!enabled}
        onChange={this.onChangeUsaget}
      />);
  }

  renderAddUsageTypeButton = () => (
    <Button className="btn-primary" onClick={this.onClickNewUsageType} disabled={!this.props.enabled}>
      <i className="fa fa-plus" />&nbsp;
    </Button>
  );

  renderUnitSelect = () => {
    const { enabled, unit, usaget } = this.props;
    return (
      <Select
        onChange={this.onChangeUnit(usaget)}
        value={unit}
        options={this.getAvailableUnits()}
        disabled={!enabled || !usaget}
      />);
  }

  renderNewUsageTypeForm = () => {
    const { propertyTypes } = this.props;
    const { currentItem } = this.state;
    return currentItem &&
      (<UsageTypeForm
        item={currentItem}
        propertyTypes={propertyTypes}
        onUpdateItem={this.onUpdateUsageType}
        onSave={this.onSaveNewUsageType}
        onCancel={this.onCancelNewUsageType}
      />);
  };

  render() {
    const { showUnits } = this.props;
    return (
      <span>
        <Col md={7}>
          <FormGroup>
            <InputGroup>
              <InputGroup.Button>
                {this.renderAddUsageTypeButton()}
              </InputGroup.Button>
              {this.renderUsageTypeSelect()}
            </InputGroup>
          </FormGroup>
        </Col>
        <Col md={5}>
          {showUnits && this.renderUnitSelect()}
        </Col>
        {this.renderNewUsageTypeForm()}
      </span>
    );
  }
}

const mapStateToProps = (state, props) => ({
  usageTypesData: usageTypesDataSelector(state, props),
  propertyTypes: propertyTypeSelector(state, props),
});

export default connect(mapStateToProps)(UsageTypesSelector);
