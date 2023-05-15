import * as React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import instance from "../firebase/instance";

import "devextreme/dist/css/dx.light.css";

import {
  DataGrid,
  Column,
  FilterRow,
  SearchPanel,
  GroupPanel,
  RequiredRule,
  Editing,
  MasterDetail,
} from "devextreme-react/data-grid";

import { Fragment } from "react";

import { Toast } from "react-bootstrap";

function Products() {
  const [products, setProducts] = useState([]);

  const [newCode, setNewCode] = useState("");
  const [newPrice, setNewPrice] = useState();

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

  const addProduct = async () => {
    const info = {
      code: newCode,
      price: newPrice,
    };

    await instance.post("/products.json", info).then((res) => res);

    setNewCode("");
    setNewPrice("");

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

  const deleteProduct = async (e) => {
    const id = e.key;
    await instance.delete(`/products/${id}.json`).then((res) => id);
  };

  const updateProduct = async (e) => {
    const id = e.key;
    await instance.put(`/products/${id}.json`, e.data).then((res) => id);
  };

  const [showToast, setShowToast] = useState(false);

  function handleSaved() {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  }

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
          label="Code"
          value={newCode}
          helperText="Please set product code"
          required
          variant="outlined"
          onChange={(e) => {
            setNewCode(e.target.value);
          }}
        />
        <TextField
          id="outlined-basic"
          label="Price"
          value={newPrice}
          helperText="Please set product price"
          required
          variant="outlined"
          type="number"
          onChange={(e) => {
            setNewPrice(e.target.value);
          }}
        />

        <Button variant="contained" color="primary" onClick={addProduct}>
          Add Product
        </Button>
      </Box>
      <div className="App">
        <DataGrid
          dataSource={products}
          allowColumnReordering={true}
          columnAutoWidth={true}
          keyExpr="id"
          showBorders={true}
          onRowRemoved={deleteProduct}
          onRowUpdated={updateProduct}
          onSaved={handleSaved}
          style={{
            position: "relative",
          }}
        >
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "deepskyblue",
              color: "inherit",
              padding: "10px 20px",
              fontSize: "20px",
              borderRadius: "5px",
              zIndex: "2",
            }}
          >
            <Toast.Header>
              <strong>Success</strong>
            </Toast.Header>
            <Toast.Body>Edits saved successfully!</Toast.Body>
          </Toast>
          <SearchPanel visible={true} />
          <FilterRow visible={true} />
          <GroupPanel visible={true} />

          <Column dataField="id" allowEditing={false}></Column>
          <Column dataField="code">
            <RequiredRule />
          </Column>
          <Column dataField="price">
            <RequiredRule />
          </Column>
          <Editing
            mode="row" /*{buttons}*/
            useIcons={true}
            allowUpdating={true}
            allowDeleting={true}
          />
          <Column type="buttons" width={150}>
            <Button name="edit" />
            <Button name="delete" />
          </Column>
        </DataGrid>
      </div>
    </Fragment>
  );
}

export default Products;
