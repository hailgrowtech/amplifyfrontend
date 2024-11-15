import React, { useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Receipt = ({ transaction, closePopup }) => {
  console.log(transaction)
  const downloadPDF = () => {
    const capture = document.querySelector(".receipt-container");

    // Ensure images are loaded
    const images = capture.getElementsByTagName("img");
    const loaded = Array.from(images).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = img.onerror = resolve; // handle both load and error
          }
        })
    );

    Promise.all(loaded).then(() => {
      const isMobile = window.innerWidth <= 768; // Define what is considered a mobile device
      const windowHeight = document.documentElement.scrollHeight;

      html2canvas(capture, {
        scale: 2,
        useCORS: true,
        logging: true,
        windowHeight: windowHeight,
        windowWidth: isMobile
          ? document.documentElement.offsetWidth * 2.2
          : document.documentElement.offsetWidth,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a3");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        const adjustedPdfHeight = pdfHeight; // Increase height by 30% for mobile
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, adjustedPdfHeight);
        pdf.save(`${transaction.transactionId}.pdf`);
        closePopup();
      });
    });
  };

  useEffect(() => {
    const images = document.querySelectorAll(".receipt-container img");
    const loadPromises = Array.from(images).map((img) => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = resolve;
        }
      });
    });

    Promise.all(loadPromises).then(() => {
      if (transaction) {
        downloadPDF();
      }
    });
  }, [transaction]);

  if (!transaction) return null;

  const {
    subscription,
    user,
    totalAmount,
    paymentMode,
    transactionId,
    transactionDate,
    invoiceId,
  } = transaction;
  const { experts, discountPercentage } = transaction.subscription;
  const invoiceDate = new Date(transactionDate).toLocaleDateString();

  const amountWithoutGst = (100 / 118) * subscription.amount;
  const gstAmount = subscription.amount - amountWithoutGst;

  // Check if the states are the same
  const sameState =
    user?.state.toLowerCase().trim() === experts?.state.toLowerCase().trim();
  const taxRate = 0.18;
  const halfTaxRate = taxRate / 2;
  const cgstSgstAmount = gstAmount / 2;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="receipt-container object-contain bg-white p-4 md:p-6 rounded-lg shadow-md w-full md:max-w-4xl mx-auto my-10 border border-gray-300 relative overflow-y-auto max-h-screen">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={() => window.location.reload()}
        >
          ✕
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6">
          Tax Invoice/Bill of Service
        </h1>
        <div className="text-center mb-2 md:mb-4">
          <p>Invoice No: {invoiceId}</p>
          <p>Original for Recipient</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 mb-4">
          <div className="flex flex-col gap-2 md:gap-4">
            <h2 className="text-lg md:text-xl font-semibold mb-2">
              Service offered by
            </h2>
            <p>
              <strong>Creator Name:</strong> {experts?.name}
            </p>
            <p>
              <strong>Creator ID:</strong> {experts?.id}
            </p>
            <p>
              <strong>Address:</strong> {experts?.address}
            </p>
            <p>
              <strong>PAN No:</strong> {experts?.pan}
            </p>
            {experts?.gst && (
              <p>
                <strong>Creator GSTIN:</strong> {experts?.gst}
              </p>
            )}
            <p>
              <strong>Transaction ID:</strong> {transactionId}
            </p>
            <p>
              <strong>Bill Date:</strong> {invoiceDate}
            </p>
            <p>
              <strong>State Code:</strong> {(experts?.gst).slice(0, 2)}
            </p>
          </div>
          <div className="flex flex-col gap-2 md:gap-4">
            <h2 className="text-lg md:text-xl font-semibold mb-2">Billed To</h2>
            <p>{user?.name}</p>
            <p>{user?.mobileNumber}</p>
            <p>{user?.email}</p>
            <p>
              <strong>Billing Address:</strong> {user?.address}
            </p>
            <p>
              <strong>State:</strong> {user?.state}
            </p>
            <p>
              <strong>Place Of Supply:</strong> {user?.state}
            </p>
            <p>
              <strong>HSN Code:</strong> 999299
            </p>
            <p>
              <strong>RCM Applicable:</strong> No
            </p>
          </div>
        </div>

        <table className="w-full mb-4 text-sm md:text-base">
          <thead>
            <tr>
              <th className="border px-2 py-1">Description</th>
              {experts?.gst && <th className="border px-2 py-1">Price</th>}
              {sameState ? (
                <>
                  {experts?.gst && <th className="border px-2 py-1">CGST%</th>}
                  {experts?.gst && <th className="border px-2 py-1">SGST%</th>}
                </>
              ) : (
                <>
                  {experts?.gst && <th className="border px-2 py-1">IGST%</th>}
                  {experts?.gst && (
                    <th className="border px-2 py-1">IGST Amt</th>
                  )}
                </>
              )}
              <th className="border px-2 py-1">Total Tax</th>
              <th className="border px-2 py-1">Amount</th>
              <th className="border px-2 py-1">Discount Percentage</th>
              <th className="border px-2 py-1">Paid Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1 text-center">
                {subscription.planType}
              </td>

              {experts?.gst && (
                <>
                  <td className="border px-2 py-1 text-center">
                    ₹ {amountWithoutGst.toFixed(2)}
                  </td>
                  {sameState ? (
                    <>
                      <td className="border px-2 py-1 text-center">
                        {(halfTaxRate * 100).toFixed(2)}% <br /> ₹
                        {cgstSgstAmount.toFixed(2)}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {(halfTaxRate * 100).toFixed(2)}% <br /> ₹
                        {cgstSgstAmount.toFixed(2)}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border px-2 py-1 text-center">
                        {(taxRate * 100).toFixed(2)}%
                      </td>
                      <td className="border px-2 py-1 text-center">
                        ₹ {gstAmount.toFixed(2)}
                      </td>
                    </>
                  )}
                </>
              )}
              <td className="border px-2 py-1 text-center">
                {cgstSgstAmount.toFixed(2) * 2}
              </td>
              <td className="border px-2 py-1 text-center">
                ₹ {(totalAmount.toFixed(2) * 100)/(100-discountPercentage)}
              </td>
              <td className="border px-2 py-1 text-center">
                {discountPercentage}%
              </td>
              <td className="border px-2 py-1 text-center">
                ₹ {totalAmount.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-between mb-4">
          <h2 className="text-lg md:text-xl font-semibold">Total</h2>
          <p className="text-lg md:text-xl font-bold">₹ {totalAmount}</p>
        </div>

        <div className="text-center mb-4">
          <img
            src={
              experts?.signatureImage
                ? `${experts?.signatureImage}?not-from-cache-please}`
                : ""
            }
            alt="Signature"
            className="w-48 md:w-96 mx-auto"
            crossOrigin="anonymous"
          />
        </div>

        <div className="text-left mb-4 text-sm md:text-base">
          <h2 className="text-lg md:text-xl font-semibold mb-2">
            TERMS & CONDITIONS
          </h2>
          <p>
            No refund policy. Please read terms & conditions and disclaimer on
            our website.
          </p>
          <p>All jurisdiction under {experts?.state}.</p>
        </div>

        <div className="text-left text-xs md:text-sm text-gray-700 mb-4">
          <p>
            This is a computer-generated receipt and does not require a
            signature.
          </p>
          <p>Contact support@copartner.in for technical support.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="text-left text-xs md:text-sm text-gray-700">
            <p>
              <a
                href="https://copartner.in/terms_of_service"
                className="text-blue-500"
              >
                Terms and Conditions
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
