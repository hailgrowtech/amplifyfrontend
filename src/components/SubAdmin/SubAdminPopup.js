import { MenuItem, Select, Switch, TextField } from "@mui/material";
import React from "react";
import close from "../../assets/close.png";

const SubAdminPopup = ({ closeSubAdmin }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="popup bg-white border-1 border-[#ffffff2a] m-4 rounded-lg w-3/4 text-center">
        <div className="bg-[#dddddd] px-4 py-2 rounded-t-lg flex justify-between items-center">
          <h2 className="text-left font-semibold text-2xl">Add Sub Admin</h2>
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <span className="mr-2">Active</span>
              <Switch color="primary" />
            </div>
            <button onClick={closeSubAdmin}>
              <img className="w-8 h-8" src={close} alt="close" />
            </button>
          </div>
        </div>

        <form className="px-12 py-4 grid grid-cols-2 my-4 gap-8 text-left">
          <TextField
            id="name"
            name="name"
            label="Name"
            variant="outlined"
            fullWidth
            required
          />
          <TextField
            select
            id="type"
            name="type"
            variant="outlined"
            label="Type"
            fullWidth
            required
          >
            <MenuItem value="Type1">Type1</MenuItem>
            <MenuItem value="Type2">Type2</MenuItem>
            <MenuItem value="Type3">Type3</MenuItem>
          </TextField>
        </form>
        <button className="px-12 bg-blue-500 text-white py-2 mb-8 border-2 rounded-lg">Add</button>
      </div>
    </div>
  );
};

export default SubAdminPopup;
