import { useEffect,useRef,useState } from "react";
import axios from "axios";
import {
  Bot,
  Send,
  User,
  Sparkles,
  RotateCcw,
} from "lucide-react";

function AISection({onDepartmentSelect}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I'm your AI Health Assistant. How can I help you today?",
    },
  ])
  const[chatHistory, setChatHistory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [department,setDepartment] = useState("");
  const[isEmergency,setIsEmergency]= useState(false);

  const chatContainerRef = useRef(null);
  useEffect(() => {
    const container = chatContainerRef.current;
    if(container) {
      container.scrollTo({
        top:container.scrollHeight,
        behavior:"smooth",
      })
    }
  },[messages,loading]);

 const handleSend = async (e) => {
  e.preventDefault();

  if (!message.trim() || loading) {
    return;
  }

  const userMessage = message.trim();

  // Show user message
  setMessages((previous) => [
    ...previous,
    {
      sender: "user",
      text: userMessage,
    },
  ]);

  setMessage("");
  setLoading(true);

  // Prepare conversation history
  const updatedHistory = [
    ...chatHistory,
    {
      role: "user",
      content: userMessage,
    },
  ].slice(-10);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/ai/chat`,
      {
        message: userMessage,
        history: chatHistory,
      }
    );

    const aiMessages = response.data.messages || [];

    // Detect emergency immediately
    const emergencyDetected = response.data.emergency === true || response.data.emergency === "true";
    setIsEmergency(emergencyDetected);
   
    // Detect department immediately
    if(response.data.department){
      setDepartment(response.data.department);
      if(onDepartmentSelect){
        onDepartmentSelect(response.data.department);
      }
    }
    // Show AI messages one by one
    for (let i = 0; i < aiMessages.length; i++) {
      await new Promise((resolve) =>
        setTimeout(resolve, i === 0 ? 500 : 800)
      );

      setMessages((previous) => [
        ...previous,
        {
          sender: "ai",
          text: aiMessages[i],
        },
      ]);
    }

    // Save complete conversation
    setChatHistory([
      ...updatedHistory,
      {
        role: "assistant",
        content: aiMessages.join(" "),
      },
    ].slice(-10));

  } catch (error) {
    console.error("AI chat error:", error);

    setMessages((previous) => [
      ...previous,
      {
        sender: "ai",
        text: "Sorry, I'm unable to connect to the health assistant right now.",
      },
    ]);
  } finally {
    setLoading(false);
  }
};

const handleNewChat = () => {
  setMessages([
    {
      sender: "ai",
      text: "Hello! I'm your AI Health Assistant. How can I help you today?",
    },
  ]);
  setChatHistory([]);
  setDepartment("");
  setIsEmergency(false);
  setMessage("")
};

  return (
    <section id="ai-assistant" className="bg-slate-50 px-6 py-24">

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

          {/* Left Side */}
          <div className="animate-fade-in">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-600">
              <Sparkles size={16} />  AI-Powered Healthcare
            </div>

            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Your AI Health <span className="text-blue-600"> Assistant</span>
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-500">
              Describe your health concern in your own words and get general health information from our AI assistant.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Describe your symptoms naturally",
                "Get general health information",
                "Find the right department",
                "Continue to appointment booking",
              ].map((item) => (

                <div key={item} className="flex items-center gap-3">

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    ✓
                  </div>
                  <span className="font-medium text-slate-700">{item} </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Box */}
          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl shadow-blue-100">

            {/* Header */}
           <div className="flex items-center justify-between bg-linear-to-r from-blue-600 to-cyan-500 p-5 text-white">

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                <Bot size={26} />
              </div>

              <div>
                <h3 className="font-bold">
                  MediCare AI
                </h3>

                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <span className="h-2 w-2 rounded-full bg-green-300" />
                  Online
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNewChat}
              className="flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-sm font-semibold transition hover:bg-white/25"
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">
                New Chat
              </span>
            </button>

          </div>

            {/* Messages */}
            <div ref={chatContainerRef}
            className="h-150 space-y-5 overflow-y-auto bg-slate-50 p-6 scroll-smooth">

              {messages.map((item, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    item.sender === "user" ? "justify-end" : "justify-start"
                  }`} >

                  {item.sender === "ai" && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                      <Bot size={18} />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                      item.sender === "user"
                        ? "rounded-br-md bg-blue-600 text-white shadow-md shadow-blue-100"
                        : "rounded-bl-md bg-white text-slate-700 shadow-sm"
                    }`}
                  >
                    {item.text}
                  </div>

                  {item.sender === "user" && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-600">
                      <User size={18} />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-end gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Bot size={18} />
                  </div>

                  <div className="rounded-2xl rounded-bl-md bg-white px-5 py-3 shadow-sm">
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" />
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
                        style={{ animationDelay: "0.15s" }}
                      />
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
                        style={{ animationDelay: "0.3s" }}
                      />
                    </div>
                  </div>
                </div>
)}
            </div>

            {isEmergency && (
                <div className="border-t border-red-200 bg-red-50 px-5 py-4">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                      ⚠
                    </div>

                    <div>
                      <p className="font-bold text-red-700">
                        Emergency Medical Attention
                      </p>

                      <p className="mt-1 text-sm leading-6 text-red-600">
                        Your symptoms may require urgent medical attention.
                        Please seek immediate medical care or contact your local
                        emergency service.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {department && (
              <div className="border-t border-blue-100 bg-blue-50 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                   Suggested Department
                </p>

               <div className="mt-2 flex items-center justify-between gap-4">
                 <div>
                   <p className="text-lg font-bold text-slate-900">
                     {department}
                   </p>

                   <p className="text-sm text-slate-500">
                    This is general guidance, not a medical diagnosis.
                   </p>
                 </div>

               <button
                 type="button"
                 onClick={()=>{
                  const doctorsSection = document.getElementById("doctors");
                  if(doctorsSection){
                    doctorsSection.scrollIntoView({
                      behavior : "smooth",
                    })
                  }
                 }}
                 className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                  Find Doctors
               </button>
               </div>
             </div>
           )}

         {/* Quick Suggestions + Input */}
         <div className="border-t border-slate-100 bg-white">

          {/* Quick Suggestions */}
          <div className="px-4 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Quick suggestions
            </p>


            <div className="flex flex-wrap gap-2">
              {[
                "Chest pain",
                "Headache",
                "Joint pain",
                "Child health",
                "Tooth pain",
                "Eye problems",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setMessage(suggestion)}
                  disabled={loading}
                  className="rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:border-blue-200 hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

         {/* Input */}
            <form
              onSubmit={handleSend}
              className="flex gap-3 border-t border-slate-100 bg-white p-4"
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your symptoms..."
                disabled={loading}
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              />

              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}

export default AISection;