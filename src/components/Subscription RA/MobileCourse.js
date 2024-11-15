import React from "react";

function MobileCourse({
  filterTab,
  showMobilePopup,
  handleBuyNowClick,
  subscriptions,
  selectedSubscription,
}) {
  const calculateRemainingTime = (discountValidTo) => {
    const now = new Date();
    const validTo = new Date(discountValidTo);

    const timeDifference = validTo - now;

    if (timeDifference <= 0) {
      return "Expired";
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );

    if (days > 0) {
      return `${days} days ${hours} hours left`;
    } else if (hours > 0) {
      return `${hours} hours ${minutes} minutes left`;
    } else if (minutes > 0) {
      return `${minutes} minutes left`;
    } else {
      return "Less than a minute left";
    }
  };

  // Determine whether to use the selected subscription or the default logic
  const subscription = selectedSubscription || subscriptions.find(
    (sub) => sub.discountedAmount < sub.amount
  ) ||
    subscriptions.slice().sort((a, b) => a.amount - b.amount)[1];

  const isDiscounted = subscription?.discountedAmount < subscription?.amount;
  const remainingTime = subscription?.discountValidTo
    ? calculateRemainingTime(subscription?.discountValidTo)
    : null;

  return (
    <div>
      {showMobilePopup && subscriptions.length > 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#F7F7F7] p-4 shadow-lg z-50">
          <div className="flex items-center gap-4">
            <div className="flex-1 text-black text-left w-full">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1 items-center">
                      {isDiscounted ? (
                        <>
                          <span className="text-lg text-black font-semibold opacity-50">
                            <del>
                              ₹
                              {subscription.isSpecialSubscription
                                ? (subscription.amount * 1.5).toFixed(2)
                                : subscription.amount}
                            </del>
                          </span>
                          <span className="text-2xl font-semibold text-black">
                            ₹{subscription.discountedAmount.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-semibold text-black">
                          ₹{subscription.amount}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm">{subscription.planType}</p>
                  <p className="text-gray-500 text-sm pt-1">
                    {subscription.durationMonth}{" "}
                    {subscription.isCustom ? "Days" : "Month"} Access
                  </p>
                </div>
                {/* {remainingTime && isDiscounted && (
                  <div className="inline-block bg-gradient-to-r from-[#00c394] to-[#00a143] text-black py-1 px-3 rounded-lg font-bold text-sm items-center gap-2">
                    <i className="fas fa-clock"></i>
                    Limited Time Offer
                  </div>
                )} */}
              </div>
            </div>
            <button
              onClick={() =>
                handleBuyNowClick(
                  subscription.subscriptionId,
                  subscription.planType,
                  isDiscounted
                    ? subscription.discountedAmount
                    : subscription.amount,
                  subscription.isCustom,
                  subscription.durationMonth,
                  subscription.chatId
                )
              }
              className="text-lg px-8 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center py-3 bg-[#0081F11A]"
            >
              Buy Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileCourse;
