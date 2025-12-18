import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom';
import lottie from 'lottie-web';

function AmeenChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [status, setStatus] = useState('محسّن');
    const [isThinking, setIsThinking] = useState(false);
    const lottieContainer = useRef(null);
    const animation = useRef(null);

    useEffect(() => {
        if (lottieContainer.current && !animation.current) {
            animation.current = lottie.loadAnimation({
                container: lottieContainer.current,
                renderer: 'svg',
                loop: true,
                autoplay: false,
                path: './assets/neural_pulse.json'
            });
        }
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        
        // تم الاستلام
        setStatus('تم الاستلام');
        setIsThinking(true);
        animation.current?.play();
        await new Promise(r => setTimeout(r, 800));
        
        // جارٍ التحليل
        setStatus('جارٍ التحليل');
        await new Promise(r => setTimeout(r, 1200));
        
        // يتم إنشاء الرد
        setStatus('يتم إنشاء الرد');
        await new Promise(r => setTimeout(r, 1500));
        
        const aiMsg = { role: 'assistant', content: `تم استقبال رسالتك: "${userMsg.content}" - هذا مثال توضيحي للتكامل مع Azure AI` };
        setMessages(prev => [...prev, aiMsg]);
        
        setStatus('محسّن');
        setIsThinking(false);
        animation.current?.stop();
    };

    return (
        <div className="min-h-screen flex flex-col p-6">
            {/* Header */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 mb-6 glow">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Ameen</h1>
                    <span className="text-sm text-gray-400">v8.5</span>
                </div>
                <div className="text-sm mt-2">
                    <span className="text-blue-400">الحالة:</span> <span className="text-green-400">{status}</span>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-slate-800/30 rounded-lg p-6 mb-4 overflow-y-auto space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-2xl p-4 rounded-lg ${
                            msg.role === 'user' ? 'bg-blue-600/30' : 'bg-purple-600/30'
                        }`}>
                            <p>{msg.content}</p>
                        </div>
                    </div>
                ))}
                
                {/* Thinking Indicator */}
                {isThinking && (
                    <div className="flex justify-end">
                        <div className="bg-slate-700/50 rounded-lg p-4 flex items-center gap-3">
                            <div ref={lottieContainer} className="w-8 h-8"></div>
                            <span className="text-sm text-gray-300">يفكر...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="bg-slate-800/50 rounded-lg p-4 flex gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="اكتب رسالتك هنا..."
                    className="flex-1 bg-slate-700/50 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold transition-colors"
                >
                    إرسال
                </button>
            </div>
        </div>
    );
}

const root = createRoot(document.getElementById('root'));
root.render(<AmeenChat />);
