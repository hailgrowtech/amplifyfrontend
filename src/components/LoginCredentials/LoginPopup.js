import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import close from "../../assets/close.png"; // Make sure to import your close icon

const LoginPopup = ({ closeLogin, title }) => {
  const [RANames, setRANames] = useState([]);
  const [selectedRA, setSelectedRA] = useState("");
  const [API, setAPI] = useState("");
  const [userType, setUserType] = useState("");

  useEffect(() => {
    if (title === "Sub-Admin") {
      setAPI("https://copartners.in:5131/api/User?page=1&pageSize=10000");
      setUserType("SA");
    } else if (title === "R.A") {
      setAPI("https://copartners.in:5132/api/Experts?page=1&pageSize=10000");
      setUserType("RA");
    } else {
      setAPI("https://copartners.in:5133/api/AffiliatePartner?page=1&pageSize=10000");
      setUserType("AP");
    }
  }, [title]);

  useEffect(() => {
    const showRA = async () => {
      if (!API) return; // Skip fetch if API is not set yet
      try {
        const response = await fetch(API);
        if (!response.ok) {
          throw new Error("RA listing not fetched");
        }
        const data = await response.json();
        setRANames(data.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    showRA();
  }, [API]);

  const handleRAChange = (event) => {
    setSelectedRA(event.target.value);
  };

  const selectedRADetails = RANames.find((ra) => ra.name === selectedRA);

  const handleSubmit = async () => {
    if (!selectedRADetails) {
      console.error("No RA selected");
      return;
    }

    const passwordGenerate = () => {
      const random = Math.random() * 1000;
      const digit4 = Math.floor(random);
      if (title === "Sub-Admin") {
        return `Copartner@SA${digit4}`;
      } else if (title === "R.A") {
        return `Copartner@RA${digit4}`;
      } else {
        return `Copartner@AP${digit4}`;
      }
    };

    const postData = {
      userId: "",
      stackholderId: selectedRADetails.id,
      userType: userType,
      name: selectedRADetails.name,
      email: selectedRADetails.email,
      mobileNo: selectedRADetails.mobileNumber,
      password: passwordGenerate(),
    };

    try {
      const response = await fetch("https://copartners.in:5130/api/User", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      console.log(postData);
      if (!response.ok) {
        throw new Error("POST API fetch failed");
      }
      console.log("API fetched");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="popup bg-white border-1 border-[#ffffff2a] m-4 rounded-lg w-3/4 text-center">
        <div className="bg-[#dddddd] px-4 py-2 rounded-t-lg flex justify-between items-center">
          <h2 className="text-left font-semibold text-2xl">{`Add ${title} Login Credentials`}</h2>
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <span className="mr-2">Active</span>
              <Switch color="primary" />
            </div>
            <button onClick={closeLogin}>
              <img className="w-8 h-8" src={close} alt="close" />
            </button>
          </div>
        </div>

        <form className="px-12 py-4 grid grid-cols-2 my-4 gap-8 text-left">
          <TextField
            select
            id="name"
            name="name"
            label="Name"
            variant="outlined"
            fullWidth
            required
            value={selectedRA}
            onChange={handleRAChange}
          >
            {RANames.map((ra) => (
              <MenuItem key={ra.id} value={ra.name}>
                {`${ra.name} (${ra.mobileNumber})`}
              </MenuItem>
            ))}
          </TextField>
          {selectedRADetails && (
            <>
              {selectedRADetails.mobileNumber && (
                <TextField
                  id="number"
                  name="number"
                  value={selectedRADetails.mobileNumber}
                  variant="outlined"
                  label="Number"
                  fullWidth
                  disabled
                />
              )}
              {selectedRADetails.email && (
                <TextField
                  id="email"
                  name="email"
                  value={selectedRADetails.email}
                  variant="outlined"
                  label="Email"
                  fullWidth
                  disabled
                />
              )}
            </>
          )}
        </form>
        <button
          onClick={handleSubmit}
          className="px-12 bg-blue-500 text-white py-2 mb-8 border-2 rounded-lg"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default LoginPopup;
