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
  import ItemList from "./itemList";
  import CustomerInsertPage from "../customer/customerInsert"
import backenURL from "../../utils/backend";
  const re = /^[0-9\b]+$/;
  function GenerateSellingOrder({callback}) {
    const [customerList, setCustomerList] = useState([]);
    const [productList, setProductList] = useState([]);
    const [c_id, setC_id] = useState(-1);
    const [mobile,setMobile]=useState("")
    const [total, setTotal] = useState(0);
  
    const [openCustomer, setOpenCustomer] = React.useState(false);
    const[discount,setDiscount]=useState(0);

    const handleCloseCustomer = () => {
      setOpenCustomer(false);
    };

    function AddNewCustomer(error, newCustomer, task) {
        console.log(error+" - "+newCustomer+" - "+task);
      if (error) {
        //TODO: do needful to alert user about error
      }
      else {
        if (task === "Add") {
          console.log(newCustomer)
          newCustomer["label"] = newCustomer.c_id.toString() + "-" + newCustomer.name;
          setCustomerList(customerList.concat(newCustomer))
        }
        
        handleCloseCustomer();
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
        p_id: -1,
        quantity: 0,
        selling_price: 0,
        cost: 0,
        label: "",
      },
    ]);

    async function preRequisites() {
      const res = await fetch(
        "/sellingOrder/prerequisite",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
  
      data.customerList.forEach((customer) => {
        customer["label"] = customer.c_id.toString() + "-" + customer.name;
      });
      data.productList.forEach((product) => {
        product["label"] = product.p_id.toString() + "-" + product.product[0].name;
      });
      console.log(data);
      setCustomerList(data.customerList);
      setProductList(data.productList);
    }
    useEffect(() => {
      preRequisites();
    }, []);
  

    function setCustomerValues(val) {
      console.log(val);
      if (val !== "-1") {
        var c_id = val.split("-")[0];
        const myCustomer = customerList.find((cust) => cust.c_id.toString() === c_id);
        console.log(myCustomer);
        setMobile(myCustomer.mobile);
        setC_id(c_id);
      } else {
        setMobile("");
        setC_id(-1);
      }
    }
  
    function addNewPL() {
      setPurchaseList([
        ...purchaseList,
        {
          p_id: -1,
          quantity: 0,
          selling_price: 0,
          cost: 0,
          label: "",
        },
      ]);
      // console.log(purchaseList)
    }

    function setPL(index, myHTML) {
      let data = [...purchaseList];
      if (myHTML.name === "p_id") {
        if (myHTML.tagName === "LI") {
          var p_id = myHTML.innerHTML.split("-")[0];
          data[index][myHTML.name] = parseInt(p_id);
          const myProduct = productList.findIndex(
            (pd) => pd.p_id === data[index].p_id
          );
        data[index].selling_price=productList[myProduct].selling_price
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
          (pd) => pd.p_id === data[index].p_id
        );
        console.log(myProduct);
        var curTotal = total - data[index].cost;
        if (myHTML.value === "") {
          data[index][myHTML.name] = 0;
        } else if (
          (!productList[myProduct].unit || myHTML.name !== "quantity") &&
          !Number.isNaN(myHTML.value)
        ) {
          data[index][myHTML.name] = myHTML.value;
          data[index].cost = data[index].selling_price * data[index].quantity;
        } else if (productList[myProduct].unit && re.test(myHTML.value)) {
          data[index][myHTML.name] = parseInt(myHTML.value);
          data[index].cost = data[index].selling_price * data[index].quantity;
        }
        curTotal += data[index].cost;
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
      if (!c_id || c_id===-1) {
        console.log("enter details properly");
      }

      console.log(data)
      data.forEach((listItem) => {
        if (listItem.p_id === -1) {
          console.log("Error: Each item must be filled else delete that field ");
          flag = false;
          return;
        }
        if (mySet.has(listItem.p_id)) {
          console.log("Error: one single entry for each item only");
          flag = false;
          return;
        }
        const myProduct = productList.findIndex(
          (pd) => pd.p_id === listItem.p_id
        );
        if(listItem.quantity>productList[myProduct].quantity){
            console.log("Error: "+listItem.label+" quantity must be less than "+productList[myProduct].quantity);
            flag=false
            return;
        }
        mySet.add(listItem.p_id);
      });
      if (!flag) {
        return;
      }
      console.log("All Ok");
      var list=[]
      data.forEach((item)=>{

        delete item.label
        list=list.concat(item)
        console.log(item)
      })
      console.log(list)
      const res = await fetch(backenURL+"/sellingOrder", {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ c_id,date,total,list,discount }),
      });
      const Resdata = await res.json();
      if(!callback){
        setC_id(-1);
        setMobile("");
        setTotal(0);
        setDiscount(0);
        setPurchaseList([{
            p_id: -1,
            quantity: 0,
            selling_price: 0,
            cost: 0,
            label: "",
          },]);
      }
      else{
        Resdata.sell.customer=[customerList.find((vend) => vend.c_id === Resdata.sell.c_id)]
        var ResProduct = []
        Resdata.sell.list.forEach((item)=>{
            ResProduct=ResProduct.concat(productList[productList.findIndex((y)=>y.p_id===item.p_id)])
        })
        
        Resdata.sell.product=ResProduct
        callback(undefined,Resdata.sell,"Add")
      }
      
    }


    return (
      <>
      
        
        <Box sx={{ p: 2, margin: 'auto', maxWidth: 850, flexGrow: 1 }}>
        <Grid sx={{ marginBottom: 2 }} container spacing={2}>
      <Grid item xs={4}>
      <Button
                variant="contained"
                endIcon={<AddIcon />}
                onClick={() => setOpenCustomer(true)}
              >
                Add New Customer
              </Button>
      </Grid>
        
       
      </Grid>
          <Grid sx={{ marginBottom: 2 }} container spacing={2}>
            <Grid item xs={6}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={customerList}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Customer" />}
                onChange={(e) =>
                  e.target.tagName === "LI" || e.target.tagName === "INPUT"
                    ? setCustomerValues(e.target.innerHTML)
                    : setCustomerValues("-1")
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
                label="Mobile"
                variant="outlined"
                fullWidth
                value={mobile}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            
          </Grid>
          <Grid sx={{ marginBottom: 2 }} container spacing={2}>
            {purchaseList.map((pl, index) => {
              return (
                <ItemList
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


          
        <TextField
          m={1}
          value={discount}
          id="outlined-basic"
          label="discount"
          variant="outlined"
          name="discount"
          sx={{width:'150px'}}
          onChange={(e) => {
            if(isNaN(e.target.value)|| parseInt(e.target.value)<0 ){
              return;
            }
            var curTotal=0;
            for(let i=0;i<purchaseList.length;i++){
              curTotal+=purchaseList[i].cost
            }
           if( curTotal<parseInt(e.target.value))return;
            var curDiscount=0;
            if(e.target.value===""){
              setDiscount(0);
              curDiscount=0;
            }
            else if(!isNaN(e.target.value) && curTotal>parseInt(e.target.value)){
              setDiscount(parseInt(e.target.value));
              curDiscount=parseInt(e.target.value)
            }
            setTotal(curTotal-curDiscount)
          }}
          fullWidth
        />
      


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
        <Dialog open={openCustomer} onClose={handleCloseCustomer}>
            <Grid container >
              <Grid item xs={8}>
  
                <DialogTitle> Add New Customer </DialogTitle>
  
              </Grid>
              <Grid item xs={4}>
  
                <DialogActions>
                  <IconButton onClick={handleCloseCustomer} >
                    <CancelOutlinedIcon color='primary' />
                  </IconButton>
                </DialogActions>
  
              </Grid>
            </Grid>
  
  
            <CustomerInsertPage callback={AddNewCustomer}  task="Add" />
  
          </Dialog>
  
  
         
      </>
    );
  }
  
  export default GenerateSellingOrder;
  