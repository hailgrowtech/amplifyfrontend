import "./UserDetail.css";
import { FaAngleLeft } from "react-icons/fa6";
import PageHeader from "../Header/Header";
import { useNavigate, useParams } from "react-router-dom";

const UserDetail = () => {
  const userDetails = [
    {
      name: "Varun Kumar",
      mobile: "9898981923",
      transactions: [
        {
          date: "01/04/2024",
          amount: 1000,
          ra: "Eeshee Pal Singh",
          subscription: "Service",
        },
      ],
    },
    {
      name: "Parvez Alam",
      mobile: "7987897973",
      transactions: [
        {
          date: "02/04/2024",
          amount: 2000,
          ra: "Khatri Pal Singh",
          subscription: "Service",
        },
      ],
    },
  ];

  const navigate = useNavigate();
  const { apId } = useParams();

  const user = userDetails.find((user) => user.mobile === apId);

  return (
    <div className="dashboard-container p-0 sm:ml-60">
      {/* Page Header */}
      <PageHeader
        title="A.P"
        searchQuery=""
        setSearchQuery={() => {}}
        hasNotification={false} // Adjust as needed
        setHasNotification={() => {}} // Adjust as needed
      />

      {/* Back Button */}
      <div className="back-button flex items-center text-2xl font-bold p-6">
        <button
          style={{ display: "flex", alignItems: "center" }}
          onClick={() => navigate(-1)}
        >
          <FaAngleLeft />
          <span className="ml-1">Back</span>
        </button>
      </div>

      {/* Additional Divs below Request Page */}
      {user ? (
        <div className="requestContainer mx-5 bg-[#fff]">
          <div className="requestHeading flex items-center text-2xl font-bold p-4">
            <h2 className="pl-3 text-xl font-semibold">{user.name} :</h2>
            <div className="channelOptions flex place-content-between px-6 text-xl font-semibold">
              {user.mobile}
            </div>
          </div>
          {/* Similar Channel Options from Explore Page */}

          {/* Table Layout */}
          <div className="requestTable px-5 pb-3">
            <table className="request-table">
              <thead>
                <tr className="requestColumns">
                  <th className="text-left">Date</th>
                  <th>Amount Pay</th>
                  <th>R.A</th>
                  <th>Subscription</th>
                </tr>
              </thead>
              <tbody>
                {user.transactions.map((transaction, index) => (
                  <tr key={index} className="request-numbers font-semibold">
                    <td>{transaction.date}</td>
                    <td className="text-center">{transaction.amount}</td>
                    <td className="text-center">{transaction.ra}</td>
                    <td className="text-center">{transaction.subscription}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : <div className="flex items-center justify-center mt-28 text-3xl font-bold p-6">
      User not found!
    </div>}
    </div>
  );
};

export default UserDetail;
