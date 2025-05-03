import React from "react";

const SSLInfo = ({ ssl }) => {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold">SSL Info</h2>
      <p><b>Status:</b> {ssl.status}</p>
      <p><b>Host:</b> {ssl.host}</p>
    </div>
  );
};

export default SSLInfo;
