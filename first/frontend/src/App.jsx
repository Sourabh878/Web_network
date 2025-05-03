import React, { useState } from "react";
import axios from "axios";
// import { Bar } from "react-chartjs-2";
// import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";

// ChartJS.register(BarElement, CategoryScale, LinearScale);

function App() {
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [headers, setHeaders] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [ipinfo, whois, ping, ssl, dns, ports, headersRes, malware, cookies] = await Promise.all([
        axios.get(`http://localhost:5000/api/ipinfo?domain=${domain}`),
        axios.get(`http://localhost:5000/api/whois?domain=${domain}`),
        axios.get(`http://localhost:5000/api/ping?domain=${domain}`),
        axios.get(`http://localhost:5000/api/ssl?domain=${domain}`),
        axios.get(`http://localhost:5000/api/dns?domain=${domain}`),
        axios.get(`http://localhost:5000/api/ports?domain=${domain}`),
        axios.get(`http://localhost:5000/api/security-headers?domain=${domain}`),
        axios.get(`http://localhost:5000/api/malware?domain=${domain}`),
        axios.get(`http://localhost:5000/api/cookies?url=${domain}`),  // Added the cookies API call
        // axios.get(`http://localhost:5000/api/performance?domain=${domain}`),
        // axios.get(`http://localhost:5000/api/techstack?domain=${domain}`)
      ]);

      setResults({
        ipinfo: ipinfo.data,
        whois: whois.data.whois,
        ping: ping.data,
        ssl: ssl.data,
        dns: dns.data.records,
        ports: ports.data,
        malware: malware.data,
        cookies: cookies.data.cookies,  // Store cookies in results
        // performance: performance.data,
        // techstack: techstack.data.technologies
      });
      setHeaders(headersRes.data.headers);
    } catch (err) {
      console.error("Error fetching info", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Website Security Analyzer</h1>
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

        {loading && <p className="mt-4">Loading...</p>}

        {results.ipinfo && (
          <div className="mt-6 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">IP & Location</h2>
            <p><b>IP:</b> {results.ipinfo.ip}</p>
            <p><b>City:</b> {results.ipinfo.location.city}</p>
            <p><b>ISP:</b> {results.ipinfo.location.isp}</p>
            <p><b>Country:</b> {results.ipinfo.location.country}</p>
          </div>
        )}

        {results.whois && (
          <div className="mt-6 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">WHOIS Info</h2>
            <pre className="whitespace-pre-wrap text-sm">{results.whois}</pre>
          </div>
        )}

        {results.ping && (
          <div className="mt-6 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">Ping Info</h2>
            <p><b>Alive:</b> {results.ping.alive.toString()}</p>
            <p><b>Time:</b> {results.ping.time} ms</p>
          </div>
        )}

        {results.ssl && (
          <div className="mt-6 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">SSL Info</h2>
            <p><b>Status:</b> {results.ssl.status}</p>
            <p><b>Host:</b> {results.ssl.host}</p>
          </div>
        )}

        {results.dns && (
          <div className="mt-6 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">DNS Records</h2>
            <ul className="text-sm">
              {results.dns.map((record, i) => (
                <li key={i}>• {JSON.stringify(record)}</li>
              ))}
            </ul>
          </div>
        )}

        {results.ports && (
          <div className="mt-6 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">Open Ports</h2>
            <ul className="text-sm">
              {results.ports.ports.map((item, i) => (
                <li key={i}>
                  Port {item.port} — {item.status === "open" ? "🟢 Open" : "🔴 Closed"}
                </li>
              ))}
            </ul>
          </div>
        )}

        {headers && (
          <div className="mt-6 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">HTTP Security Headers</h2>
            <ul className="text-sm">
              {Object.entries(headers).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong>{" "}
                  {value ? <span className="text-green-700">{value}</span> : <span className="text-red-600">Not Set</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {results.malware && (
          <div className="mt-6 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">Malware Detection</h2>
            <p><b>Status:</b> {results.malware.status}</p>
            {results.malware.status === "Malware Detected" ? (
              <ul className="text-sm">
                {Object.entries(results.malware.details).map(([scanner, result], index) => (
                  <li key={index}>
                    <strong>{scanner}:</strong> {result.category || result.result}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No malware detected.</p>
            )}
          </div>
        )}

        {/* Display Cookies */}
        {results.cookies && (
          <div className="mt-6 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">Cookies</h2>
            <ul className="text-sm">
              {results.cookies.map((cookie, index) => (
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
        )}

      </div>
    </div>
  );
}

export default App;
