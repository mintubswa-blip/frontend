/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [customerSession, setCustomerSession] = useState(null);
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [timer, setTimer] = useState(180);
  const [timerInterval, setTimerInterval] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
    time: "",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const session = localStorage.getItem("customerSession");
    if (!session) {
      navigate("/customer-login");
      return false;
    }

    const parsedSession = JSON.parse(session);
    setCustomerSession(parsedSession);
    loadApplicationDetails(parsedSession.customerId);
    setupRealTimeUpdates(parsedSession.customerId);
    return true;
  };

  const loadApplicationDetails = async (customerId) => {
    try {
      const response = await fetch(`/api/customer-application/${customerId}`);
      const result = await response.json();

      if (response.ok && result.application) {
        setApplicationDetails(result.application);
      }
    } catch (err) {
      console.error("Error loading application:", err);
    }
  };

  const setupRealTimeUpdates = (customerId) => {
    const eventSource = new EventSource(`/api/customer-events/${customerId}`);

    eventSource.onmessage = function (event) {
      try {
        const data = JSON.parse(event.data);
        handleRealTimeUpdate(data);
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    };

    eventSource.onerror = function (err) {
      console.error("SSE connection error:", err);
    };
  };

  const handleRealTimeUpdate = (data) => {
    switch (data.type) {
      case "statusUpdate":
        showNotification(
          data.message,
          data.status === "Approved" ? "success" : "error"
        );
        setTimeout(() => {
          loadApplicationDetails(customerSession.customerId);
        }, 1000);
        break;
      case "appointment":
        showNotification(data.message, "info");
        break;
      default:
        console.log("Unknown update type:", data.type);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({
      show: true,
      message,
      type,
      time: new Date().toLocaleTimeString(),
    });

    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 5000);
  };

  const loadQRCode = async () => {
    try {
      const response = await fetch("/api/bank-details");
      const result = await response.json();
      return result.bankDetails?.qrCodePath || null;
    } catch (err) {
      console.error("Error loading QR code:", err);
      return null;
    }
  };

  const handlePayNow = async () => {
    await loadQRCode();
    setShowPaymentModal(true);
    startTimer();
  };

  const startTimer = () => {
    let timeLeft = 180;
    const interval = setInterval(() => {
      setTimer(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(interval);
        setShowPaymentModal(false);
        showMessage("Payment session expired. Please try again.", "error");
      }
      timeLeft--;
    }, 1000);
    setTimerInterval(interval);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  const closeModal = () => {
    setShowPaymentModal(false);
    stopTimer();
  };

  const handlePaidButton = async () => {
    if (!customerSession?.customerId) {
      showMessage("Customer session not found", "error");
      return;
    }

    try {
      const response = await fetch("/api/customer-payment-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customerSession.customerId,
          paymentStage: "booking",
          paymentMethod: "qr",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showMessage("Payment notification sent successfully!", "success");
        closeModal();
      } else {
        showMessage(
          result.message || "Failed to send payment notification",
          "error"
        );
      }
    } catch (err) {
      console.error("Error sending payment notification:", err);
      showMessage("An error occurred. Please try again.", "error");
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  if (!customerSession) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Header */}
      <header className="bg-white shadow-lg py-4 px-4 sm:px-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center">
            <img
              src="https://www.valmo.in/static-assets/valmo-web/valmo-logo-white.svg"
              alt="Valmo Logo"
              className="h-8 sm:h-10 filter invert"
            />
          </div>

          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {customerSession.name
                ? customerSession.name.charAt(0).toUpperCase()
                : "C"}
            </div>
            <span className="text-xs sm:text-sm text-gray-600 mt-2 font-medium">
              {customerSession.name || "Customer"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome, {customerSession.name || "Customer"}!
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Here's your franchise application details
            </p>
          </div>

          {/* Alert messages */}
          {message.text && (
            <div
              className={`text-center py-3 mb-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Status Tracking Panel */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              <i className="fas fa-tasks mr-3 text-blue-600"></i>Application
              Status Tracking
            </h3>

            {applicationDetails ? (
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                {/* Status Steps */}
                <div className="flex-1">
                  <div className="flex justify-between relative">
                    {/* Progress Line */}
                    <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0"></div>
                    <div
                      className="absolute top-4 left-0 h-1 bg-green-500 z-10 transition-all duration-500"
                      style={{
                        width:
                          applicationDetails.status === "Pending"
                            ? "0%"
                            : applicationDetails.status === "Approved"
                            ? "100%"
                            : applicationDetails.status === "Rejected"
                            ? "100%"
                            : "33%",
                      }}
                    ></div>

                    {/* Step 1 - Submitted */}
                    <div className="flex flex-col items-center z-20">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          applicationDetails.status
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-500"
                        }`}
                      >
                        <i className="fas fa-check"></i>
                      </div>
                      <span className="mt-2 text-xs text-center">
                        Submitted
                      </span>
                    </div>

                    {/* Step 2 - Under Review */}
                    <div className="flex flex-col items-center z-20">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          applicationDetails.status === "Approved" ||
                          applicationDetails.status === "Rejected"
                            ? "bg-green-500 text-white"
                            : applicationDetails.status === "Pending"
                            ? "bg-gray-300 text-gray-500"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {applicationDetails.status === "Approved" ||
                        applicationDetails.status === "Rejected" ||
                        applicationDetails.status !== "Pending" ? (
                          <i className="fas fa-check"></i>
                        ) : (
                          <i className="fas fa-hourglass-half"></i>
                        )}
                      </div>
                      <span className="mt-2 text-xs text-center">
                        Under Review
                      </span>
                    </div>

                    {/* Step 3 - Completed */}
                    <div className="flex flex-col items-center z-20">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          applicationDetails.status === "Approved"
                            ? "bg-green-500 text-white"
                            : applicationDetails.status === "Rejected"
                            ? "bg-red-500 text-white"
                            : "bg-gray-300 text-gray-500"
                        }`}
                      >
                        {applicationDetails.status === "Approved" ? (
                          <i className="fas fa-check"></i>
                        ) : applicationDetails.status === "Rejected" ? (
                          <i className="fas fa-times"></i>
                        ) : (
                          <i className="fas fa-flag"></i>
                        )}
                      </div>
                      <span className="mt-2 text-xs text-center">
                        Completed
                      </span>
                    </div>
                  </div>

                  {/* Status Description */}
                  <div className="mt-8 text-center">
                    <p className="text-gray-700">
                      {applicationDetails.status === "Approved"
                        ? "Congratulations! Your application has been approved."
                        : applicationDetails.status === "Rejected"
                        ? "We're sorry, but your application has been rejected."
                        : "Your application is currently under review by our team."}
                    </p>
                  </div>
                </div>

                {/* Pay Button */}
                <div className="ml-0 md:ml-6">
                  <button
                    onClick={handlePayNow}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6 py-3 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap"
                  >
                    <i className="fas fa-credit-card mr-2"></i>Pay Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <i className="fas fa-spinner fa-spin text-2xl text-blue-600 mb-2"></i>
                <p className="text-gray-600">Loading status tracking...</p>
              </div>
            )}
          </div>

          {/* Application Details Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              <i className="fas fa-file-alt mr-3 text-blue-600"></i>Your
              Application Details
            </h3>

            {applicationDetails ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3">
                  <div>
                    <strong className="text-gray-700">Name:</strong>{" "}
                    <span className="text-gray-900">
                      {applicationDetails.name}
                    </span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Phone:</strong>{" "}
                    <span className="text-gray-900">
                      {applicationDetails.phone}
                    </span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Address:</strong>{" "}
                    <span className="text-gray-900">
                      {applicationDetails.address}
                    </span>
                  </div>
                  <div>
                    <strong className="text-gray-700">PIN Code:</strong>{" "}
                    <span className="text-gray-900">
                      {applicationDetails.pincode}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <strong className="text-gray-700">
                      Investment Amount:
                    </strong>{" "}
                    <span className="text-gray-900">
                      ₹{applicationDetails.investmentAmount?.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <strong className="text-gray-700">
                      Business Experience:
                    </strong>{" "}
                    <span className="text-gray-900">
                      {applicationDetails.businessExperience}
                    </span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Application Date:</strong>{" "}
                    <span className="text-gray-900">
                      {new Date(
                        applicationDetails.dateOfApplication
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Status:</strong>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ml-2 ${
                        applicationDetails.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : applicationDetails.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {applicationDetails.status}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
                <p className="text-gray-600">
                  Loading your application details...
                </p>
              </div>
            )}
          </div>

          {/* Payment Status Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              <i className="fas fa-credit-card mr-3 text-green-600"></i>Payment
              Status
            </h3>

            <div className="text-center py-4">
              <i className="fas fa-spinner fa-spin text-2xl text-green-600 mb-2"></i>
              <p className="text-gray-600">Loading payment status...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Notification Toast */}
      <div
        className={`fixed top-20 right-5 max-w-sm transform transition-transform duration-300 z-50 ${
          notification.show ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className={`bg-white border-l-4 p-4 shadow-lg rounded-r-lg ${
            notification.type === "success"
              ? "border-green-500"
              : notification.type === "error"
              ? "border-red-500"
              : "border-blue-500"
          }`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i
                className={`text-xl ${
                  notification.type === "success"
                    ? "fas fa-check-circle text-green-500"
                    : notification.type === "error"
                    ? "fas fa-exclamation-circle text-red-500"
                    : "fas fa-info-circle text-blue-500"
                }`}
              ></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {notification.message}
              </p>
              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() =>
                  setNotification((prev) => ({ ...prev, show: false }))
                }
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-2xl relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times text-2xl"></i>
            </button>

            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Customer Dashboard
              </h2>
              <p className="text-gray-600">Use UPI to pay</p>
            </div>

            <div className="mb-6 space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">1</span> Open the app linked to
                your UPI
              </p>
              <p>
                <span className="font-semibold">2</span> Scan the QR code
              </p>
              <p>
                <span className="font-semibold">3</span> Approve your{" "}
                <span className="font-semibold text-green-600">₹1,000.00</span>{" "}
                charge to complete transaction
              </p>
            </div>

            <div className="text-center mb-6">
              <div className="w-64 h-64 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <i className="fas fa-qrcode text-6xl text-gray-400 mb-2"></i>
                  <p className="text-gray-500">QR Code will appear here</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Admin needs to upload QR code
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600 mb-1">Session expires in:</p>
                <p className="text-2xl font-bold text-red-700">
                  {formatTimer(timer)}
                </p>
              </div>
            </div>

            <div className="text-center mb-6">
              <button
                onClick={handlePaidButton}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base"
              >
                <i className="fas fa-check mr-2"></i>I have paid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6 mt-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <i className="fas fa-envelope text-blue-400"></i>
                <span className="text-sm">support@valmodeliver.in</span>
              </div>
              <p className="text-xs">© 2025 Valmo. All rights reserved.</p>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-white transition-colors">
                Terms of Use
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerDashboard;
