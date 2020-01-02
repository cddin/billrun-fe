import { connect } from 'react-redux';
import EntityField from './EntityField';
import {
  isEditableFiledProperty,
} from '@/common/Util';


const mapStateToProps = (state, props) => ({
  isFieldTags: props.field && props.field.get('multiple', false) && !props.field.get('select_list', false),
  isFieldSelect: props.field && props.field.get('select_list', false),
  isFieldBoolean: props.field && props.field.get('type', '') === 'boolean',
  isFieldRanges: props.field && props.field.get('type', '') === 'ranges',
  isFieldDate: props.field && props.field.get('type', '') === 'date',
  isFieldDateRange: props.field && props.field.get('type', '') === 'daterange',
  isRemoveField: props.field && ['params'].includes(props.field.get('field_name', '').split('.')[0]) && isEditableFiledProperty(props.field, true, 'delete'),
  fieldPath: props.field ? props.field.get('field_name', '').split('.') : [],
});


const mapDispatchToProps = (dispatch, props) => ({

});


export default connect(mapStateToProps, mapDispatchToProps)(EntityField);
