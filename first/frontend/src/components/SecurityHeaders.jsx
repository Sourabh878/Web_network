import React from "react";

const SecurityHeaders = ({ headers }) => {
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
    </div>
  );
};

export default SecurityHeaders;
