import React, { useState } from "react";
import axios from "axios";
import DomainInput from "./components/DomainInput";
import ResultsSection from "./components/ResultsSection";

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
        axios.get(`http://localhost:5000/api/cookies?url=${domain}`),
      ]);

      setResults({
        ipinfo: ipinfo.data,
        whois: whois.data.whois,
        ping: ping.data,
        ssl: ssl.data,
        dns: dns.data.records,
        ports: ports.data,
        malware: malware.data,
        cookies: cookies.data.cookies,
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
        <DomainInput domain={domain} setDomain={setDomain} fetchAll={fetchAll} />
        <ResultsSection 
          results={results} 
          loading={loading} 
          headers={headers} 
        />
      </div>
    </div>
  );
}

export default App;
