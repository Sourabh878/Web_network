import React from "react";

const PingInfo = ({ ping }) => {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold">Ping Info</h2>
      <p><b>Alive:</b> {ping.alive.toString()}</p>
      <p><b>Time:</b> {ping.time} ms</p>
    </div>
  );
};

export default PingInfo;
