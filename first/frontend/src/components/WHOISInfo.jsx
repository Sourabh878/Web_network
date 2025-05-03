import React from "react";

const WHOISInfo = ({ whois }) => {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold">WHOIS Info</h2>
      <pre className="whitespace-pre-wrap text-sm">{whois}</pre>
    </div>
  );
};

export default WHOISInfo;
