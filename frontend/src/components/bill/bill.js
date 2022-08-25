import React, { useState, useEffect } from "react";
import backenURL from "../../utils/backend";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  DialogContentText,
  DialogContent,
} from "@mui/material";
import {
  Grid,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
} from "@mui/material";
//icons
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
//imported pages
import GenerateBill from "./generateBill";

function Bill() {
  //selling orders data's
  const [myPreviousBills, setMyPreviousBills] = useState([]);
  // open (add new)/update selling order dialog box
  const [open, setOpen] = React.useState(false);
  // dialog contents of (add new)/update selling order dialog box
  const [dialogCotent, setDialogContent] = useState({});
  //open delete warning dialog box
  const [delOpen, setDelOpen] = React.useState(false);
  //delete content row info
  const [delContent, setDelContent] = useState({});

  //delete related functions
  const handleDelClickOpen = () => {
    setDelOpen(true);
  };

  const handleDelClose = () => {
    setDelOpen(false);
  };
  async function DeletePurchaseOrder() {
    const res = await fetch(backenURL+"/sellingOrder", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(delContent),
    });
    const data = await res.json();
    console.log(data);
    if (!data.error) {
      setMyPreviousBills(myPreviousBills.filter((x) => x.bill_no !== data.bill_no));
      handleDelClose();
    }
  }

  // add/update selling Order dialog box
  const handleClickOpen = (task, row) => {
    
      setDialogContent({ title: "Add New Selling Order", task });
      setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //function to add/update row in frontend

  function AddNewSellingOrder(error, newSellingOrder, task) {
    if (error) {
      //TODO: do needful to alert user about error
    } else {
        setMyPreviousBills(myPreviousBills.concat(newSellingOrder));
     
      handleClose();
      console.log("11")
    }
    console.log("12")
  }

  // function to get all list of Purchase Orders from database
  async function getMySellingOrders() {
    const res = await fetch(backenURL+"/sellingOrder", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(data.myPreviousOrders);
    setMyPreviousBills(data.myPreviousOrders);
    console.log("check 1");
  }

  useEffect(() => {
    getMySellingOrders();
  }, []);

  // Row componenet in Table
  function Row(props) {
    const { row } = props;
    const [open, setOpen] = useState(false);
    const products = row.product;
    const list = row.list;
    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.bill_no}
          </TableCell>
          <TableCell align="center">{row.customer[0].name}</TableCell>
          <TableCell align="center">{row.date}</TableCell>
          <TableCell align="center">{row.customer[0].mobile}</TableCell>
          <TableCell align="center">{row.total}</TableCell>
          <TableCell align="center">
            <IconButton
              onClick={() => {
                setDelContent(row);
                handleDelClickOpen();
              }}
            >
              <DeleteIcon color="error" />
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                {/*  start of product table */}

                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        
                        <TableCell align="right"> Price</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Cost</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {list.map((item, index) => (
                        <TableRow
                          key={products[index].p_id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {products[index].p_id}-{products[index].name}
                          </TableCell>
                          <TableCell align="right">
                            {" "}
                            {item.selling_price}
                          </TableCell>
                          
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">
                            {item.cost}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography>Discount:- {row.discount}</Typography>
           
                {/*  end of product table */}
              </Box>
              
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  //main return of this Purchase order page
  return (
    <>
      <Paper
        sx={{ p: 2, margin: "auto", marginTop: 4, maxWidth: 1050, flexGrow: 1 }}
      >
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Bill No</TableCell>
                <TableCell align="center">Customer Name</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Customer Mobile Number</TableCell>
                <TableCell align="center">Total</TableCell>

                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myPreviousBills.map((row) => (
                <Row key={row.bill_no} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Button
          sx={{ marginTop: 2 }}
          variant="outlined"
          onClick={() => handleClickOpen("Add")}
        >
          <AddIcon color="primary" />
          &nbsp; Add new Selling Order
        </Button>
        {/* dialog box for add/update selling order */}
        <Dialog fullScreen open={open} onClose={handleClose}>
          <Grid container>
            <Grid item xs={8}>
              <DialogTitle>{dialogCotent.title}</DialogTitle>
            </Grid>
            <Grid item xs={4}>
              <DialogActions>
                <IconButton onClick={handleClose}>
                  <CancelOutlinedIcon color="primary" />
                </IconButton>
              </DialogActions>
            </Grid>
          </Grid>

          <GenerateBill
          sx={{maxWidth:1000}}
            callback={AddNewSellingOrder}
            
          />
        </Dialog>

        {/*  dialog box for delete warning */}
        <Dialog
          open={delOpen}
          onClose={handleDelClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Delete Purchase Order"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete details of{" "}
              <b>{delContent.name}</b> ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDelClose}>No</Button>
            <Button onClick={DeletePurchaseOrder} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
}

export default Bill;

/*

*/
