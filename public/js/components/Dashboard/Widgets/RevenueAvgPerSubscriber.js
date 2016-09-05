import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {LineAreaChart} from '../../Charts';
import {getData} from '../../../actions/dashboardActions';
import PlaceHolderWidget from '../Widgets/PlaceHolder';
import {getMonthName, getYearsToDisplay, chartOptionCurrencyAxesLabel, chartOptionCurrencyTooltipLabel} from '../Widgets/helper';


class RevenueAvgPerSubscriber extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: props.width || 545,
      height: props.height || 400
    }
  }

  componentDidMount() {
    this.props.getData('revenueAvgPerSubscriber', this.prepereAgrigateQuery());
  }

  prepereAgrigateQuery() {
    const {fromDate, toDate} = this.props;
    const AGGREGATE = 'aggregate';

    var revenueQuery = [{
      "$match": {"confirmation_time": {"$gte": fromDate, "$lte": toDate}, "type": "rec"}
    },{
      "$group": { "_id": "$aid", "date": { "$first": "$confirmation_time" }, "due":{"$sum":"$due"} }
    },{
      "$group": { "_id": { "year": { "$year": "$date" }, "month": { "$month": "$date" } }, "due": { "$sum": "$due" } }
    },{
      "$project": { "year": "$_id.year", "month": "$_id.month", "_id": 0, "due": "$due" }
    },{
      "$sort": { "year": 1, "month": 1 }
    }];

    var newSubscribersQuery = [{
      "$match": { "type": "subscriber", "creation_time": { "$gte": fromDate }, "to": { "$gte": toDate } }
    },{
      "$group": { "_id": "$sid", "creation_time": { "$first": "$creation_time" } }
    },{
      "$group": { "_id": { "year": { "$year": "$creation_time" }, "month": { "$month": "$creation_time" } }, "count": { "$sum": 1 } }
    },{
      "$project": { "year": "$_id.year", "month": "$_id.month", "_id": 0, "count": "$count" }
    },{
      "$sort": { "year": 1, "month": 1 }
    }];

    var totalSubscribersQuery = [{
      "$match" : {"to":{"$gte": toDate},"creation_time":{"$lte": fromDate }  }
    },{
      "$sort" : {"creation_time" : 1}
    },{
      "$group": {"_id" : "$sid"}
    },{
      "$group":{"_id":null, "count" : {"$sum":1}}
    },{
      "$project" : {"count":1, "_id":0}
    }];

    var queries = [{
      name: 'revenue',
      api: AGGREGATE,
      params: [
        { collection: 'bills' },
        { pipelines: JSON.stringify(revenueQuery) }
      ]
    },{
      name: 'new_subscribers',
      api: AGGREGATE,
      params: [
        { collection: 'subscribers' },
        { pipelines: JSON.stringify(newSubscribersQuery) }
      ]
    },{
      name: 'total_subscribers',
      api: AGGREGATE,
      params: [
        { collection: 'subscribers' },
        { pipelines: JSON.stringify(totalSubscribersQuery) }
      ]
    }];

    return queries;
  }

  prepareChartData(chartData) {
    const {fromDate, toDate} = this.props;
    let yearsToDisplay = getYearsToDisplay(fromDate, toDate);
    let multipleYears = Object.keys(yearsToDisplay).length > 1;

    let total = 0;
    let formatedData = {
      // title: 'Revenue Avg. per Subscriber',
      x: [ { label : 'Avg. Revenue', values : [] } ],
      y: []
    };

    let totalSubscribersDataset = chartData.find((dataset, i) => dataset.name == "total_subscribers");
    if(totalSubscribersDataset && totalSubscribersDataset.data && totalSubscribersDataset.data[0]){
      total = totalSubscribersDataset.data[0].count;
    }

    let newSubscribersDataset = chartData.find((dataset, i) => dataset.name == "new_subscribers");
    let revenueDataset = chartData.find((dataset, i) => dataset.name == "revenue");
    if(!revenueDataset.data || revenueDataset.data.length == 0 || !newSubscribersDataset.data || newSubscribersDataset.data.length == 0 ){
      return null;
    }

    for (var year in yearsToDisplay) {
      yearsToDisplay[year].forEach((month, k) => {
        let revenue = revenueDataset.data.find((node, revenue_index) => { return (month == node.month && year == node.year)} );
        let newSubscriber = newSubscribersDataset.data.find((node, newSubscriber_index) => { return (month == node.month && year == node.year)} );
        total += (newSubscriber) ? newSubscriber.count : 0 ;
        let avarage = (revenue) ? Math.round(revenue.due / total) : 0;
        formatedData.x[0].values.push(avarage);
        let label = getMonthName(month);
        if (multipleYears){
          label += ', ' + year;
        }
        formatedData.y.push(label);
      });
    }

    return formatedData;
  }

  overrideChartOptions() {
    let owerideOptions = {
      legend: {
        display: false
      },
      tooltips: {
          enabled: true,
          mode: 'single',
          callbacks: {
            title: function (tooltipItem, data) { return null; },
            label: chartOptionCurrencyTooltipLabel
          }
      },
      scales: {
        yAxes: [
          {
            display: true,
            ticks: {
              beginAtZero: false,
              callback: chartOptionCurrencyAxesLabel
            }
          }
        ]
      },
    };
    return owerideOptions;
  }

  renderContent(chartData){
    switch (chartData) {
      case undefined: return <PlaceHolderWidget/>;
      case null: return null;
      default: return <LineAreaChart width={this.state.width} height={this.state.height} data={this.prepareChartData(chartData)} options={this.overrideChartOptions()}/>;
    }
  }

  render() {
    const { chartData } = this.props;
    return ( <div> {this.renderContent(chartData)} </div> );
  }
}

function mapStateToProps(state, props) {
  return {chartData: state.dashboard.revenueAvgPerSubscriber};
}

export default connect(mapStateToProps, { getData })(RevenueAvgPerSubscriber);
