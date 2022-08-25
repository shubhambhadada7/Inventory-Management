import {
  Box,
  Grid,
  Autocomplete,
  TextField,
  Typography,
  Button,
  Dialog, DialogActions, IconButton,DialogTitle
} from "@mui/material";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import React from "react";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import PurchaseList from "./purchaseList";
import VendorInsertPage from "../vendor/vendorInsert"
import ProductInsertPage from '../product/productInsert';
import backenURL from "../../utils/backend";
const re = /^[0-9\b]+$/;
function GeneratePurchaseOrder({callback}) {
  const [vendorList, setVendorList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [gst, setGST] = useState("");
  const [address, setAddress] = useState("");
  const [v_id, setV_id] = useState(-1);
  const [total, setTotal] = useState(0);

  const [openVendor, setOpenVendor] = React.useState(false);
  const [openNewProduct, setOpenNewProduct] = React.useState(false);
  const handleCloseVendor = () => {
    setOpenVendor(false);
  };
  function AddNewVendor(error, newVendor, task) {
    if (error) {
      //TODO: do needful to alert user about error
    }
    else {
      if (task === "Add") {
        console.log(newVendor)
        newVendor["label"] = newVendor.v_id.toString() + "-" + newVendor.name;
        setVendorList(vendorList.concat(newVendor))
      }
      
      handleCloseVendor();
    }

  }
  
  const handleCloseNewProduct = () => {
    setOpenNewProduct(false);
  };
  function AddNewProduct(error, newProduct, task) {
    if (error) {
      //TODO: do needful to alert user about error
    }
    else {
      if (task === "Add") {
        console.log(newProduct)
        newProduct["label"] = newProduct.p_id.toString() + "-" + newProduct.name;
        setProductList(productList.concat(newProduct))
      }
      
      handleCloseNewProduct();
    }

  }


  function getToday() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  const [date, setDate] = useState(getToday());
  const [purchaseList, setPurchaseList] = useState([
    {
      pid: -1,
      quantity: 0,
      buying_price: 0,
      selling_price: 0,
      total: 0,
      label: "",
    },
  ]);
  async function preRequisites() {
    const res = await fetch(
      "/purchaseorder/prerequisite",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();

    data.vendorList.forEach((vendor) => {
      vendor["label"] = vendor.v_id.toString() + "-" + vendor.name;
    });
    data.productList.forEach((product) => {
      product["label"] = product.p_id.toString() + "-" + product.name;
    });
    console.log(data);
    setVendorList(data.vendorList);
    setProductList(data.productList);
  }
  useEffect(() => {
    preRequisites();
  }, []);

  function setVendorValues(val) {
    console.log(val);
    if (val !== "-1") {
      var vid = val.split("-")[0];
      const myvendor = vendorList.find((vend) => vend.v_id.toString() === vid);
      console.log(myvendor);
      setAddress(myvendor.address);
      setGST(myvendor.gst);
      setV_id(vid);
    } else {
      setAddress("");
      setGST("");
      setV_id(-1);
    }
  }

  function addNewPL() {
    setPurchaseList([
      ...purchaseList,
      {
        pid: -1,
        quantity: 0,
        buying_price: 0,
        selling_price: 0,
        total: 0,
        label: "",
      },
    ]);
    // console.log(purchaseList)
  }
  function setPL(index, myHTML) {
    //console.log(myHTML);
    let data = [...purchaseList];
    if (myHTML.name === "pid") {
      if (myHTML.tagName === "LI") {
        var p_id = myHTML.innerHTML.split("-")[0];
        data[index][myHTML.name] = parseInt(p_id);
        data[index].label = myHTML.innerHTML;
      } else if (myHTML.tagName === "INPUT") {
        console.log(myHTML.label);
        console.log(myHTML);
        console.log(myHTML.getAttributeNode("value").value);
      } else {
        data[index][myHTML.name] = -1;
      }
    } else {
      const myProduct = productList.findIndex(
        (pd) => pd.p_id === data[index].pid
      );
      console.log(myProduct);
      var curTotal = total - data[index].total;
      if (myHTML.value === "") {
        data[index][myHTML.name] = 0;
      } else if (
        (!productList[myProduct].unit || myHTML.name !== "quantity") &&
        !Number.isNaN(myHTML.value)
      ) {
        data[index][myHTML.name] = myHTML.value;
        data[index].total = data[index].buying_price * data[index].quantity;
      } else if (productList[myProduct].unit && re.test(myHTML.value)) {
        data[index][myHTML.name] = parseInt(myHTML.value);
        data[index].total = data[index].buying_price * data[index].quantity;
      }
      curTotal += data[index].total;
      setTotal(curTotal);
    }

    setPurchaseList(data);
  }
  function deletePL(index) {
    console.log(index);
    let data = [...purchaseList];
    var newData = [];
    for (let i = 0; i < data.length; i++) {
      console.log(i);
      if (i !== index) {
        newData = newData.concat(data[i]);
      }
    }
    console.log(newData);
    setPurchaseList(newData);
    // console.log(purchaseList)
  }
  async function submitPurchase() {
    let data = [...purchaseList];
    var flag = true;
    const mySet = new Set();
    mySet.clear()
    if (total <= 0) {
      console.log("total can't be zero");
      return;
    }
    if (!v_id) {
      console.log("enter details properly");
    }
    console.log(data)
    data.forEach((listItem) => {
      if (listItem.pid === -1) {
        console.log("Error: Each item must be filled else delete that field ");
        flag = false;
        return;
      }
      if (mySet.has(listItem.pid)) {
        console.log("Error: one single entry for each item only");
        flag = false;
        return;
      }

      mySet.add(listItem.pid);
      listItem.p_id = listItem.pid;
    });
    if (!flag) {
      return;
    }
    console.log("All Ok");
    var list=[]
    data.forEach((item)=>{
      item.p_id=item.pid
      delete item.pid
      delete item.label
      list=list.concat(item)
      console.log(item)
    })
    console.log(list)
    const res = await fetch(backenURL+"/purchaseorder", {
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ v_id,date,total,list }),
    });
    const Resdata = await res.json();
    
    Resdata.purchase.vendor=[vendorList.find((vend) => vend.v_id === Resdata.purchase.v_id)]
    var ResProduct = []
    Resdata.purchase.list.forEach((item)=>{
      ResProduct=ResProduct.concat(productList[productList.findIndex((y)=>y.p_id===item.p_id)])
    })

    Resdata.purchase.product=ResProduct
    callback(undefined,Resdata.purchase,"Add")
  }
  return (
    <>
    
      
      <Box sx={{ p: 2, margin: 'auto', maxWidth: 850, flexGrow: 1 }}>
      <Grid sx={{ marginBottom: 2 }} container spacing={2}>
    <Grid item xs={4}>
    <Button
              variant="contained"
              endIcon={<AddIcon />}
              onClick={() => setOpenVendor(true)}
            >
              Add New Vendor
            </Button>
    </Grid>
      
    <Grid item xs={4}>
    <Button
              variant="contained"
              endIcon={<AddIcon />}
              onClick={() => setOpenNewProduct(true)}
            >
              Add New Product
            </Button>
    </Grid>  
    </Grid>
        <Grid sx={{ marginBottom: 2 }} container spacing={2}>
          <Grid item xs={6}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={vendorList}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Vendor" />}
              onChange={(e) =>
                e.target.tagName === "LI" || e.target.tagName === "INPUT"
                  ? setVendorValues(e.target.innerHTML)
                  : setVendorValues("-1")
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="date"
              label="Date"
              type="date"
              value={date}
              sx={{ width: 220 }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              m={1}
              id="outlined-basic"
              label="GST"
              variant="outlined"
              fullWidth
              value={gst}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={10}>
            <TextField
              m={1}
              id="outlined-basic"
              multiline
              rows={1}
              label="Address"
              variant="outlined"
              fullWidth
              value={address}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
        <Grid sx={{ marginBottom: 2 }} container spacing={2}>
          {purchaseList.map((pl, index) => {
            return (
              <PurchaseList
                productList={productList}
                key={index}
                index={index}
                values={pl}
                setPL={setPL}
                deletePL={deletePL}
              />
            );
          })}

          <Grid item xs={3}>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              onClick={() => addNewPL()}
            >
              Add
            </Button>
          </Grid>
        </Grid>
        <Typography variant="h6" gutterBottom component="div">
          Grand Total:&nbsp;&nbsp;{total}/-&nbsp;Rs.
        </Typography>
        <Button
          sx={{ marginTop: 1 }}
          variant="contained"
          endIcon={<SaveIcon />}
          onClick={() => submitPurchase()}
        >
          Save
        </Button>
      </Box>
      <Dialog open={openVendor} onClose={handleCloseVendor}>
          <Grid container >
            <Grid item xs={8}>

              <DialogTitle> Add New Vendor </DialogTitle>

            </Grid>
            <Grid item xs={4}>

              <DialogActions>
                <IconButton onClick={handleCloseVendor} >
                  <CancelOutlinedIcon color='primary' />
                </IconButton>
              </DialogActions>

            </Grid>
          </Grid>


          <VendorInsertPage callback={AddNewVendor}  task="Add" />

        </Dialog>


        <Dialog open={openNewProduct} onClose={handleCloseNewProduct}>
          <Grid container >
            <Grid item xs={8}>

              <DialogTitle> Add New Product </DialogTitle>

            </Grid>
            <Grid item xs={4}>

              <DialogActions>
                <IconButton onClick={handleCloseNewProduct} >
                  <CancelOutlinedIcon color='primary' />
                </IconButton>
              </DialogActions>

            </Grid>
          </Grid>


          <ProductInsertPage callback={AddNewProduct}  task="Add" />

        </Dialog>
    </>
  );
}

export default GeneratePurchaseOrder;
