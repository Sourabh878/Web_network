const express = require("express");
const cors = require("cors");
const dns = require("dns");
const whois = require("whois");
const ping = require("ping");
const axios = require("axios");
const net = require("net");
const http = require("http");
const https = require("https");
const { URL } = require("url");
const puppeteer = require("puppeteer");

// const { performance } = require("perf_hooks");
// const fetch = require("node-fetch");

// const Wappalyzer = require('wappalyzer');

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



// Security Headers Check
app.get("/api/security-headers", async (req, res) => {
  const domain = req.query.domain;
  if (!domain) return res.status(400).json({ error: "Domain is required" });

  try {
    const url = new URL(`https://${domain}`);
    const lib = url.protocol === "https:" ? https : http;

    const request = lib.request(
      url,
      { method: "GET" },
      (response) => {
        const headers = response.headers;
        const requiredHeaders = [
          "strict-transport-security",
          "content-security-policy",
          "x-content-type-options",
          "x-frame-options",
          "referrer-policy",
          "permissions-policy",
          "x-xss-protection"
        ];

        const result = {};
        requiredHeaders.forEach((header) => {
          result[header] = headers[header] || null;
        });

        res.json({ headers: result });
      }
    );

    request.on("error", () => {
      res.status(500).json({ error: "Failed to fetch headers" });
    });

    request.end();
  } catch (error) {
    res.status(500).json({ error: "Invalid domain or fetch error" });
  }
});







// Malware Detection (VirusTotal API)
app.get("/api/malware", async (req, res) => {
  const domain = req.query.domain;
  const apiKey = "138836cd061e814c1e43847e5551dfc742dc1833faec7d5ecbad0746538f4639";  // Replace with your actual VirusTotal API key

  try {
    // URL encode the domain to check
    const url = `https://www.virustotal.com/api/v3/domains/${domain}`;

    const response = await axios.get(url, {
      headers: {
        "x-apikey": apiKey,
      },
    });

    const data = response.data;

    // Check if any threat is detected
    if (data.data.attributes.last_analysis_stats.malicious > 0) {
      res.json({
        status: "Malware Detected",
        malicious: data.data.attributes.last_analysis_stats.malicious,
        details: data.data.attributes.last_analysis_results,
      });
    } else {
      res.json({
        status: "No Malware Detected",
        details: data.data.attributes.last_analysis_results,
      });
    }
  } catch (error) {
    console.error("Malware detection error:", error);
    res.status(500).json({ error: "Malware detection failed" });
  }
});


// Add this at the top

// Route: Website Performance
// app.get("/api/performance", async (req, res) => {
//   const domain = req.query.domain;
//   const url = `https://${domain}`;

//   try {
//     const start = performance.now();
//     const response = await fetch(url);
//     const html = await response.text();
//     const end = performance.now();

//     const loadTime = (end - start).toFixed(2); // in ms
//     const pageSizeKB = (Buffer.byteLength(html) / 1024).toFixed(2); // in KB

//     res.json({
//       domain,
//       loadTime: parseFloat(loadTime),
//       pageSizeKB: parseFloat(pageSizeKB),
//       statusCode: response.status,
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Performance analysis failed", details: err.message });
//   }
// });



app.get("/api/cookies", async (req, res) => {
  const url = "https://"+req.query.url;
  console.log("url: ", url);
  
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });

    const cookies = await page.cookies();

    const classifyCookie = (cookie) => {
      if (cookie.name.toLowerCase().includes("session")) return "Session Cookie";
      if (cookie.name.toLowerCase().includes("auth")) return "Authentication Cookie";
      if (cookie.name.toLowerCase().includes("track") || cookie.domain.includes("google") || cookie.name.startsWith("_ga")) return "Tracking Cookie";
      return "Other";
    };

    const detailedCookies = cookies.map(c => ({
      name: c.name,
      domain: c.domain,
      secure: c.secure,
      httpOnly: c.httpOnly,
      sameSite: c.sameSite,
      expires: c.expires,
      type: classifyCookie(c),
    }));

    await browser.close();
    console.log("cookies: ", detailedCookies);
    
    res.json({ cookies: detailedCookies });
  } catch (err) {
    console.error("Cookie fetch error:", err);
    res.status(500).json({ error: "Failed to fetch cookies" });
  }
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
