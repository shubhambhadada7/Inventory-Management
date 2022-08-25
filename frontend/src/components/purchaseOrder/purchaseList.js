import { Grid, Autocomplete, TextField, IconButton } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

function PurchaseList({ productList, values, index, setPL, deletePL }) {
  return (
    <>
      <Grid item xs={3.5}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={productList}
          renderInput={(params) => <TextField {...params} label="Product ID" />}
          onChange={(e) => {
            e.target.name = "pid";

            setPL(index, e.target);
          }}
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          m={1}
          id="outlined-basic"
          label="buying price"
          variant="outlined"
          name="buying_price"
          value={values.buying_price}
          onChange={(e) => setPL(index, e.target)}
          disabled={values.pid === -1 ? true : false}
          fullWidth
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          m={1}
          value={values.quantity}
          id="outlined-basic"
          label="quantity"
          variant="outlined"
          name="quantity"
          disabled={values.pid === -1 ? true : false}
          onChange={(e) => setPL(index, e.target)}
          fullWidth
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          m={1}
          value={values.selling_price}
          id="outlined-basic"
          label="selling price"
          variant="outlined"
          name="selling_price"
          disabled={values.pid === -1 ? true : false}
          onChange={(e) => setPL(index, e.target)}
          fullWidth
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          m={1}
          value={values.total}
          id="outlined-basic"
          label="Total"
          variant="outlined"
          name="total"
          InputProps={{
            readOnly: true,
          }}
          onChange={(e) => setPL(index, e.target)}
          fullWidth
        />
      </Grid>
      <Grid item xs={0.5}>
        <IconButton
          color="error"
          aria-label="upload picture"
          component="span"
          onClick={() => deletePL(index)}
        >
          <DeleteIcon />
        </IconButton>
      </Grid>
    </>
  );
}

export default PurchaseList;
