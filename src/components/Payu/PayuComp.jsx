import React, { useState, useEffect } from "react";
import { Form, FormGroup, ControlLabel, Col, Row } from "react-bootstrap";
import { Panel } from "react-bootstrap";
import Field from "@/components/Field";
import { Button } from "react-bootstrap";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [perc95, setPerc95] = useState(0);

  const [days, setDays] = useState(30);
  const [otc, setOtc] = useState(1000);
  const [fraction, setFraction] = useState(0);
  const [price, setPrice] = useState(40000);
  const [fixPrice1, setFixPrice1] = useState(0);
  const [priceRental, setPriceRental] = useState(10000);
  const [rental, setRental] = useState(0);
  const [payuPriceMbps, setPayuPriceMbps] = useState(350);
  const [payuPrice, setPayuPrice] = useState(0);
  const [payuLink2Price, setPayuLink2Price] = useState(10000);
  const [payuLink2, setPayuLink2] = useState(0);
  const [payuRental, setPayuRental] = useState(0);
  const [payuCharge, setPayuCharge] = useState(0);
  const [total, setTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [rowData1test, setRowData1] = useState([]);

  const taxRate = 0.06;

  // const test = [
  //   21, 22, 30, 33, 43, 45, 120, 48, 48, 50, 50, 55, 56, 57, 58, 59, 61, 61, 62,
  //   62, 63, 66, 68, 68, 72, 73,
  // ];

  // console.log("95th: ", percentile(test, 0.95));

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

      // TEST
      setRowData1(rowData1);

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

      const perc95_1 = percentile(rowData1, 0.95);
      const perc95_2 = percentile(rowData2, 0.95);

      setPerc1(perc95_1);
      setPerc2(perc95_2);
      setPerc95(perc95_1);
    }
  }, [data]);

  useEffect(() => {
    setFraction((1 / 365) * days);
    setFixPrice1(price * fraction);
    setRental(priceRental * fraction);
    setPayuPrice(payuPriceMbps * perc95);
    setPayuLink2(payuLink2Price * fraction);
    setPayuRental(rental + payuPrice + payuLink2);
    setPayuCharge(
      fixPrice1 === 0
        ? payuRental
        : payuRental < fixPrice1
        ? payuRental
        : fixPrice1
    );
    setTotal(Number(payuCharge) + otc);
    setTax(taxRate * total);
    setGrandTotal(total + tax);
  }, [
    days,
    price,
    fraction,
    priceRental,
    payuPriceMbps,
    perc1,
    perc95,
    payuLink2Price,
    payuPrice,
    payuRental,
    fixPrice1,
    payuCharge,
    payuLink2,
    rental,
    tax,
    total,
  ]);

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

  const onPriceRentalChange = (e) => {
    setPriceRental(e.target.value);
  };

  const onPayuPriceMbpsChange = (e) => {
    setPayuPriceMbps(e.target.value);
  };

  const onPayuLink2Price = (e) => {
    setPayuLink2Price(e.target.value);
  };

  const onOtcChange = (e) => {
    setOtc(e.target.value);
  };

  const onPerc1Change = (e) => {
    setPerc95(e.target.value);
  };

  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: "l",
    });

    doc.setFontSize(6);
    autoTable(doc, {
      styles: {
        cellPadding: 0.5,
        fontSize: 6,
      },
      head: [
        [
          "95th",
          "Days",
          "OTC RM",
          "Fraction",
          "Price",
          "FIXED CHARGe",
          "PRICE RENTAL",
          "RENTAL (RM)",
          "PAYU/Mbps RM",
          "PAYU (RM)",
          "PRICE PAYU LINK",
          "PAYU LINK 2",
          "PAYU ACTUAL",
          "PAYU CHARGE",
          "TOTAL",
          "TAX 6%",
          "GRAND TOTAL",
        ],
      ],
      body: [
        [
          perc95.toFixed(2),
          days.toFixed(2),
          otc.toFixed(2),
          fraction.toFixed(2),
          price.toFixed(2),
          fixPrice1.toFixed(2),
          priceRental.toFixed(2),
          rental.toFixed(2),
          payuPriceMbps.toFixed(2),
          payuPrice.toFixed(2),
          payuLink2Price.toFixed(2),
          payuLink2.toFixed(2),
          payuRental.toFixed(2),
          payuCharge.toFixed(2),
          total.toFixed(2),
          taxRate.toFixed(2),
          grandTotal.toFixed(2),
        ],
        // ...
      ],
    });

    doc.save("Payu.pdf");
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
        <CSVLink
          data={`${perc95}, ${days}, ${otc},${fraction},${price}, ${fixPrice1},${priceRental}, ${rental}, ${payuPriceMbps}, ${payuPrice}, ${payuLink2Price}, ${payuLink2}, ${payuRental}, ${payuCharge}, ${total}, ${taxRate}, ${grandTotal}`}
          headers={[
            "95th",
            "Days",
            "OTC RM",
            "Fraction",
            "Price RM (Recurring Price)",
            "FIXED CHARGES RM",
            "PRICE RENTAL RM (Fixed Rental)",
            "RENTAL (RM)",
            "PAYU/Mbps RM",
            "PAYU (RM)",
            "PRICE PAYU LINK 2 RM",
            "PAYU LINK 2 RM",
            "PAYU ACTUAL RM",
            "PAYU CHARGE RM",
            "TOTAL RM",
            "TAX 6%",
            "GRAND TOTAL RM",
          ]}
          separator={","}
          filename={`Payu`}
        >
          CSV
        </CSVLink>
      )}

      {avg1 && (
        <button style={{ marginLeft: "10px" }} onClick={downloadPDF}>
          pdf
        </button>
      )}
      {avg1 && (
        <>
          <Panel>
            <Form horizontal>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  95th (testing purpose: can manual change)
                </Col>
                <Col sm={8} lg={9}>
                  <Field
                    value={perc95}
                    onChange={onPerc1Change}
                    onblur={() => console.log("=======")}
                  />
                </Col>
              </FormGroup>
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
                  OTC RM
                </Col>
                <Col sm={8} lg={9}>
                  <Field value={otc} onChange={onOtcChange} />
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
                  Price RM (Recurring Price)
                </Col>
                <Col sm={8} lg={9}>
                  <Field value={price} onChange={onPriceChange} />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  FIXED CHARGES RM
                </Col>
                <Col sm={8} lg={9}>
                  <Field value={fixPrice1} disabled />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  PRICE RENTAL RM (Fixed Rental)
                </Col>
                <Col sm={8} lg={9}>
                  <Field value={priceRental} onChange={onPriceRentalChange} />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  RENTAL (RM)
                </Col>
                <Col sm={8} lg={9}>
                  <Field value={rental} disabled />
                </Col>
              </FormGroup>
              {/*  */}
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  PAYU/Mbps RM
                </Col>
                <Col sm={8} lg={9}>
                  <Field
                    value={payuPriceMbps}
                    onChange={onPayuPriceMbpsChange}
                  />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  PAYU (RM)
                </Col>
                <Col sm={8} lg={9}>
                  <Field value={payuPrice} disabled />
                </Col>
              </FormGroup>
              {/* onPayuLink2Price */}
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  PRICE PAYU LINK 2 RM
                </Col>
                <Col sm={8} lg={9}>
                  <Field value={payuLink2Price} onChange={onPayuLink2Price} />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  PAYU LINK 2 RM
                </Col>
                <Col sm={8} lg={9}>
                  <Field value={payuLink2} disabled />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  PAYU ACTUAL RM
                </Col>
                <Col sm={8} lg={9}>
                  <Field value={payuRental} disabled />
                </Col>
              </FormGroup>
              {/* "PAYU CHARGE RM" */}
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  PAYU CHARGE RM
                </Col>
                <Col sm={8} lg={9}>
                  <Field value={payuCharge} disabled />
                </Col>
              </FormGroup>
              {/* "TOTAL RM" */}
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  TOTAL RM
                </Col>
                <Col sm={8} lg={9}>
                  <Field value={total} disabled />
                </Col>
              </FormGroup>
              {/* "TAX 6%" */}
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  TAX 6%
                </Col>
                <Col sm={8} lg={9}>
                  <Field value={taxRate} disabled />
                </Col>
              </FormGroup>
              {/* GRAND TOTAL RM */}
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  GRAND TOTAL RM
                </Col>
                <Col sm={8} lg={9}>
                  <Field value={grandTotal} disabled />
                </Col>
              </FormGroup>
            </Form>
          </Panel>
        </>
      )}

      {/* <table>
        <tbody>
          {rowData1test?.map((rowData, i) => {
            return (
              <tr key={i}>
                <td>{rowData}</td>;
              </tr>
            );
          })}
        </tbody>
      </table> */}
    </Col>
  );
};

const percentile = (arr, p) => {
  arrSort(arr);
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

// const percentile2 = (arr, num) =>
//   (arr.filter((item) => item <= num).length / arr.length) * 100;

// const percentile3 = (arr, val) =>
//   (100 *
//     arr.reduce(
//       (acc, v) => acc + (v < val ? 1 : 0) + (v === val ? 0.5 : 0),
//       0
//     )) /
//   arr.length;

function arrSort(arr) {
  arr.sort((a, b) => b - a);
  arr.reverse();
  return arr;
}
