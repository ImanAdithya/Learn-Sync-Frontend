import { useState } from "react";
import axios from "axios";
import { IoIosArrowForward } from "react-icons/io";

export const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const API_KEY = "AIzaSyDQx4p3UpBn_AsazdOSMOegvqoFd4nUE-I"; // Replace with your actual API key

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessage = { role: "user", content: input };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setInput("");
        setLoading(true);

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
                {
                    contents: [{ role: "user", parts: [{ text: input }] }],
                }
            );

            const botResponseText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

            // Check if response contains code
            const isCode = botResponseText.includes("```");
            let formattedContent = botResponseText;

            if (isCode) {
                formattedContent = botResponseText.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
                    return `<pre><code class="language-${lang || 'plaintext'}">${code}</code></pre>`;
                });
            }

            const botResponse = {
                role: "assistant",
                content: formattedContent,
                isCode,
            };

            setMessages([...updatedMessages, botResponse]);
        } catch (error) {
            console.error("Error fetching response:", error);
        }

        setLoading(false);
    };

    // Function to handle Enter key press
    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !loading) {
            event.preventDefault(); // Prevents new line in input field
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col font-anek p-5 gap-5">
            <div className="flex border border-gray-300 rounded-xl py-2 px-5 items-center">
                <div className="flex flex-col border-r border-gray-400 pr-10">
                    <p className="text-[17px] font-semibold">May</p>
                    <p className="text-[13px] font-medium text-gray-700">
                        Today is Saturday, May 9th, 2025
                    </p>
                </div>
                <div className="flex pl-5 items-center gap-2 flex-1">
                    <h1 className="text-[20px] font-semibold">AI Chat</h1>
                    <div className="text-[17px] font-medium text-gray-700">-</div>
                    <h4 className="text-[17px] font-medium text-gray-700">Using Gemini</h4>
                </div>
                <div>
                    <button
                        className="text-[16px] font-semibold bg-black text-white rounded-md w-[115px] pt-2"
                        onClick={() => setMessages([])}
                    >
                        New Chat
                    </button>
                </div>
            </div>

            {/* Chat Display */}
            <div className="flex flex-col border border-gray-300 rounded-xl h-[490px] p-5">
                <div className="overflow-auto p-5 h-[400px] flex flex-col gap-3">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-3 rounded-xl w-fit max-w-[75%] ${
                                msg.role === "user"
                                    ? "bg-blue-500 text-white self-end"
                                    : "bg-gray-200 text-black self-start"
                            }`}
                        >
                            {msg.isCode ? (
                                <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                            ) : (
                                msg.content
                            )}
                        </div>
                    ))}
                    {loading && <p className="text-gray-500 self-start">Typing...</p>}
                </div>

                {/* Input Area */}
                <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-2 w-full">
                    <input
                        type="text"
                        placeholder="Ask Any Question....."
                        className="flex-1 outline-none placeholder-gray-400 text-[16px] px-2 py-2"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
                    >
                        <IoIosArrowForward className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
            </div>
        </div>
    );
};
