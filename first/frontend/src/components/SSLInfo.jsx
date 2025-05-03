import React from "react";

const SSLInfo = ({ ssl, onExplain }) => {
  const handleExplain = () => {
    const prompt = `Explain this SSL certificate information:\n${JSON.stringify(ssl, null, 2)}`;
    onExplain(prompt);
  };

  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold">SSL Info</h2>
      <p><b>Status:</b> {ssl.status}</p>
      <p><b>Host:</b> {ssl.host}</p>

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

export default SSLInfo;
