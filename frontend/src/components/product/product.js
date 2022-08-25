import React, { useState, useEffect } from 'react';
import { Box, Collapse, IconButton, Table, TableBody, TableCell, DialogContentText, DialogContent } from '@mui/material';
import { Grid, TableContainer, TableHead, TableRow, Typography, Paper, Dialog, DialogActions, DialogTitle, Button } from '@mui/material';
//icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
//imported pages
import ProductInsertPage from './productInsert';
import backenURL from '../../utils/backend';

function ProductPage() {

  //product data's
  const [myproducts, setMyProducts] = useState([])
  // open (add new)/update product dialog box 
  const [open, setOpen] = React.useState(false);
  // dialog contents of (add new)/update product dialog box 
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
  async function DeleteProduct() {
    const res = await fetch(backenURL+'/product',
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
      setMyProducts(myproducts.filter((x) =>  x.p_id !== data.p_id ));
      handleDelClose()
    }
  }

  // add/update product dialog box
  const handleClickOpen = (task, row) => {
    if (task === "Add") {
      setDialogContent({ title: "Add New Product", task })
    } else if (task === "Update") {

      setDialogContent({ title: "Update Product", row, task })
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //function to add/update row in frontend

  function AddNewProduct(error, newProduct, task) {
    if (error) {
      //TODO: do needful to alert user about error
    }
    else {
      if (task === "Add") {
        setMyProducts(myproducts.concat(newProduct))
      }
      else if (task === "Update") {
        var UpdatedMyProducts = []

        myproducts.forEach((row) => {
          if (row.p_id === newProduct.p_id) {
            UpdatedMyProducts = UpdatedMyProducts.concat(newProduct)
          }
          else {
            UpdatedMyProducts = UpdatedMyProducts.concat(row)
          }
        })
        setMyProducts(UpdatedMyProducts)

      }
      handleClose();
    }

  }

  // function to get all list of products in database
  async function getMyProducts() {
    const res = await fetch(backenURL+'/product',
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },

      })
    const data = await res.json()
    console.log(data.myProduct);
    setMyProducts(data.myProduct);
    console.log('check 1')
  }

  useEffect(() => {
    getMyProducts()
  }, [])

  // Row componenet in Table
  function Row(props) {
    const { row } = props;
    const [open, setOpen] = useState(false);

    return (

      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
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
            {row.p_id}
          </TableCell>
          <TableCell align="center">{row.name} (/{row.default_unit})</TableCell>
          <TableCell align='center'>
            <IconButton onClick={() => { handleClickOpen("Update", row) }}>
              <EditIcon color="secondary" />
            </IconButton>
            <IconButton onClick={() => { setDelContent(row); handleDelClickOpen() }}>
              <DeleteIcon color="error" />
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom >
                  Description:-
                </Typography>
                <Typography variant="small" gutterBottom >
                  {row.description}
                </Typography>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>


    );
  }


    //main return of this product page
  return (
    <>
      <Paper sx={{ p: 2, margin: 'auto', marginTop: 4, maxWidth: 1050, flexGrow: 1 }}>

        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Product ID</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myproducts.map((row) => (
                <Row key={row.p_id} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Button sx={{ marginTop: 2 }} variant="outlined" onClick={() => handleClickOpen("Add")}>
          <AddIcon color='primary' />&nbsp; Add new Product
        </Button>
        {/* dialog box for add/update product */}
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


          <ProductInsertPage callback={AddNewProduct} row={dialogCotent.row} task={dialogCotent.task} />

        </Dialog>

              {/*  dialog box for delete warning */}
        <Dialog
          open={delOpen}
          onClose={handleDelClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Delete Product"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete details of <b>{delContent.name}</b> ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDelClose}>No</Button>
            <Button onClick={DeleteProduct} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>

      </Paper>
    </>
  );
}

export default ProductPage;
