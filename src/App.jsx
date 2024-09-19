import React, { useState } from "react";

import { marked } from "marked";
import Chart from "react-apexcharts";

const App = () => {
  const [data, setData] = useState(null);
  const [chartsData, setChartsData] = useState(null);

  const extractTableData = (markdown) => {
    const tokens = marked.lexer(markdown);
    let tables = [];
    let currentTable = { headers: [], rows: [] };

    tokens.forEach((token) => {
      if (token.type === "table") {
        currentTable = {
          headers: token.header,
          rows: token.rows,
        };
        tables.push(currentTable);
      }
    });

    return tables;
  };

  const parseMarkdown = (markdownContent) => {
    const tables = extractTableData(markdownContent);
    console.log(tables);
    if (tables.length === 0) {
      return;
    }
    let allChartsData = [];
    tables.forEach((table) => {
      let eachTableData = {
        options: {
          chart: {
            id: "basic-bar",
          },
          xaxis: {
            categories: table.rows.map((row) => row[0].text),
          },
        },

        series: table.headers.slice(1).map((header, index) => {
          console.log(
            table.rows
              .map((row) => row.slice(1).map((val) => val.text))
              .map((val) => val[index])
          );
          return {
            name: header.text,
            data: table.rows
              .map((row) => row.slice(1).map((val) => val.text))
              .map((val) => val[index]),
          };
        }),
      };
      allChartsData.push(eachTableData);
    });
    setChartsData(allChartsData);
  };

  const submit = () => {
    parseMarkdown(data);
  };

  return (
    <div>
      <h2>Enter .md text here</h2>
      <textarea
        cols={80}
        rows={20}
        onChange={(e) => setData(e.target.value)}
      ></textarea>
      <br />
      <button onClick={submit}>Submit</button>

      <hr />

      {chartsData &&
        chartsData.map((chartData, index) => {
          return (
            <Chart
              key={index}
              options={chartData.options}
              series={chartData.series}
              type="bar"
              width="1000"
              height="1000"
            />
          );
        })}
    </div>
  );
};
export default App;
