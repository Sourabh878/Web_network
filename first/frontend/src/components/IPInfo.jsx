import React from "react";

const IPInfo = ({ ipinfo, onExplain }) => {

    

  const handleExplain = () => {
    const prompt = `Explain this IP and location information:\n${JSON.stringify(ipinfo, null, 2)}`;
    onExplain(prompt);
  };

  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">IP & Location</h2>
      <p><b>IP:</b> {ipinfo.ip}</p>
      <p><b>City:</b> {ipinfo.location.city}</p>
      <p><b>ISP:</b> {ipinfo.location.isp}</p>
      <p><b>Country:</b> {ipinfo.location.country}</p>
      
      {/* Explain with Gemini button */}
      {onExplain && (
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

export default IPInfo;
