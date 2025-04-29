const express = require("express");
const cors = require("cors");
const dns = require("dns");
const whois = require("whois");
const ping = require("ping");
const axios = require("axios");
const net = require("net");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// IP and Host Info
app.get("/api/ipinfo", async (req, res) => {
  const domain = req.query.domain;
  dns.lookup(domain, async (err, address) => {
    if (err) return res.status(500).json({ error: "DNS lookup failed" });
    try {
      const ipRes = await axios.get(`http://ip-api.com/json/${address}`);
      res.json({ ip: address, location: ipRes.data });
    } catch {
      res.status(500).json({ error: "IP lookup failed" });
    }
  });
});

// WHOIS
app.get("/api/whois", (req, res) => {
  const domain = req.query.domain;
  whois.lookup(domain, (err, data) => {
    if (err) return res.status(500).json({ error: "WHOIS failed" });
    res.json({ whois: data });
  });
});

// Ping
app.get("/api/ping", async (req, res) => {
  const domain = req.query.domain;
  const result = await ping.promise.probe(domain);
  res.json(result);
});

// SSL Info
app.get("/api/ssl", async (req, res) => {
  const domain = req.query.domain;
  try {
    const { data } = await axios.get(`https://api.ssllabs.com/api/v3/analyze?host=${domain}`);
    res.json(data);
  } catch {
    res.status(500).json({ error: "SSL Info fetch failed" });
  }
});

// DNS Records
app.get("/api/dns", (req, res) => {
  const domain = req.query.domain;
  dns.resolveAny(domain, (err, records) => {
    if (err) return res.status(500).json({ error: "DNS resolve failed" });
    res.json({ records });
  });
});

// Port Scanner
function checkPort(host, port, timeout = 2000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let status = "closed";

    socket.setTimeout(timeout);
    socket.on("connect", () => {
      status = "open";
      socket.destroy();
    });
    socket.on("timeout", () => socket.destroy());
    socket.on("error", () => {});
    socket.on("close", () => resolve({ port, status }));

    socket.connect(port, host);
  });
}

app.get("/api/ports", async (req, res) => {
  const domain = req.query.domain;
  dns.lookup(domain, async (err, ip) => {
    if (err) return res.status(500).json({ error: "DNS lookup failed" });

    const portsToCheck = [21, 22, 23, 25, 53, 80, 110, 143, 443, 3306, 8080];
    const checks = await Promise.all(portsToCheck.map((port) => checkPort(ip, port)));
    res.json({ ip, ports: checks });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
