import React from "react";
import ReactDOM from "react-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import _ from "lodash";

import { Button, ButtonToolbar } from "react-bootstrap";

import "./styles.css";

let data = [];
let nextGroup = 0;
for (let i = 0; i < 100000; i++) {
  if (i % 2 === 0) {
    nextGroup++;
  }
  data.push({
    id: i,
    name: `Thing ${i}`,
    dataGroup: `group-${nextGroup}`,
    value: _.random(5000)
  });
}

const getRowNodeId = n => `${n.id}-${n.dataGroup}`;

const columnDefs = [
  {
    field: "dataGroup",
    enableRowGroup: true,
    rowGroup: true,
    hide: true
  },
  {
    field: "id",
    headerName: "ID",
    filter: "agTextColumnFilter"
  },
  {
    field: "name",
    headerName: "Name",
    filter: "agTextColumnFilter"
  },
  {
    field: "value",
    headerName: "Value"
  }
];

const autoGroupColumnDef = {
  pinned: "left",
  valueGetter: ({ node, data }) => {
    if (!node.group) {
      return data.dataGroup;
    }

    return "";
  }
};

function getContextMenuItems(params) {
  return params.defaultItems.filter(item => item !== "toolPanel");
}

function getMainMenuItems(params) {
  return params.defaultItems.filter(item => item !== "toolPanel");
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data,
      indexUpdated: null,
      newValue: null,
      selected: []
    };
  }

  handleUpdate = e => {
    e.preventDefault();
    const newData = [...this.state.data];
    const indexUpdated = _.random(this.state.data.length);
    const newValue = _.random(5000);

    newData[indexUpdated].value = newValue;

    this.setState({
      indexUpdated,
      newValue,
      data: newData
    });
  };

  handleDelete = e => {
    e.preventDefault();
    let { data } = this.state;

    let random = Math.floor(Math.random() * data.length);
    let newData = [...data];
    newData.splice(random, 1);

    this.setState({
      data: newData
    });
  };

  render() {
    let { data, indexUpdated, newValue } = this.state;

    return (
      <div className="ag-theme-balham">
        <h1>Large Data Update Test</h1>
        <ButtonToolbar style={{ margin: "8px 2px" }}>
          <Button bsStyle="primary" bsSize="small" onClick={this.handleUpdate}>
            Random Update
          </Button>
          <Button bsStyle="danger" bsSize="small" onClick={this.handleDelete}>
            Delete
          </Button>
        </ButtonToolbar>
        {newValue &&
          indexUpdated &&
          `Updated value at index ${indexUpdated} to ${newValue}`}
        <span>Total number of rows: {data.length}</span>
        <AgGridReact
          autoGroupColumnDef={autoGroupColumnDef} // Allows us to fiddle with the auto group column info, i.e. to pin it etc.
          columnDefs={columnDefs}
          deltaRowDataMode
          enableColResize
          enableFilter
          enableSorting
          getContextMenuItems={getContextMenuItems}
          getMainMenuItems={getMainMenuItems}
          getRowNodeId={getRowNodeId}
          gridOptions={{
            accentedSort: true,
            headerHeight: 30
          }}
          rowData={data}
          rowHeight="35"
          suppressAggFuncInHeader
          toolPanelSuppressSideButtons
        />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
