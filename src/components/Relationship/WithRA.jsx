import React, { useState, useEffect } from "react";
import Bin from "../../assets/TrashBinMinimalistic.png";
import AssignRA from "./AssignRA";
import { toast } from "react-toastify";

const WithRA = ({ activeButton }) => {
  const [data, setData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch("https://copartners.in:5134/api/RelationshipManager/GetByUserId?UserType=RA");
      const result = await response.json();
      if (result.isSuccess) {
        const filteredData = result.data.filter(item => item.experts !== null);
        setData(filteredData);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch relationship managers");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSave = () => {
    fetchData();
    setIsPopupOpen(false);
  };

  return (
    <>
      <div className="channel-heading flex">
        <h3 className="text-xl font-semibold mr-auto">{activeButton}</h3>
        <button
          className="border-2 border-black rounded-lg px-4 py-1 mr-4"
          onClick={handleAddClick}
        >
          + Add Relationship
        </button>
      </div>
      <div className="py-4 px-8">
        <table className="table-list">
          <thead>
            <tr>
              <th style={{ textAlign: "left", paddingLeft: "2rem" }}>Date</th>
              <th style={{ textAlign: "left" }}>R.A Name</th>
              <th>Relation Management</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td style={{ textAlign: "left", paddingLeft: "2rem" }}>
                  {new Date(item.createdOn).toLocaleDateString()}
                </td>
                <td style={{ textAlign: "left" }}>{item.experts.name}</td>
                <td>{item.name}</td>
                <td className="flex justify-center items-center">
                  <img
                    className="w-6 h-6 cursor-pointer"
                    src={Bin}
                    alt="Delete"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isPopupOpen && (
        <AssignRA onClose={handleClosePopup} onSave={handleSave} />
      )}
    </>
  );
};

export default WithRA;
