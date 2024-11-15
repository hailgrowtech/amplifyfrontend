import React from "react";
import close from "../../assets/close.png";
import { InputLabel, MenuItem, Select, TextField } from "@mui/material";

const AccessPopup = ({ closeAccess }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="popup bg-white border-1 border-[#ffffff2a] m-4 rounded-lg w-3/4 text-center">
        <div className="bg-[#dddddd] px-4 py-2 rounded-t-lg flex justify-between items-center">
          <h2 className="text-left font-semibold text-2xl">Add Sub Admin</h2>
          <div className="flex items-center">
            <button onClick={closeAccess}>
              <img className="w-8 h-8" src={close} alt="close" />
            </button>
          </div>
        </div>

        <form className="px-12 py-4 grid grid-cols-2 my-4 gap-8 text-left">
          <div className="flex flex-col">
            <InputLabel id="Role">Role</InputLabel>
            <TextField
              select
              labelId="Role"
              id="type"
              name="type"
              variant="outlined"
              fullWidth
              required
            >
              <MenuItem value="Type1">A.P</MenuItem>
              <MenuItem value="Type2">R.A</MenuItem>
              <MenuItem value="Type3">Blog</MenuItem>
              <MenuItem value="Type3">R.A Details</MenuItem>
              <MenuItem value="Type3">A.P Details</MenuItem>
              <MenuItem value="Type3">Ad Agency</MenuItem>
              <MenuItem value="Type3">Transaction</MenuItem>
              <MenuItem value="Type3">Marketing Content</MenuItem>
              <MenuItem value="Type3">User Data</MenuItem>
              <MenuItem value="Type3">Join</MenuItem>
            </TextField>
          </div>
          <div className="flex flex-col">
            <InputLabel id="Access">Access</InputLabel>
            <TextField
              select
              id="type"
              labelId="Access"
              name="type"
              variant="outlined"
              fullWidth
              required
            >
              <MenuItem value="Type1">Veiw Only</MenuItem>
              <MenuItem value="Type3">Edit</MenuItem>
            </TextField>
          </div>
        </form>
        <button className="px-12 bg-blue-500 text-white py-2 mb-8 border-2 rounded-lg">
          Add
        </button>
      </div>
    </div>
  );
};

export default AccessPopup;
