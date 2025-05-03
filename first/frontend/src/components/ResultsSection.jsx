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

const ResultsSection = ({ results, loading, headers, onExplain }) => {
  return (
    <div>
      {loading && <p className="mt-4">Loading...</p>}

      {results.ipinfo && (
        <IPInfo ipinfo={results.ipinfo} onExplain={onExplain} />
      )}
      {results.whois && (
        <WHOISInfo whois={results.whois} onExplain={onExplain} />
      )}
      {results.ping && (
        <PingInfo ping={results.ping} onExplain={onExplain} />
      )}
      {results.ssl && (
        <SSLInfo ssl={results.ssl} onExplain={onExplain} />
      )}
      {results.dns && (
        <DNSRecords dns={results.dns} onExplain={onExplain} />
      )}
      {results.ports && (
        <PortsInfo ports={results.ports} onExplain={onExplain} />
      )}
      {headers && (
        <SecurityHeaders headers={headers} onExplain={onExplain} />
      )}
      {results.malware && (
        <MalwareInfo malware={results.malware} onExplain={onExplain} />
      )}
      {results.cookies && (
        <CookiesInfo cookies={results.cookies} onExplain={onExplain} />
      )}
    </div>
  );
};

export default ResultsSection;
