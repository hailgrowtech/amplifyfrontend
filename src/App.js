import React from "react";
import {
  Expertise,
  Navbar,
  Subscription,
  SubscriptionRA,
  Wallet,
  Webinar,
  ErrorPage,
  ExpertiseExplore,
  SubscriptionBuy,
  ReferEarn,
  Blog,
  BlogPage,
  ContactUs,
  Profile,
  About,
  FAQs,
  PrivacyPolicy,
  Terms,
  SignUp,
  Disclaimer,
  Hero,
} from "./components";
import styles from "./style";
import "react-toastify/dist/ReactToastify.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";
import { UserDataProvider } from "./constants/context";
import { UserProvider } from "./constants/userContext";
import { SubscriptionProvider } from "./constants/subscriptionContext";
import KYCPopup from "./components/KYCPage";
import MinorSub from "./components/MinorSubscription/MinorSub";
// import WebinarExpert from "./components/Webinar/WebinarExpert";
import SubscriptionMinorPopup from "./components/Subscription RA/SubscriptionMinorPopup";
import LoginSignupPopup from "./components/LoginSignupPopup";
import ChooseExpert from "./components/ChooseExpert/ChooseExpert";
import PrivacyPolicy2 from "./components/About/PrivacyPolicy2";

function App() {
  const hasVisitedSignUp = sessionStorage.getItem("visitedSignUp");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={
            <UserProvider>
              <Navbar userId={userId} />
            </UserProvider>
          }
          errorElement={<ErrorPage />}
        >
          <Route
            path=""
            element={
              <div className={`${styles.flexStart}`}>
                <UserDataProvider>
                  <div className={`${styles.boxWidth}`}>
                    <SubscriptionProvider>
                      <Hero
                        hasVisitedSignUp={hasVisitedSignUp}
                        userId={userId}
                        token={token}
                      />
                    </SubscriptionProvider>
                  </div>
                </UserDataProvider>
              </div>
            }
          />
          <Route
            path="expertise"
            element={
              userId ? (
                <div className={`${styles.flexStart}`}>
                  <UserDataProvider>
                    <div className={`${styles.boxWidth}`}>
                      <Expertise userId={userId} />
                    </div>
                  </UserDataProvider>
                </div>
              ) : (
                <Navigate to="/signup" replace={true} />
              )
            }
          />
          <Route
            path="kycpage"
            element={
              // userId ? (
              <div className={`${styles.flexStart}`}>
                <UserDataProvider>
                  <div className={`${styles.boxWidth}`}>
                    <KYCPopup userId={userId} token={token} />
                  </div>
                </UserDataProvider>
              </div>
              // ) : (
              //   <Navigate to="/signup" replace={true} />
              // )
            }
          />
          <Route
            path="subscription"
            element={
              userId ? (
                <div className={`${styles.flexStart}`}>
                  <UserDataProvider>
                    <div className={`${styles.boxWidth}`}>
                      <Subscription userId={userId} />
                    </div>
                  </UserDataProvider>
                </div>
              ) : (
                <Navigate to="/signup" replace={true} />
              )
            }
          />
          <Route
            path="blogs"
            element={
              userId || hasVisitedSignUp ? (
                <div className={`${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <Blog />
                  </div>
                </div>
              ) : (
                <Navigate to="/signup" replace={true} />
              )
            }
          />
          <Route
            path="webinar"
            element={
              userId || hasVisitedSignUp ? (
                <UserDataProvider>
                  <Webinar />
                </UserDataProvider>
              ) : (
                <Navigate to="/signup" replace={true} />
              )
            }
          />
          {/* <Route
            path="/webinar/expert/:id"
            element={
              <UserDataProvider>
                <WebinarExpert userId={userId} />
              </UserDataProvider>
            }
          /> */}
          <Route
            path="history"
            element={
              userId ? (
                <UserDataProvider>
                  <SubscriptionProvider>
                    <Wallet userId={userId} token={token} />
                  </SubscriptionProvider>
                </UserDataProvider>
              ) : (
                <Navigate to="/signup" replace={true} />
              )
            }
          />
          <Route
            path="ra-detail2/:id"
            element={
              <UserProvider>
                <MinorSub userId={userId} />
              </UserProvider>
            }
          />
          <Route
            path="ra-detail/:id"
            element={
              <UserProvider>
                <SubscriptionRA userId={userId} token={token} />
              </UserProvider>
            }
          />
          {/* <Route
            path="subscription/buy"
            element={
              userId || hasVisitedSignUp ? (
                <SubscriptionBuy />
              ) : (
                <Navigate to="/signup" replace={true} />
              )
            }
          /> */}
          {/* <Route
            path="expertise/explore-expertise"
            element={
              userId || hasVisitedSignUp ? (
                <UserDataProvider>
                  <ExpertiseExplore userId={userId} />
                </UserDataProvider>
              ) : (
                <Navigate to="/signup" replace={true} />
              )
            }
          /> */}
          <Route path="subscription/buy/:id" element={<SubscriptionBuy />} />
          <Route
            path="refer&earn"
            element={
              userId || hasVisitedSignUp ? (
                <div className={`${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <ReferEarn />
                  </div>
                </div>
              ) : (
                <Navigate to="/signup" replace={true} />
              )
            }
          />
          <Route
            path="about"
            element={
              userId || hasVisitedSignUp ? (
                <About />
              ) : (
                <Navigate to="/signup" replace={true} />
              )
            }
          />
          <Route
            path="faqs"
            element={
              userId || hasVisitedSignUp ? (
                <FAQs />
              ) : (
                <Navigate to="/signup" replace={true} />
              )
            }
          />
          <Route
            path="privacy"
            element={
              userId || hasVisitedSignUp ? (
                <PrivacyPolicy2 />
              ) : (
                <Navigate to="/signup" replace={true} />
              )
            }
          />
          <Route
            path="terms_of_service"
            element={
              userId || hasVisitedSignUp ? (
                <Terms />
              ) : (
                <Navigate to="/signup" replace={true} />
              )
            }
          />
          <Route
            path="profile"
            element={
              userId ? (
                <UserProvider>
                  <Profile userId={userId} token={token} />
                </UserProvider>
              ) : (
                <Navigate to="/signup" replace={true} />
              )
            }
          />
          <Route
  path="choose-your-expert"
  element={
    <UserDataProvider>
      <ChooseExpert />
    </UserDataProvider>
  }
/>
<Route
  path="choose-expert/:expertId"
  element={
    <UserDataProvider>
      <ChooseExpert />
    </UserDataProvider>
  }
/>


          <Route
            path="blogs"
            element={
              userId || hasVisitedSignUp ? (
                <Blog />
              ) : (
                <Navigate to="/signup" replace={true} />
              )
            }
          />
          <Route
            path="contact_us"
            element={
              userId || hasVisitedSignUp ? (
                <ContactUs />
              ) : (
                <Navigate to="/signup" replace={true} />
              )
            }
          />
          <Route
            path="disclaimer"
            element={
              userId || hasVisitedSignUp ? (
                <Disclaimer />
              ) : (
                <Navigate to="/signup" replace={true} />
              )
            }
          />
          <Route
            path="/blogs/:blogId"
            element={
              userId || hasVisitedSignUp ? (
                <BlogPage />
              ) : (
                <Navigate to="/signup" replace={true} />
              )
            }
          />
          <Route
            path="/:subscriptionIdParams"
            element={
              userId ? (
                <SubscriptionMinorPopup shouldNavigate={true} />
              ) : (
                <Navigate to="/signup" replace={true} />
              )
            }
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LoginSignupPopup token={token} />} />
        </Route>
      </>
    )
  );

  return (
    <div className="bg-[#ededed] w-full overflow-hidden font-poppins">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
