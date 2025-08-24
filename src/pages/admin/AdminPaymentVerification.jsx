<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Payment Verification - VALMO Admin</title>
  {/* Favicon */}
  <link rel="icon" type="image/x-icon" href="/uploads/fevicon.jpg" />
  <link rel="shortcut icon" type="image/x-icon" href="/uploads/fevicon.jpg" />
  <link rel="apple-touch-icon" href="/uploads/fevicon.jpg" />
  <meta name="msapplication-TileImage" content="/uploads/fevicon.jpg" />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
  />
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n        body {\n            font-family: 'Inter', sans-serif;\n            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);\n            min-height: 100vh;\n        }\n        .card {\n            background: white;\n            border-radius: 15px;\n            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);\n        }\n    "
    }}
  />
  {/* Header */}
  <header className="bg-[#092d5e] text-white py-4 px-6 shadow-lg">
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <img
          src="https://www.valmo.in/static-assets/valmo-web/valmo-logo-white.svg"
          alt="Valmo Logo"
          className="h-10 mr-4"
        />
        <h1 className="text-2xl font-bold">Payment Verification</h1>
      </div>
      <a
        href="admin-home.html"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        <i className="fas fa-arrow-left mr-2" />
        Back to Dashboard
      </a>
    </div>
  </header>
  {/* Main Content */}
  <main className="container mx-auto px-6 py-8">
    {/* Alert messages */}
    <div id="messageBox" className="hidden text-center py-3 mb-4 rounded-lg" />
    {/* Pending Payments */}
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          <i className="fas fa-clock mr-2 text-yellow-600" />
          Pending Payment Verifications
        </h2>
        <button
          onclick="loadPendingPayments()"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <i className="fas fa-refresh mr-2" />
          Refresh
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-700">
                Customer
              </th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">
                Customer ID
              </th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">
                Payment Stage
              </th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">
                Amount
              </th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">
                Method
              </th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">
                Date
              </th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody id="paymentsTable">
            {/* Payments will be populated here */}
          </tbody>
        </table>
      </div>
      <div id="noPayments" className="text-center py-8 hidden">
        <i className="fas fa-check-circle text-6xl text-green-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Pending Payments
        </h3>
        <p className="text-gray-500">All payments have been verified!</p>
      </div>
    </div>
  </main>
  {/* FOOTER */}
  <footer className="bg-gray-900 text-gray-300 py-6 mt-8">
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-center md:text-left">
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
</>
