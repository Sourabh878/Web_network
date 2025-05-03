import React from "react";

const SecurityHeaders = ({ headers, onExplain }) => {
  const handleExplain = () => {
    const prompt = `Explain the following HTTP security headers:\n${JSON.stringify(headers, null, 2)}`;
    onExplain(prompt);
  };

  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">HTTP Security Headers</h2>
      <ul className="text-sm">
        {Object.entries(headers).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong>{" "}
            {value ? (
              <span className="text-green-700">{value}</span>
            ) : (
              <span className="text-red-600">Not Set</span>
            )}
          </li>
        ))}
      </ul>

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

export default SecurityHeaders;
