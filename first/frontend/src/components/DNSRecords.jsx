import React from "react";

const DNSRecords = ({ dns, onExplain }) => {
  const handleExplain = () => {
    const prompt = `Explain the following DNS records:\n${JSON.stringify(dns, null, 2)}`;
    onExplain(prompt);
  };

  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">DNS Records</h2>
      <ul className="text-sm">
        {dns.map((record, i) => (
          <li key={i}>• {JSON.stringify(record)}</li>
        ))}
      </ul>

      {onExplain && dns.length > 0 && (
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

export default DNSRecords;
