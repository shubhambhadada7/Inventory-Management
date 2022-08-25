import { TextField, Grid, Button, Box,RadioGroup,FormControlLabel,Radio } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useState } from 'react';
import backenURL from '../../utils/backend';

function ProductInsertPage({ callback, row, task }) {
    const [name, setName] = useState(row ? row.name : '');
    const [description, setDescription] = useState(row ? row.description : '');
    const [default_unit, setDefaultUnit] = useState(row ? row.default_unit : '');
    const [unit, setUnit] = useState(row?row.unit:true);


    async function handleClick(e) {
        e.preventDefault();
        if (name.length < 4) {
            console.log('Enter Product name properly');
            return;
        }
        if (unit.length === 0) {
            console.log('Enter Unit properly');
            return;
        }
        console.log('ready to send data');
        var p_id = -1
        if (task === "Update") {
            p_id = row.p_id;
        }
        const res = await fetch(backenURL+'/product',
            {
                method: task === "Add" ? "POST" : "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, description, default_unit, unit, p_id })
            })
        const data = await res.json()
        console.log(data);
        if (data.error) return;
        // if (!data || data.error || data.status === 422 || data.status === 401 || data.status === 500) {
        //     setOpen({ message: "Login failed", severity: "error", open: true })

        // }
        // else {
        //     setOpen({ message: 'Login successful', severity: "success", open: true })
        //     setUser(data.user)
        //     dispatchUserAuth({ type: 'LOGGEDIN', payload: true })
        //     navigate('/dashboard')
        // }
        const newProduct = { name, description, unit, default_unit, p_id: data.p_id };
        if (callback) {
            callback(data.error, newProduct, task)
        }

    }
    return (
        <>

            <Box sx={{ p: 2, margin: 1, maxWidth: 650, flexGrow: 1 }}>
                <Grid sx={{ marginBottom: 2 }} container spacing={2}>
                    <Grid item xs={6} >
                        <TextField
                            m={1}
                            id="outlined-basic"
                            label="Name"
                            variant="outlined"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)} />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            m={1}
                            id="outlined-basic"
                            label="Default Unit"
                            variant="outlined"
                            fullWidth
                            value={default_unit}

                            onChange={(e) => setDefaultUnit(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            m={1}
                            id="outlined-basic"
                            multiline
                            rows={4}
                            label="Description"
                            variant="outlined"
                            fullWidth
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        Unit
                    </Grid>
                    <Grid item xs={8}>
                        <RadioGroup
                        row
                           aria-labelledby="demo-controlled-radio-buttons-group"
                           name="controlled-radio-buttons-group"
                           value={unit}
                           onChange={(e)=>setUnit(e.target.value)}
                        >
                            <FormControlLabel value={true}control={<Radio />} label="Integer" />
                            <FormControlLabel value={false} control={<Radio />} label="Decimel" />
                        </RadioGroup>
                    </Grid>
                </Grid>
                <Button variant="contained" endIcon={<SaveIcon />} onClick={handleClick}>
                    Save
                </Button>
            </Box>

        </>
    );
}

export default ProductInsertPage;