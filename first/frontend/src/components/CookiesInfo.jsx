import React from "react";

const CookiesInfo = ({ cookies }) => {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold">Cookies</h2>
      <ul className="text-sm">
        {cookies.map((cookie, index) => (
          <li key={index}>
            <strong>{cookie.name}</strong> ({cookie.type})
            <ul>
              <li>Domain: {cookie.domain}</li>
              <li>Secure: {cookie.secure ? "Yes" : "No"}</li>
              <li>HTTPOnly: {cookie.httpOnly ? "Yes" : "No"}</li>
              <li>SameSite: {cookie.sameSite}</li>
              <li>Expires: {cookie.expires ? new Date(cookie.expires * 1000).toLocaleString() : "N/A"}</li>
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CookiesInfo;
