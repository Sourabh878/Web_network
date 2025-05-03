import React from "react";

const DNSRecords = ({ dns }) => {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold">DNS Records</h2>
      <ul className="text-sm">
        {dns.map((record, i) => (
          <li key={i}>• {JSON.stringify(record)}</li>
        ))}
      </ul>
    </div>
  );
};

export default DNSRecords;
