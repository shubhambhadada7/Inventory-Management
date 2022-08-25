import React, { useState, useEffect } from 'react';
import {   IconButton, Table, TableBody, TableCell, DialogContentText, DialogContent } from '@mui/material';
import { Grid, TableContainer, TableHead, TableRow,  Paper, Dialog, DialogActions, DialogTitle, Button } from '@mui/material';
//icons
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
//imported pages
import CustomerInsertPage from './customerInsert';
import backenURL from '../../utils/backend';

function CustomerPage() {

  //customer data's
  const [mycustomers, setMyCustomers] = useState([])
  // open (add new)/update customer dialog box 
  const [open, setOpen] = React.useState(false);
  // dialog contents of (add new)/update customer dialog box 
  const [dialogCotent, setDialogContent] = useState({})
  //open delete warning dialog box
  const [delOpen, setDelOpen] = React.useState(false);
  //delete content row info
  const [delContent, setDelContent] = useState({})


  //delete related functions
  const handleDelClickOpen = () => {
    setDelOpen(true);
  };

  const handleDelClose = () => {
    setDelOpen(false);
  };
  async function DeleteCustomer() {
    const res = await fetch(backenURL+'/customer',
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(delContent)
      })
    const data = await res.json()
    console.log(data);
    if (!data.error) {
      setMyCustomers(mycustomers.filter((x) =>  x.c_id !== data.c_id ));
      handleDelClose()
    }
  }

  // add/update customer dialog box
  const handleClickOpen = (task, row) => {
    if (task === "Add") {
      setDialogContent({ title: "Add New Customer", task })
    } else if (task === "Update") {

      setDialogContent({ title: "Update Customer", row, task })
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //function to add/update row in frontend

  function AddNewCustomer(error, newCustomer, task) {
    if (error) {
      //TODO: do needful to alert user about error
    }
    else {
      if (task === "Add") {
        setMyCustomers(mycustomers.concat(newCustomer))
      }
      else if (task === "Update") {
        var UpdatedMyCustomer = []
        console.log(newCustomer)
        mycustomers.forEach((row) => {
          if (row.c_id === newCustomer.c_id) {
            UpdatedMyCustomer = UpdatedMyCustomer.concat(newCustomer)
          }
          else {
            UpdatedMyCustomer = UpdatedMyCustomer.concat(row)
          }
        })
        setMyCustomers(UpdatedMyCustomer)

      }
      handleClose();
    }

  }

  // function to get all list of customers in database
  async function getMyCustomer() {
    const res = await fetch(backenURL+'/customer',
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },

      })
    const data = await res.json()
    console.log(data.myCustomer);
    setMyCustomers(data.myCustomer);
    console.log('check 1')
  }

  useEffect(() => {
    getMyCustomer()
  }, [])

  // Row componenet in Table
  function Row(props) {
    const { row } = props;

    return (

      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          
          
          <TableCell align="center">{row.name}</TableCell>
          <TableCell align="center">{row.mobile}</TableCell>
         
          <TableCell align='center'>
            <IconButton onClick={() => { handleClickOpen("Update", row) }}>
              <EditIcon color="secondary" />
            </IconButton>
            <IconButton onClick={() => { setDelContent(row); handleDelClickOpen() }}>
              <DeleteIcon color="error" />
            </IconButton>
          </TableCell>
        </TableRow>
      </React.Fragment>


    );
  }


    //main return of this customer page
  return (
    <>
      <Paper sx={{ p: 2, margin: 'auto', marginTop: 4, maxWidth: 1050, flexGrow: 1 }}>

        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Mobile Number</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mycustomers.map((row) => (
                <Row key={row.c_id} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Button sx={{ marginTop: 2 }} variant="outlined" onClick={() => handleClickOpen("Add")}>
          <AddIcon color='primary' />&nbsp; Add new Customer
        </Button>
        {/* dialog box for add/update customer */}
        <Dialog open={open} onClose={handleClose}>
          <Grid container >
            <Grid item xs={8}>

              <DialogTitle>{dialogCotent.title}</DialogTitle>

            </Grid>
            <Grid item xs={4}>

              <DialogActions>
                <IconButton onClick={handleClose} >
                  <CancelOutlinedIcon color='primary' />
                </IconButton>
              </DialogActions>

            </Grid>
          </Grid>


          <CustomerInsertPage callback={AddNewCustomer} row={dialogCotent.row} task={dialogCotent.task} />

        </Dialog>

              {/*  dialog box for delete warning */}
        <Dialog
          open={delOpen}
          onClose={handleDelClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Delete Customer"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete details of <b>{delContent.name}</b> ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDelClose}>No</Button>
            <Button onClick={DeleteCustomer} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>

      </Paper>
    </>
  );
}

export default CustomerPage;
