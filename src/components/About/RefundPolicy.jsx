import React from "react";
import styles from "../../style";

const RefundPolicy = () => {
  return (
    <div
      className={`flex md:flex-col ${styles.paddingY} ${styles.paddingX} flex-col expertise-Bg`}
    >
      <div className="flex flex-col items-center">
        <div className="flex md:flex-row items-center flex-col justify-center gap-[1rem]">
          <div className={`flex-col text-center md:gap-[2rem] gap-0`}>
            <div className="flex flex-col justify-between items-center md:pb-[4rem] pb-[3rem]">
              <span className="font-inter font-[700] md:text-[72px] text-[40px] text-gradient md:leading-[84px] leading-[48px]">
                Refund Policy
              </span>
            </div>
            <div className="flex flex-col md:py-[2rem]">
              <div className="flex flex-col text-start px-[0.5rem] gap-12">
                <span
                  className="font-inter font-[400] text-dimWhite md:text-[18px] text-[16px] md:leading-[28px]
                   leading-[16px] text-start mt-2"
                >
                  1.1. We are not party to the agreement between creators and
                  users. If a user requests a refund from us we will not refund
                  in any case, except: 29.2. if the User intends to cancel a
                  successfully placed order before execution, the User is
                  required to contact the customer care team within 1 (one) hour
                  of making the payment, whereafter it is totally at the
                  discretion of the Website whether to issue refund. No refund
                  shall be processed once the Order has been placed and
                  executed. 29.3. Refund for multiple payment, if any, even
                  after the above precaution against the same order shall be
                  refunded in full without deduction of the transaction charges
                  as mentioned above. The Website shall only retain the cost of
                  one single order as intended to be placed by the User.
                </span>
                <span
                  className="font-inter font-[400] text-dimWhite md:text-[18px] text-[16px] md:leading-[28px]
                   leading-[16px] text-start mt-2"
                >
                  1.2. if the User intends to cancel a successfully placed order
                  before execution, the User is required to contact the customer
                  care team within 1 (one) hour of making the payment,
                  whereafter it is totally at the discretion of the Website
                  whether to issue refund. No refund shall be processed once the
                  Order has been placed and executed.
                </span>
                <span
                  className="font-inter font-[400] text-dimWhite md:text-[18px] text-[16px] md:leading-[28px]
                   leading-[16px] text-start mt-2"
                >
                  1.3. Refund for multiple payment, if any, even after the above
                  precaution against the same order shall be refunded in full
                  without deduction of the transaction charges as mentioned
                  above. The Website shall only retain the cost of one single
                  order as intended to be placed by the User.
                </span>
                <span
                  className="font-inter font-[400] text-dimWhite md:text-[18px] text-[16px] md:leading-[28px]
                   leading-[16px] text-start mt-2"
                >
                  1.4. Refunds, if applicable, are processed within 48 hours, adhering to our refund policy. 
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
