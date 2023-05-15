import React from "react";
import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import instance from "../firebase/instance";

import "devextreme/dist/css/dx.light.css";

import { Toast } from "react-bootstrap";

import {
  DataGrid,
  Column,
  FilterRow,
  SearchPanel,
  GroupPanel,
  RequiredRule,
  Editing,
} from "devextreme-react/data-grid";

import { Fragment } from "react";

function Clients() {
  const [clients, setClients] = useState([]);

  const [newNum, setNewNum] = useState();
  const [newFN, setNewFN] = useState("");
  const [newLN, setNewLN] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newGender, setNewGender] = useState("");

  useEffect(() => {
    const getClients = async () => {
      const fetchedData = await instance.get("/clients.json");

      const array = [];
      for (let key in fetchedData.data) {
        array.push({
          id: key,
          num: fetchedData.data.num,
          firstName: fetchedData.data.firstName,
          lastName: fetchedData.data.lastName,
          age: fetchedData.data.age,
          gender: fetchedData.data.gender,
          // fullName:
          //   fetchedData.data.firstName.toString() +
          //   fetchedData.data.lastName.toString(),
          ...fetchedData.data[key],
        });
      }
      setClients(array);
    };
    getClients();
  }, []);

  const gender = [
    { value: "male", label: "♂" },
    {
      value: "female",
      label: "♀",
    },
  ];

  const addClient = async () => {
    const info = {
      num: newNum,
      firstName: newFN,
      lastName: newLN,
      age: newAge,
      gender: newGender,
    };

    await instance.post("/clients.json", info).then((res) => res);

    setNewNum("");
    setNewFN("");
    setNewLN("");
    setNewAge("");
    setNewGender("");
    const fetchedData = await instance.get("/clients.json");

    const array = [];
    for (let key in fetchedData.data) {
      array.push({
        id: key,
        num: fetchedData.data.num,
        firstName: fetchedData.data.firstName,
        lastName: fetchedData.data.lastName,
        age: fetchedData.data.age,
        gender: fetchedData.data.gender,
        // fullName:
        //   fetchedData.data.firstName.toString() +
        //   fetchedData.data.lastName.toString(),
        ...fetchedData.data[key],
      });
    }
    setClients(array);
  };

  const deleteClient = async (e) => {
    const id = e.key;
    await instance.delete(`/clients/${id}.json`).then((res) => id);
  };

  const updateClient = async (e) => {
    const id = e.key;
    await instance.put(`/clients/${id}.json`, e.data).then((res) => id);
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
          label="Num"
          value={newNum}
          type="number"
          required
          helperText="Please set client number"
          variant="outlined"
          onChange={(e) => {
            setNewNum(e.target.value);
          }}
        />
        <TextField
          id="outlined-basic"
          label="First Name"
          value={newFN}
          required
          helperText="Please set client first name"
          variant="outlined"
          onChange={(e) => {
            setNewFN(e.target.value);
          }}
        />
        <TextField
          id="outlined-basic"
          label="Last Name"
          value={newLN}
          required
          helperText="Please set client last name"
          variant="outlined"
          onChange={(e) => {
            setNewLN(e.target.value);
          }}
        />
        <TextField
          id="outlined-basic"
          label="Age"
          value={newAge}
          required
          helperText="Please set client age"
          type="number"
          variant="outlined"
          onChange={(e) => {
            setNewAge(e.target.value);
          }}
        />
        <TextField
          id="outlined-select-currency"
          select
          label="Select"
          required
          helperText="Please select client gender"
          onChange={(e) => {
            setNewGender(e.target.value);
          }}
        >
          {gender.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" color="primary" onClick={addClient}>
          Add Client
        </Button>
      </Box>
      <div className="App">
        <DataGrid
          dataSource={clients}
          allowColumnReordering={true}
          columnAutoWidth={true}
          keyExpr="id"
          showBorders={true}
          onRowRemoved={deleteClient}
          onRowUpdated={updateClient}
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
              zIndex: "1",
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
          <Column dataField="num">
            <RequiredRule />
          </Column>
          <Column dataField="firstName">
            <RequiredRule />
          </Column>
          <Column dataField="lastName">
            <RequiredRule />
          </Column>
          <Column dataField="age">
            <RequiredRule />
          </Column>
          <Column dataField="gender">
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

export default Clients;
