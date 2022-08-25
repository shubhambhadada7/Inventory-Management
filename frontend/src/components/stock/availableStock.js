import React, { useState, useEffect } from 'react';
import {  Table, TableBody, TableCell, Typography } from '@mui/material';
import { TableContainer, TableHead, TableRow,  Paper } from '@mui/material';
import backenURL from '../../utils/backend';




function AvailableStock(){
    
  //customer data's
  const [myStock, setMyStock] = useState([])

  // function to get all list of customers in database
  async function getMyStock() {
    const res = await fetch(backenURL+'/stock',
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },

      })
    const data = await res.json()
    console.log(data.stock);
    setMyStock(data.stock);
    console.log('check 1')
  }

  useEffect(() => {
    getMyStock()
  }, [])

  // Row componenet in Table
  function Row(props) {
    const { row } = props;

    return (

      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          
          
          <TableCell align="center">{row.product[0].p_id+"-"+row.product[0].name}</TableCell>
          <TableCell align="center">{row.buying_price}</TableCell>
          <TableCell align="center">{row.quantity}</TableCell>
          <TableCell align="center">{row.selling_price}</TableCell>
          <TableCell align="center">{row.vendor[0].v_id+"-"+row.vendor[0].name}</TableCell>
          <TableCell align="center">{row.pod_id}</TableCell>
        </TableRow>
      </React.Fragment>


    );
  }


    //main return of this customer page
  return (
    <>
      <Paper sx={{ p: 2, margin: 'auto', marginTop: 4, maxWidth: 1050, flexGrow: 1 }}>
        <Typography variant='h3' sx={{marginBottom:2}} gutterbutton>Current Stock</Typography>
        <TableContainer sx={{boxShadow:10}} component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell align="center">product</TableCell>
                <TableCell align="center">Buying Price</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="center">Selling Price</TableCell>
                <TableCell align="center">Vendor</TableCell>
                <TableCell align="center">Order ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myStock.map((row) => (
                <Row key={row.p_id} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </Paper>
    </>
  );
}

export default AvailableStock;