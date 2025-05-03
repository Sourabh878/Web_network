import React from "react";

const WHOISInfo = ({ whois, onExplain }) => {
  const handleExplain = () => {
    const prompt = `Explain this WHOIS information for a domain in simple terms:\n${whois}`;
    onExplain(prompt);
  };

  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">WHOIS Info</h2>
      <pre className="whitespace-pre-wrap text-sm">{whois}</pre>

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

export default WHOISInfo;
