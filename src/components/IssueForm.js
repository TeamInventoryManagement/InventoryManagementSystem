import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, Stack, TextField, Autocomplete } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useState } from "react";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const top100Films = [
    { component: 'RAM' },
    { component: 'Hard Disk' },
    { component: 'Web Camera' },
    // Add other films here
];

const IssueForm = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Issue Page</h1>
            <Button onClick={handleOpen} color="primary" variant="contained">Open Popup</Button>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    Sent to Repair
                    <IconButton onClick={handleClose} style={{ float: 'right' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} margin={2}>
                        <TextField variant="outlined" label="Issue" />
                        <TextField variant="outlined" label="Effect Components" />

                        <Autocomplete
                            multiple
                            id="checkboxes-tags-demo"
                            options={top100Films}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option.component}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        checked={selected}
                                        style={{ marginRight: 8 }}
                                    />
                                    {option.component}
                                </li>
                            )}
                            style={{ width: '100%' }}
                            renderInput={(params) => (
                                <TextField {...params} label="Effect Components" placeholder="Effect Components" />
                            )}
                        />
                          {/* <FormControlLabel
                            control={<Checkbox defaultChecked color="primary" />}
                            label="Agree to terms & conditions"
                          /> */}
                        <Button color="primary" variant="contained">Submit</Button>
                    </Stack>
                    
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default IssueForm;
