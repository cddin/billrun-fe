import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Panel } from "react-bootstrap";
import { LoadingItemPlaceholder } from "@/components/Elements";
import { getConfig } from "@/common/Util";

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
  static entityName = "Dashboard";

  componentWillReceiveProps(nextProps) {}

  // handleBack = (itemWasChanged = false) => {
  //   const listUrl = getConfig(
  //     ["systemItems", Dashboard.entityName, "itemsType"],
  //     ""
  //   );
  //   this.props.router.push(`/${listUrl}`);
  // };

  render() {
    const { mode } = this.props;
    if (mode === "loading") {
      // return <LoadingItemPlaceholder onClick={this.handleBack} />;
      return <LoadingItemPlaceholder />;
    }

    return (
      <div>
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
  // itemId: idSelector(state, props, Dashboard.entityName),
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
