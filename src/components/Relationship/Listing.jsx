import React, { useState, useEffect } from "react";
import document from "../../assets/Document.png";
import { FaPen } from "react-icons/fa";
import Bin from "../../assets/TrashBinMinimalistic.png";
import { toast } from "react-toastify";
import AddPopup from "./AddPopup";

const Listing = ({ activeButton }) => {
  const [data, setData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://copartners.in:5134/api/RelationshipManager?page=1&pageSize=10000"
      );
      const result = await response.json();
      if (result.isSuccess) {
        setData(result.data);
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
    setSelectedManager(null);
    setIsPopupOpen(true);
  };

  const handleEditClick = (manager) => {
    setSelectedManager(manager);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSave = () => {
    fetchData();
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

  const handleDocument = (document) => {
    window.open(document)
  }

  return (
    <>
      <div className="channel-heading flex">
        <h3 className="text-xl font-semibold mr-auto">{activeButton}</h3>
        <button
          className="border-2 border-black rounded-lg px-4 py-1 mr-4"
          onClick={handleAddClick}
        >
          + Add
        </button>
      </div>
      <div className="py-4 px-8">
        <table className="table-list">
          <thead>
            <tr>
              <th style={{ textAlign: "left", paddingLeft: "2rem" }}>Date</th>
              <th style={{ textAlign: "left" }}>Name</th>
              <th>Number</th>
              <th>Document</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td style={{ textAlign: "left", paddingLeft: "2rem" }}>
                  {new Date(item.createdOn).toLocaleDateString()}
                </td>
                <td style={{ textAlign: "left" }}>{item.name}</td>
                <td>{item.mobile}</td>
                <td>
                  <button onClick={() => handleDocument(item.documentPath)}>
                    <img className="w-5" src={document} alt="document" />
                  </button>
                </td>
                <td className="flex justify-center items-center gap-6">
                  <FaPen
                    className="text-blue-600 cursor-pointer"
                    onClick={() => handleEditClick(item)}
                  />
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
        <AddPopup
          onClose={handleClosePopup}
          onSave={handleSave}
          initialData={selectedManager}
        />
      )}
    </>
  );
};

export default Listing;
