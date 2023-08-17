import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Immutable from "immutable";
import moment from "moment";
import { Panel } from "react-bootstrap";
import { ActionButtons, LoadingItemPlaceholder } from "@/components/Elements";
import { EntityRevisionDetails } from "../Entity";
// import Product from './Product';
import { EntityTaxDetails } from "@/components/Tax";
import {
  onRateAdd,
  onRateRemove,
  onFieldUpdate,
  onFieldRemove,
  onToUpdate,
  onUsagetUpdate,
  getProduct,
  saveProduct,
  clearProduct,
  setCloneProduct,
} from "@/actions/productActions";
import { showSuccess } from "@/actions/alertsActions";
import { setPageTitle } from "@/actions/guiStateActions/pageActions";
import {
  clearItems,
  getRevisions,
  clearRevisions,
} from "@/actions/entityListActions";
import { getSettings } from "@/actions/settingsActions";
import {
  modeSelector,
  itemSelector,
  idSelector,
  tabSelector,
  revisionsSelector,
} from "@/selectors/entitySelector";
import { inputProssesorRatingParamsSelector } from "@/selectors/settingsSelector";
import {
  // buildPageTitle,
  getConfig,
  getItemId,
  getRateUsaget,
} from "@/common/Util";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Tooltip,
  Legend,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

class Dashboard extends Component {
  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    itemId: PropTypes.string,
    revisions: PropTypes.instanceOf(Immutable.List),
    mode: PropTypes.string,
    ratingParams: PropTypes.instanceOf(Immutable.List),
    activeTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    item: Immutable.Map(),
    revisions: Immutable.List(),
    ratingParams: Immutable.List(),
    activeTab: 1,
  };

  static entityName = "Dashboard";

  state = {
    activeTab: parseInt(this.props.activeTab),
  };

  componentWillMount() {
    this.fetchItem();
  }

  componentDidMount() {
    const { mode } = this.props;
    this.props.dispatch(
      getSettings([
        "usage_types",
        "file_types",
        "property_types",
        "subscribers.subscriber.fields",
        "rates.fields",
      ])
    );
    if (["clone", "create"].includes(mode)) {
      // const pageTitle = buildPageTitle(mode, Dashboard.entityName);
      const pageTitle = Dashboard.entityName;
      this.props.dispatch(setPageTitle(pageTitle));
    }
    this.initDefaultValues();
  }

  componentWillReceiveProps(nextProps) {
    const { item, mode, itemId } = nextProps;
    const { item: oldItem, itemId: oldItemId, mode: oldMode } = this.props;
    if (mode !== oldMode || getItemId(item) !== getItemId(oldItem)) {
      const pageTitle = Dashboard.entityName;
      this.props.dispatch(setPageTitle(pageTitle));
    }
    if (itemId !== oldItemId || (mode !== oldMode && mode === "clone")) {
      this.fetchItem(itemId);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !Immutable.is(this.props.item, nextState.item) ||
      !Immutable.is(this.props.revisions, nextState.revisions) ||
      this.props.activeTab !== nextProps.activeTab ||
      this.props.itemId !== nextProps.itemId ||
      this.props.mode !== nextProps.mode
    );
  }

  componentWillUnmount() {
    this.props.dispatch(clearProduct());
  }

  initDefaultValues = () => {
    const { mode, item } = this.props;
    if (item.get("pricing_method", null) === null) {
      this.props.dispatch(onFieldUpdate(["pricing_method"], "tiered"));
    }
    if (mode === "create") {
      const defaultFromValue = moment().add(1, "days").toISOString();
      this.props.dispatch(onFieldUpdate(["from"], defaultFromValue));
    }
    if (mode === "clone") {
      this.props.dispatch(setCloneProduct());
    }
  };

  initRevisions = () => {
    const { item, revisions } = this.props;
    if (revisions.isEmpty() && item.getIn(["_id", "$id"], false)) {
      const key = item.get("key", "");
      this.props.dispatch(getRevisions("rates", "key", key));
    }
  };

  fetchItem = (itemId = this.props.itemId) => {
    if (itemId) {
      this.props.dispatch(getProduct(itemId)).then(this.afterItemReceived);
    }
  };

  clearRevisions = () => {
    const { item } = this.props;
    const key = item.get("key", "");
    this.props.dispatch(clearRevisions("rates", key));
  };

  clearItemsList = () => {
    this.props.dispatch(clearItems("products"));
  };

  onFieldUpdate = (path, value) => {
    this.props.dispatch(onFieldUpdate(path, value));
  };

  onFieldRemove = (path) => {
    this.props.dispatch(onFieldRemove(path));
  };

  onToUpdate = (path, index, value) => {
    this.props.dispatch(onToUpdate(path, index, value));
  };

  onUsagetUpdate = (path, oldUsaget, newUsaget) => {
    this.props.dispatch(onUsagetUpdate(path, oldUsaget, newUsaget));
  };

  onProductRateAdd = (productPath) => {
    this.props.dispatch(onRateAdd(productPath));
  };

  onProductRateRemove = (productPath, index) => {
    this.props.dispatch(onRateRemove(productPath, index));
  };

  afterItemReceived = (response) => {
    if (response.status) {
      this.initRevisions();
      this.initDefaultValues();
    } else {
      this.handleBack();
    }
  };

  afterSave = (response) => {
    const { mode } = this.props;
    if (response.status) {
      const action = ["clone", "create"].includes(mode) ? "created" : "updated";
      this.props.dispatch(showSuccess(`The product was ${action}`));
      this.clearRevisions();
      this.handleBack(true);
    }
  };

  handleSave = () => {
    const { item, mode } = this.props;
    this.props.dispatch(saveProduct(item, mode)).then(this.afterSave);
  };

  handleBack = (itemWasChanged = false) => {
    if (itemWasChanged) {
      this.clearItemsList(); // refetch items list because item was (changed in / added to) list
    }
    const listUrl = getConfig(
      ["systemItems", Dashboard.entityName, "itemsType"],
      ""
    );
    this.props.router.push(`/${listUrl}`);
  };

  render() {
    const { item, ratingParams, mode, revisions } = this.props;
    if (mode === "loading") {
      return <LoadingItemPlaceholder onClick={this.handleBack} />;
    }

    const allowEdit = mode !== "view";
    const usaget = getRateUsaget(item);
    return (
      <div className="ProductSetup">
        <Panel>
          <RenderLineChart />
        </Panel>
        <Panel>
          <RenderBarChart />
        </Panel>
        <Panel>
          <RenderPieChart />
        </Panel>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  itemId: idSelector(state, props, Dashboard.entityName),
  item: itemSelector(state, props, Dashboard.entityName),
  mode: modeSelector(state, props, Dashboard.entityName),
  activeTab: tabSelector(state, props, Dashboard.entityName),
  revisions: revisionsSelector(state, props, Dashboard.entityName),
  ratingParams: inputProssesorRatingParamsSelector(state, props),
});

export default withRouter(connect(mapStateToProps)(Dashboard));

const RenderLineChart = () => {
  const data = [
    { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 100, pv: 1400, amt: 1200 },
    { name: "Page C", uv: 200, pv: 1600, amt: 1000 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        width="100%"
        height={300}
        data={data}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis />
      </LineChart>
    </ResponsiveContainer>
  );
};

const RenderBarChart = () => {
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        width="100%"
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="pv" fill="#8884d8" />
        <Bar dataKey="uv" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const RenderPieChart = () => {
  const data = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart width="100%" height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};
