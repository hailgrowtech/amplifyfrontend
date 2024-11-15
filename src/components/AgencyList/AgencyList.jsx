import { useEffect, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import PageHeader from "../Header/Header";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import AdAgencyPopup from "./AdAgencyPopup";
import Bin from "../../assets/TrashBinMinimalistic.png";
import { FaPen } from "react-icons/fa";

const AgencyList = () => {
  const [hasNotification, setHasNotification] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [agencyList, setAgencyList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAgencyList();
  }, []);

  const fetchAgencyList = async () => {
    try {
      const response = await fetch(
        "https://copartners.in:5134/api/AdvertisingAgency?page=1&pageSize=10000"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch agency list");
      }
      const data = await response.json();
      setAgencyList(data.data);
    } catch (error) {
      console.error("Error fetching agency list:", error);
      toast.error("Failed to fetch agency list");
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedAgency(null);
  };

  const handleDeleteAgency = async (id) => {
    try {
      const response = await fetch(
        `https://copartners.in:5134/api/AdvertisingAgency/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete agency");
      }

      toast.success("Agency deleted successfully!");
      fetchAgencyList();
    } catch (error) {
      console.error("Error deleting agency:", error);
      toast.error("Failed to delete agency");
    }
  };

  const handleEditAgency = (agency) => {
    if (agency) {
      setSelectedAgency(agency);
    } else {
      setSelectedAgency(null);
    }
    setIsPopupOpen(true);
  };

  const handleSubmitAgency = async (formData) => {
    const endpoint = "https://copartners.in:5134/api/AdvertisingAgency";

    if (selectedAgency) {
      try {
        const response = await fetch(`${endpoint}/${selectedAgency.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, id: selectedAgency.id }),
        });

        if (!response.ok) throw new Error("Failed to update the agency");
        fetchAgencyList();
        toast.success("Agency updated successfully!");
      } catch (error) {
        console.error("Update error:", error);
        toast.error("Failed to update agency");
      }
    } else {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            date: new Date().toLocaleDateString(),
          }),
        });

        if (!response.ok) throw new Error("Failed to create new agency");

        fetchAgencyList();
        toast.success("Agency added successfully!");
      } catch (error) {
        console.error("Creation error:", error);
        toast.error("Failed to add new agency");
      }
    }
  };

  const handleNextTab = (agency) => {
    navigate(`${agency.id}`, { state: { agencyName: agency.agencyName } });
  };

  return (
    <div className="dashboard-container p-0 sm:ml-60">
      <PageHeader
        title="Ad Agency Details"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        hasNotification={hasNotification}
        setHasNotification={setHasNotification}
      />

      <div className="p-4">
        <div className="dashboard-view-section mb-4">
          <div className="table-list-mb">
            <div className="channel-heading flex">
              <h3 className="text-xl font-semibold mr-auto">Listing</h3>
              <button
                className="border-2 border-black rounded-lg px-4 py-1 mr-4"
                onClick={() => handleEditAgency(null)}
              >
                + Add
              </button>
            </div>
            <div className="py-4 px-8">
              <table className="table-list">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th style={{ textAlign: "left", paddingLeft: "9rem" }}>
                      Agency Name
                    </th>
                    <th style={{ textAlign: "left" }}>Landing Page Link</th>
                    <th>Users</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {agencyList.map((agency) => (
                    <tr key={agency.id}>
                      <td style={{ fontWeight: "700" }}>
                        {new Date(agency.joinDate).toLocaleDateString()}
                      </td>
                      <td
                        style={{
                          fontWeight: "700",
                          textAlign: "left",
                          paddingLeft: "9rem",
                        }}
                        className="text-blue-400"
                      >
                        <button onClick={() => handleNextTab(agency)}>
                          {agency.agencyName}
                        </button>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        {agency.link.substring(0, 20)}...
                      </td>
                      <td>{agency.usersCount}</td>
                      <td className="flex justify-center items-center gap-6">
                        <FaPen
                          className="text-blue-600 cursor-pointer"
                          onClick={() => handleEditAgency(agency)}
                        />
                        <img
                          onClick={() => handleDeleteAgency(agency.id)}
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
          </div>
        </div>
      </div>
      {isPopupOpen && (
        <AdAgencyPopup
          onClose={handleClosePopup}
          selectedAgency={selectedAgency}
          onSubmit={handleSubmitAgency}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default AgencyList;
