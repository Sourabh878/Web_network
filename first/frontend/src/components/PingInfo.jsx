import React from "react";

const PingInfo = ({ ping, onExplain }) => {
  const handleExplain = () => {
    const prompt = `Explain this ping response:\n${JSON.stringify(ping, null, 2)}`;
    onExplain(prompt);
  };

  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold">Ping Info</h2>
      <p><b>Alive:</b> {ping.alive.toString()}</p>
      <p><b>Time:</b> {ping.time} ms</p>

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

export default PingInfo;
