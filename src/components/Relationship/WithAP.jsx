import React, { useState, useEffect } from "react";
import Bin from "../../assets/TrashBinMinimalistic.png";
import AssignAP from "./AssignAP";
import { toast } from "react-toastify";

const WithAP = ({ activeButton }) => {
  const [data, setData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://copartners.in:5134/api/RelationshipManager/GetByUserId?UserType=AP"
      );
      const result = await response.json();
      if (result.isSuccess) {
        const filteredData = result.data.filter(
          (item) => item.affiliatePartners !== null
        );
        setData(filteredData);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch affiliate partners");
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

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://copartners.in:5134/api/RelationshipManager/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete relationship manager");
      }

      toast.success("Relationship manager deleted successfully!");
      fetchData(); // Refetch data to update the list
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Failed to delete relationship manager");
    }
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
              <th style={{ textAlign: "left" }}>A.P Name</th>
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
                <td style={{ textAlign: "left" }}>
                  {item.affiliatePartners.name}
                </td>
                <td>{item.name}</td>
                <td className="flex justify-center items-center gap-6">
                  <img
                    className="w-6 h-6 cursor-pointer"
                    src={Bin}
                    alt="Delete"
                    onClick={() => handleDelete(item.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isPopupOpen && (
        <AssignAP onClose={handleClosePopup} onSave={handleSave} />
      )}
    </>
  );
};

export default WithAP;
