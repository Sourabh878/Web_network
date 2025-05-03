import React from "react";

const DomainInput = ({ domain, setDomain, fetchAll }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Enter domain (e.g. example.com)"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        className="w-full p-2 rounded border mb-4"
      />
      <button
        onClick={fetchAll}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Analyze
      </button>
    </div>
  );
};

export default DomainInput;
