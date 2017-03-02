import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import moment from 'moment';
import { Form, FormGroup, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { RevisionTimeline, ModalWrapper } from '../Elements';
import RevisionList from '../RevisionList';
import { getItemDateValue, getConfig } from '../../common/Util';


class EntityRevisionDetails extends Component {

  static propTypes = {
    revisions: PropTypes.instanceOf(Immutable.List),
    item: PropTypes.instanceOf(Immutable.Map),
    mode: PropTypes.string,
    onChangeFrom: PropTypes.func,
    backToList: PropTypes.func,
    itemName: PropTypes.string.isRequired,
    revisionItemsInTimeLine: PropTypes.number,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    revisions: Immutable.List(),
    item: Immutable.Map(),
    mode: 'view',
    onChangeFrom: () => {},
    backToList: () => {},
    revisionItemsInTimeLine: 3,
  };

  state = {
    showList: false,
  }

  componentWillReceiveProps(nextProps) {
    const { item } = nextProps;
    const { item: oldItem } = this.props;
    if (item.getIn(['_id', '$id'], '') !== oldItem.getIn(['_id', '$id'], '')) {
      this.hideManageRevisions();
    }
  }

  showManageRevisions = () => {
    this.setState({ showList: true });
  }

  hideManageRevisions = () => {
    this.setState({ showList: false });
  }

  onDeleteItem = (removedItem) => {
    const { item, revisions, itemName } = this.props;
    // if screen was with deleted item, go to prev revision or list
    if (item.getIn(['_id', '$id'], '') === removedItem.getIn(['_id', '$id'], '')) {
      const itemType = getConfig(['systemItems', itemName, 'itemType'], '');
      const itemsType = getConfig(['systemItems', itemName, 'itemsType'], '');
      if (revisions.size <= 1) { // only one revision
        this.props.backToList(true);
        return false;
      }
      const idx = revisions.findIndex(revision => revision.getIn(['_id', '$id'], false) === item.getIn(['_id', '$id'], false));
      if (revisions.size > 1) {
        const prevItemId = (idx !== -1) ? revisions.getIn([idx + 1, '_id', '$id'], revisions.getIn([idx - 1, '_id', '$id'], '')) : revisions.getIn([0, '_id', '$id'], '');
        this.props.router.push(`${itemsType}/${itemType}/${prevItemId}`);
        return false;
      }
    }
    return true;
  }

  renderVerisionList = () => {
    const { itemName, revisions, item } = this.props;
    const { showList } = this.state;
    const revisionBy = getConfig(['systemItems', itemName, 'uniqueField'], '');
    return (
      <ModalWrapper title={`${item.get(revisionBy, '')} - Revision History`} show={showList} onOk={this.hideManageRevisions} >
        <RevisionList
          items={revisions}
          itemName={itemName}
          onSelectItem={this.hideManageRevisions}
          onDeleteItem={this.onDeleteItem}
        />
      </ModalWrapper>
    );
  }

  getStartIndex = () => {
    const { item, revisions } = this.props;
    const index = revisions.findIndex(revision => revision.getIn(['_id', '$id'], '') === item.getIn(['_id', '$id'], ''));
    if (index <= 0) {
      return 0;
    }
    if (index + 1 === revisions.size) {
      return ((index - 2) >= 0) ? index - 2 : 0;
    }
    return index - 1;
  }

  onChangeFrom = (value) => {
    if (value) {
      this.props.onChangeFrom(['from'], value.toISOString());
    }
  }

  renderDateFromfields = () => {
    const { item, mode } = this.props;
    const from = getItemDateValue(item, 'from');
    if (mode === 'view' || mode === 'update') {
      return (
        <p style={{ lineHeight: '35px' }}>{ from.format(globalSetting.dateFormat)}</p>
      );
    }
    const tommorow = moment().add(1, 'days');
    return (
      <DatePicker
        className="form-control"
        dateFormat={globalSetting.dateFormat}
        selected={from}
        onChange={this.onChangeFrom}
        isClearable={false}
        placeholderText="Select Date..."
        minDate={tommorow}
      />
    );
  }

  renderRevisionsBlock = () => {
    const { item, revisions, revisionItemsInTimeLine, mode } = this.props;
    if (mode === 'create') {
      return null;
    }
    const start = this.getStartIndex();
    return (
      <div className="inline pull-right">
        <div className="inline mr10">
          <RevisionTimeline
            revisions={revisions}
            item={item}
            size={revisionItemsInTimeLine}
            start={start}
          />
        </div>
        <div className="inline">
          <Button bsStyle="link" className="pull-right" style={{ padding: '0 10px 15px 10px' }} onClick={this.showManageRevisions}>
            Manage Revisions
          </Button>
        </div>
      </div>
    );
  }

  renderDateViewBlock = () => {
    const { item } = this.props;
    const from = getItemDateValue(item, 'originalValue');
    const to = getItemDateValue(item, 'to');
    return (
      <div className="inline" style={{ width: 165, padding: 0, margin: '9px 20px 0 20px' }}>
        <p style={{ lineHeight: '35px' }}>{ from.format(globalSetting.dateFormat)} - { to.format(globalSetting.dateFormat)}</p>
      </div>
    );
  }

  renderDateSelectBlock = () => (
    <div className="inline" style={{ width: 155, padding: 0, margin: '9px 25px 0 25px' }}>
      <Form horizontal style={{ marginBottom: 0 }}>
        <FormGroup style={{ marginBottom: 0 }}>
          <div className="inline" style={{ verticalAlign: 'top', marginTop: 10, marginRight: 15 }}>
            <label>From</label>
          </div>
          <div className="inline" style={{ padding: 0, width: 120 }}>
            { this.renderDateFromfields() }
          </div>
        </FormGroup>
      </Form>
    </div>
  )

  renderTitle = () => {
    const { mode } = this.props;
    if (mode === 'create') {
      return (
        <div className="inline" style={{ verticalAlign: 'top', marginTop: 18, width: 110 }}>
          &nbsp;
        </div>
      );
    }
    return (
      <div className="inline" style={{ verticalAlign: 'top', marginTop: 18, width: 110 }}>
        <label>Revisions History</label>
      </div>
    );
  }

  renderEditMessage = () => {
    const { mode, item } = this.props;
    if (mode === 'view' && getItemDateValue(item, 'to').isAfter(moment())) {
      return (
        <small className="danger-red"> You cannot edit the current revision because a future revision exists.</small>
      );
    }
    return null;
  }

  render() {
    const { mode } = this.props;
    return (
      <div className="entity-revision-edit">
        <div>
          { this.renderTitle() }
          { mode === 'view'
            ? this.renderDateViewBlock()
            : this.renderDateSelectBlock()
          }
          { this.renderRevisionsBlock() }
          { this.renderVerisionList() }
        </div>
        { this.renderEditMessage() }
      </div>
    );
  }

}

export default withRouter(EntityRevisionDetails);
