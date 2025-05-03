import React from "react";

const PortsInfo = ({ ports, onExplain }) => {
  const handleExplain = () => {
    const prompt = `Explain the following open ports details:\n${JSON.stringify(ports, null, 2)}`;
    onExplain(prompt);
  };

  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold">Open Ports</h2>
      <ul className="text-sm">
        {ports.ports.map((item, i) => (
          <li key={i}>
            Port {item.port} — {item.status === "open" ? "🟢 Open" : "🔴 Closed"}
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

export default PortsInfo;
