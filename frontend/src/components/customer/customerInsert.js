import {  TextField, Grid, Button, Box } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useState } from 'react';
import backenURL from '../../utils/backend';


const re = /^[0-9\b]+$/;
function CustomerInsertPage({callback,row,task}) {
    const [name, setName] = useState(row?row.name:'');
    const [mobile, setMobile] = useState(row?row.mobile.toString():'');

    async function handleClick(e) {
        e.preventDefault();
        if (name.length < 4) {
            console.log('Enter your name properly');
            return;
        }
        if (mobile.length !== 10) {
            
            console.log('Enter your 10 digit mobile number');
            return;
        }

        console.log('ready to send Customer data');
        var c_id=-1;
        if(task==="Update"){
            c_id=row.c_id;
        }
        const res = await fetch(backenURL+'/customer',
            {
                method: task==="Add"?"POST":"PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, mobile,c_id })
            })
        const data = await res.json()
        console.log(data);
        if(data.error)return;
        // if (!data || data.error || data.status === 422 || data.status === 401 || data.status === 500) {
        //     setOpen({ message: "Login failed", severity: "error", open: true })

        // }
        // else {
        //     setOpen({ message: 'Login successful', severity: "success", open: true })
        //     setUser(data.user)
        //     dispatchUserAuth({ type: 'LOGGEDIN', payload: true })
        //     navigate('/dashboard')
        // }
        const newCustomer={name,mobile,c_id:data.c_id};
        if(callback){
            callback(data.error,newCustomer,task)
        }
        setName('');
        setMobile('');
        
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
                            label="Mobile"
                            variant="outlined"
                            fullWidth
                            value={mobile}

                            onChange={(e) => {
                                if (e.target.value === '' || re.test(e.target.value)) {
                                    setMobile(e.target.value)
                                }
                            }
                            }
                        />
                    </Grid>
                    
                </Grid>
                <Button variant="contained" endIcon={<SaveIcon />} onClick={handleClick}>
                    Save
                </Button>
            </Box>

        </>
    );
}

export default CustomerInsertPage;