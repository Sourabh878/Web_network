import { useEffect, useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Gemini = ({ finalQuery, setResponse, onClose, domain }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const chatRef = useRef(null);
  const websiteContextRef = useRef(null); // stores the "current website" context
  const bottomRef = useRef(null);

  const apiKey = "AIzaSyAPXEZ7XQpt9Ity3U2vC9utUE0-lIOSCbE";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);
  

  const initChat = async () => {
    if (!chatRef.current) {
      chatRef.current = await model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "Keep answers in 5-8 lines and remember previous questions." }],
          },
          {
            role: "model",
            parts: [{ text: "Understood!" }],
          },
        ],
      });
    }
  };

  const handleSend = async (text) => {
    if (!text.trim()) return;
    await initChat();

    // Step 1: Check if the message is IP/location JSON
    try {
      const maybeJson = JSON.parse(text);
      if (maybeJson?.ip && maybeJson?.location) {
        websiteContextRef.current = `This IP/location data is for the current website:\n${text}`;
        console.log("📌 Saved website context:", websiteContextRef.current);
      }
    } catch (err) {
      // not valid JSON, ignore
    }

    // Step 2: If user says "current website", inject context
    let finalText = text;
    if (
      text.toLowerCase().includes("current website") &&
      websiteContextRef.current
    ) {
      finalText = `${websiteContextRef.current}\n\nUser Query: ${text}`;
    }
    console.log("domain: ", domain);
    
    finalText = ` current website is ${domain} and the details of current website is given below `+finalText;
    console.log("🚀 Final prompt sent to Gemini:", finalText);

    // Step 3: Send message
    const newHistory = [...chatHistory, { role: "user", parts: [{ text }] }];
    setChatHistory(newHistory);
    setUserInput("");


    const result = await chatRef.current.sendMessage(finalText);
    const responseText = result.response.text().replace(/[*]+/g, "").trim();

    const updatedHistory = [
      ...newHistory,
      { role: "model", parts: [{ text: responseText }] },
    ];

    setChatHistory(updatedHistory);
    setResponse(responseText);
  };

  useEffect(() => {
    if (finalQuery) {
      handleSend(finalQuery);
    }
  }, [finalQuery]);

  return (
    <div className="mt-6 bg-white p-4 rounded shadow flex flex-col h-[83vh]">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold mb-2">Gemini Chat</h2>
      </div>
  
      <div className="flex-1 overflow-hidden">
        <div className="space-y-2 overflow-y-auto" style={{ maxHeight: "calc(90vh - 120px)" }}>
          {chatHistory.map((msg, idx) => {
            if(idx>0)
           return <div
              key={idx}
              className={`p-2 rounded ${msg.role === "user" ? "bg-blue-100 text-right" : "bg-gray-200 text-left"}`}
              style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
            >
              <p>{msg.parts[0].text}</p>
            </div>
        })}
          <div ref={bottomRef} /> {/* 👈 Add this at the end */}
        </div>
      </div>
  
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-1 border rounded p-2 max-w-full"
          placeholder="Ask something..."
        />
        <button
          onClick={() => handleSend(userInput)}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
  
};

export default Gemini;
