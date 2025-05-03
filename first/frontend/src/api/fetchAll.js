// src/api/fetchAll.js
import axios from "axios";

const fetchAll = async (domain) => {
  const [
    ipinfo, whois, ping, ssl, dns, ports,
    headersRes, malware, cookies
  ] = await Promise.all([
    axios.get(`http://localhost:5000/api/ipinfo?domain=${domain}`),
    axios.get(`http://localhost:5000/api/whois?domain=${domain}`),
    axios.get(`http://localhost:5000/api/ping?domain=${domain}`),
    axios.get(`http://localhost:5000/api/ssl?domain=${domain}`),
    axios.get(`http://localhost:5000/api/dns?domain=${domain}`),
    axios.get(`http://localhost:5000/api/ports?domain=${domain}`),
    axios.get(`http://localhost:5000/api/security-headers?domain=${domain}`),
    axios.get(`http://localhost:5000/api/malware?domain=${domain}`),
    axios.get(`http://localhost:5000/api/cookies?url=${domain}`)
  ]);

  return {
    ipinfo: ipinfo.data,
    whois: whois.data.whois,
    ping: ping.data,
    ssl: ssl.data,
    dns: dns.data.records,
    ports: ports.data,
    headers: headersRes.data.headers,
    malware: malware.data,
    cookies: cookies.data.cookies
  };
};

export default fetchAll;
