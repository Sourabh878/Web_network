import { useState } from "react";
import DomainInput from "./components/DomainInput";
import ResultsSection from "./components/ResultsSection";
import Gemini from "./components/Gemini"; // import Gemini
import axios from "axios";

function App() {
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [headers, setHeaders] = useState(null);

  const [geminiQuery, setGeminiQuery] = useState("");
  const [geminiResponse, setGeminiResponse] = useState("");
  const [showGemini, setShowGemini] = useState(false);

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

  const handleExplain = (query) => {
    setGeminiQuery(query);
    setGeminiResponse(""); // Clear old response
    setShowGemini(prev => !prev);   // Show Gemini only when user clicks Explain
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex h-full w-9/12 mx-auto">
        {/* Left section with results, taking 65% of width */}
        <div className="w-8/12 mr-4">
          <h1 className="text-3xl font-bold mb-4">Website Security Analyzer</h1>
          <DomainInput domain={domain} setDomain={setDomain} fetchAll={fetchAll} />

          <ResultsSection
            results={results}
            loading={loading}
            headers={headers}
            onExplain={handleExplain} // Pass it down
          />
        </div>

        {/* Right section for Gemini, taking 35% of width */}
        {showGemini && (
          <div className="w-4/12 bg-white p-4 rounded shadow h-fit fixed right-10">
            <h2 className="text-xl font-semibold mb-2">Gemini's Explanation</h2>
            <Gemini finalQuery={geminiQuery} setResponse={setGeminiResponse} domain={domain} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
