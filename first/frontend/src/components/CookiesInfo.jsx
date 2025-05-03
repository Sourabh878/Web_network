import React from "react";

const CookiesInfo = ({ cookies, onExplain }) => {
  const handleExplain = () => {
    const prompt = `Explain what the following cookies indicate about the website and their purpose:\n${JSON.stringify(cookies, null, 2)}`;
    onExplain(prompt);
  };

  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Cookies</h2>
      <ul className="text-sm">
        {cookies.map((cookie, index) => (
          <li key={index} className="mb-2">
            <strong>{cookie.name}</strong> ({cookie.type})
            <ul className="ml-4">
              <li>Domain: {cookie.domain}</li>
              <li>Secure: {cookie.secure ? "Yes" : "No"}</li>
              <li>HTTPOnly: {cookie.httpOnly ? "Yes" : "No"}</li>
              <li>SameSite: {cookie.sameSite}</li>
              <li>Expires: {cookie.expires ? new Date(cookie.expires * 1000).toLocaleString() : "N/A"}</li>
            </ul>
          </li>
        ))}
      </ul>

      {onExplain && cookies.length > 0 && (
        <button
          onClick={handleExplain}
          className="mt-3 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Explain with Gemini
        </button>
      )}
    </div>
  );
};

export default CookiesInfo;
