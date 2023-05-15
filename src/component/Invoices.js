import { useState, useEffect } from "react";
import instance from "../firebase/instance";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

import { Fragment } from "react";

import "devextreme/dist/css/dx.light.css";

import {
  DataGrid,
  Column,
  SearchPanel,
  RequiredRule,
  Editing,
} from "devextreme-react/data-grid";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);

  const [newNumCli, setNewNumCli] = useState();

  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    const getInvoices = async () => {
      const fetchedData = await instance
        .get("/invoices.json")
        .then((response) => {
          const invoices = response.data;
          const formattedData = [];

          for (let key in invoices) {
            const invoice = {
              id: key,
              numCli: invoices[key].numCli,
            };

            const products = invoices[key].products.map((product) => ({
              code: product.code,
              price: product.price,
              quantity: product.quantity,
              cost: product.cost,
            }));

            products.forEach((product) => {
              formattedData.push({
                id: invoice.id,
                ...invoice,
                ...product,
              });

              invoice.id = null; // set to null for subsequent products
              invoice.numCli = null; // set to null for subsequent products
            });
          }
          setInvoices(formattedData);
        });
    };
    getInvoices();
  }, []);

  // useEffect for clients

  useEffect(() => {
    const getClients = async () => {
      const fetchedData = await instance.get("/clients.json");

      const array = [];
      for (let key in fetchedData.data) {
        array.push({
          id: key,
          ...fetchedData.data[key],
        });
      }
      setClients(array.map((ele) => ele.num));
    };
    getClients();
  }, []);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setNewNumCli(event.target.value);
  };

  //useEffect for products
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const fetchedData = await instance.get("/products.json");

      const array = [];
      for (let key in fetchedData.data) {
        array.push({
          id: key,
          code: fetchedData.data.code,
          price: fetchedData.data.price,
          ...fetchedData.data[key],
        });
      }
      setProducts(array);
    };
    getProducts();
  }, []);

  //////////////////////////////////

  const addInvoice = async () => {
    const info = {
      numCli: newNumCli,
      products: selectedRow,
    };

    await instance.post("/invoices.json", info).then((res) => res);

    setNewNumCli("");
    setSelectedOption("");

    const fetchedData = await instance
      .get("/invoices.json")
      .then((response) => {
        const invoices = response.data;
        const formattedData = [];

        for (let key in invoices) {
          const invoice = {
            id: key,
            numCli: invoices[key].numCli,
          };

          const products = invoices[key].products.map((product) => ({
            code: product.code,
            price: product.price,
            quantity: product.quantity,
            cost: product.cost,
          }));

          products.forEach((product) => {
            formattedData.push({ ...invoice, ...product });
            invoice.id = null; // set to null for subsequent products
            invoice.numCli = null; // set to null for subsequent products
          });
        }
        setInvoices(formattedData);
      });
  };
  const [selectedRow, setSelectedRow] = useState([]);

  // const handleSelectionChanged = (selectedRowsData) => {
  //   if (selectedRowsData.selectedRowsData.length > 0) {
  //     setSelectedRow(selectedRowsData.selectedRowsData);
  //   } else {
  //     setSelectedRow(null);
  //   }
  // };

  const handleSelectionChanged = (selectedRowsData) => {
    if (selectedRowsData.selectedRowsData.length > 0) {
      const updatedSelectedRowsData = selectedRowsData.selectedRowsData.map(
        (row) => ({
          ...row,
          quantity: row.quantity != null ? row.quantity : 1,
          cost: row.quantity != null ? row.price * row.quantity : row.price,
        })
      );
      setSelectedRow(updatedSelectedRowsData);
    } else {
      setSelectedRow(null);
    }
  };

  /////////////// delete invoice /////////////////////
  const deleteInvoice = async (e) => {
    const id = e.key;
    await instance.delete(`/invoices/${id}.json`).then((res) => id);
  };

  ////////////////////////update invoice/////////////////////
  const updateInvoice = async (e) => {
    const id = e.key;
    await instance.put(`/invoices/${id}.json`, e.data).then((res) => id);

    /////////////////////////////
  };

  // const columns = [
  //   { datafield: "id", caption: "ID" },
  //   {
  //     dataField: "numCli",
  //     caption: "Client Number",
  //   },
  //   {
  //     dataField: "code",
  //     caption: "Code",
  //   },
  //   {
  //     dataField: "price",
  //     caption: "Price",
  //   },
  //   {
  //     dataField: "quantity",
  //     caption: "Quantity",
  //   },
  //   {
  //     dataField: "cost",
  //     caption: "Cost",
  //   },
  // ];

  const [newInvKey, setNewInvKey] = useState("");

  return (
    <Fragment>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch", marginTop: "20px" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-basic"
          label="Client Number"
          required
          helperText="Please select Client Number"
          variant="outlined"
          select
          value={selectedOption}
          onChange={handleOptionChange}
          SelectProps={{
            displayEmpty: true,
          }}
        >
          {clients.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <div>
        {selectedOption ? (
          <>
            <TextField
              id="outlined-basic"
              label="Invoice key"
              value={newInvKey}
              helperText="Please set invoice key"
              required
              variant="outlined"
              onChange={(e) => {
                setNewInvKey(e.target.value);
              }}
            ></TextField>

            <DataGrid
              dataSource={products}
              allowColumnReordering={true}
              columnAutoWidth={true}
              keyExpr="id"
              showBorders={true}
              selectByRowClick={false}
              onSelectionChanged={handleSelectionChanged}
              selection={{ mode: "multiple" }}
            >
              <SearchPanel visible={true} />
              <Editing mode="row" useIcons={true} allowUpdating={true} />
              <Column
                dataField="code"
                dataType="number"
                allowEditing={false}
              ></Column>
              <Column dataField="price" allowEditing={false}></Column>
              <Column
                dataField="quantity"
                dataType={Number}
                allowEditing={true}
                calculateCellValue={function (data) {
                  return data.quantity != null ? data.quantity : 1;
                }}
                value={0}
              ></Column>
              <Column
                dataField="cost"
                calculateCellValue={function (data) {
                  return data.quantity != null
                    ? data.price * data.quantity
                    : data.price;
                }}
              ></Column>
            </DataGrid>
          </>
        ) : null}
      </div>
      <Box>
        <Button variant="contained" color="primary" onClick={addInvoice}>
          Add Invoice
        </Button>
      </Box>

      <DataGrid
        dataSource={invoices}
        allowColumnReordering={true}
        columnAutoWidth={true}
        keyExpr="id"
        showBorders={true}
        onRowRemoved={deleteInvoice}
        onRowUpdated={updateInvoice}
      >
        <SearchPanel visible={true} />
        <Editing
          mode="row" /*{buttons}*/
          useIcons={true}
          allowUpdating={true}
          allowDeleting={true}
        />
        <Column dataField="id">
          <RequiredRule />
        </Column>
        <Column dataField="numCli">
          <RequiredRule />
        </Column>
        <Column dataField="code">
          <RequiredRule />
        </Column>
        <Column dataField="price">
          <RequiredRule />
        </Column>
        <Column dataField="quantity">
          <RequiredRule />
        </Column>
        <Column dataField="cost">
          <RequiredRule />
        </Column>
      </DataGrid>
    </Fragment>
  );
}

export default Invoices;
