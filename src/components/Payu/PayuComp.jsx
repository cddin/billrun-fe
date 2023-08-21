import React, { useState, useEffect } from "react";
import { Form, FormGroup, ControlLabel, Col, Row } from "react-bootstrap";
import { Panel } from "react-bootstrap";
import Field from "@/components/Field";
import { Button } from "react-bootstrap";

export const PayuComp = () => {
  const [data, setData] = useState([]);
  const [min1, setMin1] = useState(0);
  const [max1, setMax1] = useState(0);
  const [avg1, setAvg1] = useState(0);
  const [min2, setMin2] = useState(0);
  const [max2, setMax2] = useState(0);
  const [avg2, setAvg2] = useState(0);

  const [perc1, setPerc1] = useState(0);
  const [perc2, setPerc2] = useState(0);

  const [days, setDays] = useState(30);
  const [fraction, setFraction] = useState(0);
  const [price, setPrice] = useState(1000);
  const [fixPrice1, setFixPrice1] = useState(0);

  const unit = " Mbit/s";

  useEffect(() => {
    const mean = (data) => {
      if (data.length < 1) {
        return;
      }
      return data.reduce((prev, current) => prev + current) / data.length;
    };

    if (data) {
      const rows = data.slice(1);
      const rowData1 = rows.map((rowData) => {
        const cleanSpace = rowData[1].trim();
        const test = Number(cleanSpace.split(unit)[0]);
        return isNaN(test) ? 0 : test;
      });

      let minValue1 = Math.min(...rowData1);
      let maxValue1 = Math.max(...rowData1);
      setAvg1(mean(rowData1));
      setMin1(minValue1);
      setMax1(maxValue1);

      const rowData2 = rows.map((rowData) => {
        const cleanSpace = rowData[2].trim();
        const test = Number(cleanSpace.split(unit)[0]);
        return isNaN(test) ? 0 : test;
      });

      let minValue2 = Math.min(...rowData2);
      let maxValue2 = Math.max(...rowData2);
      setAvg2(mean(rowData2));
      setMin2(minValue2);
      setMax2(maxValue2);

      const perc95_1 = percentile(rowData1, 95);
      const perc95_2 = percentile(rowData2, 95);

      setPerc1(perc95_1);
      setPerc2(perc95_2);
    }
  }, [data]);

  useEffect(() => {
    setFraction((1 / 365) * days);
    setFixPrice1(price * fraction);
  }, [days, price, fraction]);

  // const headers = data[0];
  // const rows = data.slice(1);

  const onFileChange = async (e) => {
    // setFile(e.target.files[0]);
    const file = e.target.files[0];

    // 1. create url from the file
    const fileUrl = URL.createObjectURL(file);
    // 2. use fetch API to read the file
    const response = await fetch(fileUrl);

    // 3. get the text from the response
    const text = await response.text();

    // 4. split the text by newline
    const lines = text.split("\n");
    // 5. map through all the lines and split each line by comma.
    const _data = lines.map((line) => line.split(","));

    setData(_data);
  };

  const onBack = () => {
    // this.props.router.push("/users");
  };

  const onSave = () => {
    // const { item, mode } = this.props;
  };

  const onDaysChange = (e) => {
    setDays(e.target.value);
  };

  const onPriceChange = (e) => {
    setPrice(e.target.value);
  };

  return (
    <Col>
      <Panel>
        <Row>
          <Col lg={12}>
            <Form horizontal>
              {/* <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  Test
                </Col>
                <Col sm={8} lg={9}>
                  <Field onChange={onUserNameChange} value="" />
                </Col>
              </FormGroup> */}
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  Select file
                </Col>
                <Col sm={8} lg={9}>
                  {/* <Field type="file" onChange={this.onFileChange} value="" /> */}
                  <input
                    type="file"
                    id="myfile"
                    name="myfile"
                    onChange={onFileChange}
                  ></input>
                </Col>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </Panel>
      {/* <Button bsStyle={"primary"} onClick={onSave}>
        process
      </Button> */}
      {avg1 && (
        <>
          In Bound
          <Panel>
            <Col>
              <div>
                Average: {avg1}
                {unit}
              </div>
              <div>
                Min: {min1}
                {unit}
              </div>
              <div>
                Max: {max1}
                {unit}
              </div>
              <div>
                95th: {perc1}
                {unit}
              </div>
            </Col>
          </Panel>
        </>
      )}

      {avg2 && (
        <>
          Out Bound
          <Panel>
            <Col>
              <div>
                Average: {avg2}
                {unit}
              </div>
              <div>
                Min: {min2}
                {unit}
              </div>
              <div>
                Max: {max2}
                {unit}
              </div>
              <div>
                95th: {perc2}
                {unit}
              </div>
            </Col>
          </Panel>
        </>
      )}

      {avg1 && (
        <>
          <Panel>
            <Form horizontal>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  Days
                </Col>
                <Col sm={8} lg={9}>
                  <Field value={days} onChange={onDaysChange} />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  Fraction
                </Col>
                <Col sm={8} lg={9}>
                  <Field value={fraction} disabled />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  Price (RM)
                </Col>
                <Col sm={8} lg={9}>
                  <Field value={price} onChange={onPriceChange} />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  FIXED CHARGES RM (Recurring Price)
                </Col>
                <Col sm={8} lg={9}>
                  <Field value={fixPrice1} disabled />
                </Col>
              </FormGroup>
              TODO: others field
            </Form>
          </Panel>
        </>
      )}

      {/* <table>
        <thead>
          <tr>
            {headers?.map((header, i) => (
              <th key={i}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.map((rowData, i) => {
            return (
              <tr key={i}>
                {rowData?.map((data, i) => {
                  return <td key={i}>{data}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table> */}
    </Col>
  );
};

const percentile = (arr, p) => {
  if (arr.length === 0) return 0;
  if (typeof p !== "number") throw new TypeError("p must be a number");
  if (p <= 0) return arr[0];
  if (p >= 1) return arr[arr.length - 1];

  var index = (arr.length - 1) * p,
    lower = Math.floor(index),
    upper = lower + 1,
    weight = index % 1;

  if (upper >= arr.length) return arr[lower];
  return arr[lower] * (1 - weight) + arr[upper] * weight;
};
