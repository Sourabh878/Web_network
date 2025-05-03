import React from "react";

const IPInfo = ({ ipinfo }) => {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold">IP & Location</h2>
      <p><b>IP:</b> {ipinfo.ip}</p>
      <p><b>City:</b> {ipinfo.location.city}</p>
      <p><b>ISP:</b> {ipinfo.location.isp}</p>
      <p><b>Country:</b> {ipinfo.location.country}</p>
    </div>
  );
};

export default IPInfo;
