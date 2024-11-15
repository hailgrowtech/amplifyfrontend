import React, { useState, useEffect } from "react";
import { Button, MenuItem, FormControl, TextField } from "@mui/material";
import closeIcon from "../../assets/close.png";
import { toast } from "react-toastify";

const AssignRA = ({ onClose, onSave }) => {
  const [managers, setManagers] = useState([]);
  const [ras, setRAs] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedRA, setSelectedRA] = useState("");

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await fetch(
          "https://copartners.in:5134/api/RelationshipManager?page=1&pageSize=10000"
        );
        const data = await response.json();
        setManagers(data.data);
      } catch (error) {
        console.error("Error fetching managers:", error);
        toast.error("Failed to fetch managers");
      }
    };

    const fetchRAs = async () => {
      try {
        const response = await fetch("https://copartners.in:5132/api/Experts?page=1&pageSize=10000");
        const data = await response.json();
        setRAs(data.data);
      } catch (error) {
        console.error("Error fetching RAs:", error);
        toast.error("Failed to fetch RAs");
      }
    };

    fetchManagers();
    fetchRAs();
  }, []);

  const handleAssign = async () => {
    if (!selectedManager || !selectedRA) {
      toast.error("Please select both Manager and R.A");
      return;
    }

    const patchData = [
      {
        path: "relationshipManagerId",
        op: "replace",
        value: selectedManager,
      },
    ];

    try {
      const response = await fetch(
        `https://copartners.in:5132/api/Experts?Id=${selectedRA}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patchData),
        }
      );

      console.log(selectedRA, "RA");
      console.log(selectedManager, "Manager");

      if (!response.ok) {
        throw new Error("Failed to assign relationship");
      }

      toast.success("Relationship assigned successfully!");
      onSave();
    } catch (error) {
      console.error("Error assigning relationship:", error);
      toast.error("Failed to assign relationship");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="popup bg-white border-1 border-[#ffffff2a] m-4 rounded-lg w-3/4 text-center">
        <div className="bg-[#dddddd] px-4 py-2 rounded-t-lg flex justify-between">
          <h2 className="text-left font-semibold text-2xl">
            Assign Relationship
          </h2>
          <button onClick={onClose}>
            <img className="w-8 h-8 mr-4" src={closeIcon} alt="Close" />
          </button>
        </div>
        <div className="px-12 py-4 grid grid-cols-2 gap-8">
          <FormControl fullWidth>
            <TextField
              select
              className="text-left"
              label="Manager"
              id="select-manager"
              value={selectedManager}
              onChange={(e) => setSelectedManager(e.target.value)}
              required
            >
              {managers.map((manager) => (
                <MenuItem key={manager.id} value={manager.id}>
                  {manager.name}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl fullWidth>
            <TextField
              select
              className="text-left"
              label="R.A"
              id="select-ra"
              value={selectedRA}
              onChange={(e) => setSelectedRA(e.target.value)}
              required
            >
              {ras.map((ra) => (
                <MenuItem key={ra.id} value={ra.id}>
                  {ra.name}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <div className="col-span-2 flex justify-center">
            <Button onClick={handleAssign} variant="contained" color="primary">
              Assign
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignRA;
