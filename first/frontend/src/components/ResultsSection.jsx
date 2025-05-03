import React from "react";
import IPInfo from "./IPInfo";
import WHOISInfo from "./WHOISInfo";
import PingInfo from "./PingInfo";
import SSLInfo from "./SSLInfo";
import DNSRecords from "./DNSRecords";
import PortsInfo from "./PortsInfo";
import SecurityHeaders from "./SecurityHeaders";
import MalwareInfo from "./MalwareInfo";
import CookiesInfo from "./CookiesInfo";

const ResultsSection = ({ results, loading, headers }) => {
  return (
    <div>
      {loading && <p className="mt-4">Loading...</p>}

      {results.ipinfo && <IPInfo ipinfo={results.ipinfo} />}
      {results.whois && <WHOISInfo whois={results.whois} />}
      {results.ping && <PingInfo ping={results.ping} />}
      {results.ssl && <SSLInfo ssl={results.ssl} />}
      {results.dns && <DNSRecords dns={results.dns} />}
      {results.ports && <PortsInfo ports={results.ports} />}
      {headers && <SecurityHeaders headers={headers} />}
      {results.malware && <MalwareInfo malware={results.malware} />}
      {results.cookies && <CookiesInfo cookies={results.cookies} />}
    </div>
  );
};

export default ResultsSection;
