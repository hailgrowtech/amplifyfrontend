import React from "react";
import styles from "../../style";
import ShowProfile from "./ShowProfile";
import Alert from "./Alert";
import SavedProfile from "./SavedProfile";
import { useUserSession } from "../../constants/userContext";

const Profile = ({token}) => {
  const { userData, loading, error } = useUserSession();

  if (loading) {
    return <div className="text-black">Loading...</div>;
  }

  if (error) {
    return <div className="text-black">Error: {error}</div>;
  }

  return (
    <>
      <section className={`flex-col ${styles.paddingY}`}>
        <section className="w-full flex md:flex-row md:p-1 p-5 flex-col items-center justify-center">
          <ShowProfile userData={userData} token={token} />
        </section>
        {/* <div
          className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-3 z-10 md:bottom-[10rem]`}
        >
          <section className="w-full flex md:flex-row flex-col items-center justify-center">
            <Alert />
          </section>
          <section className="w-full flex md:flex-row flex-col items-center justify-center">
            <SavedProfile />
          </section>
        </div> */}
      </section>
    </>
  );
};

export default Profile;
