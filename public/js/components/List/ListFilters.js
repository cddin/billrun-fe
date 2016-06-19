import React from 'react';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Chips from '../Chips';
import AddMore from '../AddMore';
import AdvancedFilter from '../AdvancedFilter';
import FieldsContainer from '../FieldsContainer';

const styles = {
  filterInput : {
    margin : '10px',
  },
  filterChips : {
    margin : '10px',
    display : 'inline-block',
  },
  filterDatePicker: {
    margin : '10px',
    display: 'inline-block'
  },
  filterSelect: {
    verticalAlign: 'top',
    margin: '10px'
  }
}
export default class ListFilters extends React.Component {

  constructor(props) {
    super(props);
    this.state = { };

    this.renderFilterFields = this.renderFilterFields.bind(this);
    this.renderAdvancedFilter = this.renderAdvancedFilter.bind(this);
    this.onChangeFilterMultiselect = this.onChangeFilterMultiselect.bind(this);
    this.onChangeFilterSelectField = this.onChangeFilterSelectField.bind(this);

    this.onAdvFilterChange = this.onAdvFilterChange.bind(this);
    this.onAdvFilterRemove = this.onAdvFilterRemove.bind(this);
  }

  onChangeFilterMultiselect(name, value) {
    let evt = {
      target: { name }
    };
    this.props.onChangeFilter(evt, value);
  }

  onChangeFilterSelectField(name, e, index, value) {
    let evt = {
      target: { name }
    };
    this.setState({
      [name]: value
    }, () => {this.props.onChangeFilter(evt, value);});
  }


  renderFilterFields(){
    let filters = [];
    this.props.fields.forEach((field, i) => {
      if(field.filter && !field.filter.system){
        if(field.type == 'urt') {
          filters.push(<DatePicker
                  key={i} name={field.key}
                  defaultDate={(field.filter.defaultValue) ? new Date(field.filter.defaultValue) : null}
                  hintText={"Enter " + field.label + "..."}
                  floatingLabelText={"Search by " + field.label}
                  container="inline" mode="landscape" style={styles.filterDatePicker}
                  onChange={this.props.onChangeFilterDate.bind(null, field.key)} autoOk={true}
                  formatDate={this.props.formatDate}
                />);
        } else if(field.type == 'multiselect'){
          filters.push(<Chips
                  key={i} name={field.key} style={{wrapper:styles.filterChips}}
                  options={field.filter.options}
                  onChange={this.onChangeFilterMultiselect.bind(null, field.key)}
                  label={field.label} inputType='select'
                />);
        } else if(field.type == 'select'){
          let val = typeof field.filter.defaultValue !== 'undefined' ? field.filter.defaultValue : null;
          val = typeof this.state[field.key] !== 'undefined' ? this.state[field.key] : val;
          filters.push(<SelectField
                    key={i} name={field.key} style={styles.filterSelect}
                    value={val}
                    onChange={this.onChangeFilterSelectField.bind(null, field.key)}
                    floatingLabelText={field.label}
                  >
                    { field.filter.options.map((field, option_index) =>  { return ( <MenuItem value={field.key} key={i + "-" + option_index} primaryText={field.value} />); }) }
                  </SelectField>);
        } else {
          filters.push(<TextField
                   style={styles.filterInput}
                   key={i} name={field.key}
                   hintText={"enter " + field.label + "..."}
                   floatingLabelText={"Search by " + field.label}
                   errorText=""
                   defaultValue={(field.filter.defaultValue) ? field.filter.defaultValue : ''}
                   onChange={this.props.onChangeFilter}
                 />);
         }
      }
    });
    return filters;
  }

  onAdvFilterChange(filter){
    this.props.onChangeAdvFilter(filter);
  }
  onAdvFilterRemove(index){
    this.props.onRemoveAdvFilter(index);
  }

  renderAdvancedFilter(){
    let { advancedFilter } = this.props;
    if(advancedFilter){
      let advFilter = <AdvancedFilter fields={advancedFilter} onFilterChanged={this.onAdvFilterChange}/>;
      let addMore = <AddMore item={advFilter} removeItem={this.onAdvFilterRemove}/>
      return <FieldsContainer size="10" label="Advenced Filter" content={addMore} collapsible={false} />
    }
  }

  render() {
    return (
      <div>
        {this.renderFilterFields()}
        {this.renderAdvancedFilter()}
      </div>
    )
  }
}