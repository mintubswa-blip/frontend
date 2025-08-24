import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewApplication = () => {
  const navigate = useNavigate();
  const [applicationData, setApplicationData] = useState(null);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadApplication();
  }, []);

  const loadApplication = async () => {
    try {
      // Get application ID from URL params or localStorage
      const applicationId = new URLSearchParams(window.location.search).get('id') || 
                           localStorage.getItem('lastApplicationId');
      
      if (!applicationId) {
        setError('No application ID found');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/application/${applicationId}`);
      const result = await response.json();

      if (response.ok) {
        setApplication(result.application);
        setApplicationData(result.application);
      } else {
        setError(result.message || 'Failed to load application');
      }
    } catch (err) {
      console.error('Error loading application:', err);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-700 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="https://www.valmo.in/static-assets/valmo-web/valmo-logo-white.svg" alt="VALMO" className="h-8" />
            <h1 className="text-2xl font-bold">VALMO Logistics</h1>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all"
          >
            <i className="fas fa-home mr-2"></i>Home
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8 px-8 text-center">
            <div className="mb-4">
              <i className="fas fa-check-circle text-6xl mb-4"></i>
              <h1 className="text-3xl font-bold">Application Submitted Successfully!</h1>
              <p className="text-green-100 mt-2">Your franchise application has been received and is under review.</p>
            </div>
          </div>

          {application && (
            <div className="p-8">
              {/* Application Summary */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Application Summary</h2>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Application Number</p>
                      <p className="font-bold text-lg">{application.applicationNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Submission Date</p>
                      <p className="font-bold">{new Date(application.submissionDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        {application.status || 'Under Review'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Applicant Name</p>
                      <p className="font-bold">{application.fullName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">What Happens Next?</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Application Review</h4>
                      <p className="text-gray-600">Our team will review your application within 2-3 business days.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Initial Screening</h4>
                      <p className="text-gray-600">We'll verify your documents and contact your references.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Interview Process</h4>
                      <p className="text-gray-600">If selected, we'll schedule a detailed discussion about the franchise opportunity.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Final Approval</h4>
                      <p className="text-gray-600">Upon successful completion, you'll receive your franchise agreement.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Information */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-yellow-800 mb-2">
                  <i className="fas fa-info-circle mr-2"></i>Important Information
                </h3>
                <ul className="text-yellow-700 space-y-2">
                  <li>• Keep your application number safe for future reference</li>
                  <li>• You'll receive email updates at the provided email address</li>
                  <li>• Our team may contact you for additional information if needed</li>
                  <li>• Processing time may vary based on application volume</li>
                </ul>
              </div>

              {/* Contact Information */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Need Help?</h3>
                <p className="text-gray-600 mb-4">If you have any questions about your application, please contact us:</p>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
                  <div className="flex items-center">
                    <i className="fas fa-envelope text-blue-600 mr-2"></i>
                    <span>support@valmodeliver.in</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-phone text-blue-600 mr-2"></i>
                    <span>+91-XXXXXXXXXX</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <img 
              src="https://www.valmo.in/static-assets/valmo-web/valmo-logo-white.svg" 
              alt="VALMO" 
              className="h-8 mx-auto mb-4"
            />
            <p className="text-sm">© 2024 VALMO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ViewApplication;
