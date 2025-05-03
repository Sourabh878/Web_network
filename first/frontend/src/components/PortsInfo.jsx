import React from "react";

const PortsInfo = ({ ports }) => {
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
    </div>
  );
};

export default PortsInfo;
