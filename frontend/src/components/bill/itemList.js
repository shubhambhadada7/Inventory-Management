import { Grid, Autocomplete, TextField, IconButton } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

function ItemList({ productList, values, index, setPL, deletePL }) {
  return (
    <>
      <Grid item xs={3.5}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={productList}
          renderInput={(params) => <TextField {...params} label="Product ID" />}
          onChange={(e) => {
            e.target.name = "p_id";
            setPL(index, e.target);
          }}
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          m={1}
          id="outlined-basic"
          label="price"
          variant="outlined"
          name="selling_price"
          value={values.selling_price}
          onChange={(e) => setPL(index, e.target)}
          disabled={ true}
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
          disabled={values.p_id === -1 ? true : false}
          onChange={(e) => setPL(index, e.target)}
          fullWidth
        />
      </Grid>
      
      <Grid item xs={2}>
        <TextField
          m={1}
          value={values.cost}
          id="outlined-basic"
          label="cost"
          variant="outlined"
          name="cost"
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

export default ItemList;
