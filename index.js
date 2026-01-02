import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom';
import lottie from 'lottie-web';

function AmeenChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [status, setStatus] = useState('جاهز');
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

        setStatus('تم الاستلام');
        setIsThinking(true);
        animation.current?.play();

        try {
            setStatus('جارٍ التحليل...');
            const response = await fetch(window.ENV.API_BASE_URL + '/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg.content })
            });

            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            const aiMsg = { role: 'assistant', content: data.reply || data.message || 'تمت المعالجة' };
            setMessages(prev => [...prev, aiMsg]);
            
        } catch (error) {
            console.error('Error:', error);
            const errorMsg = { role: 'assistant', content: 'حدث خطأ في الاتصال بالنظام.' };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setStatus('جاهز');
            setIsThinking(false);
            animation.current?.stop();
        }
    };

    return React.createElement('div', { className: "min-h-screen flex flex-col p-6" },
        React.createElement('div', { className: "bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 mb-6 glow" },
            React.createElement('div', { className: "flex justify-between items-center" },
                React.createElement('h1', { className: "text-2xl font-bold" }, "Ameen AI"),
                React.createElement('span', { className: "text-sm text-gray-400" }, "v8.5")
            ),
            React.createElement('div', { className: "text-sm mt-2" },
                React.createElement('span', { className: "text-blue-400" }, "الحالة: "),
                React.createElement('span', { className: "text-green-400" }, status)
            )
        ),
        React.createElement('div', { className: "flex-1 bg-slate-800/30 rounded-lg p-6 mb-4 overflow-y-auto space-y-4" },
            messages.map((msg, idx) => 
                React.createElement('div', { key: idx, className: msg.role === 'user' ? 'flex justify-start' : 'flex justify-end' },
                    React.createElement('div', { className: "max-w-2xl p-4 rounded-lg " + (msg.role === 'user' ? 'bg-blue-600/30' : 'bg-purple-600/30') },
                        msg.content
                    )
                )
            ),
            isThinking && React.createElement('div', { className: "flex justify-end" },
                React.createElement('div', { className: "bg-slate-700/50 rounded-lg p-4 flex items-center gap-3" },
                    React.createElement('div', { ref: lottieContainer, className: "w-8 h-8" }),
                    React.createElement('span', { className: "text-sm text-gray-300" }, "يفكر...")
                )
            )
        ),
        React.createElement('div', { className: "bg-slate-800/50 rounded-lg p-4 flex gap-3" },
            React.createElement('input', {
                type: "text",
                value: input,
                onChange: (e) => setInput(e.target.value),
                onKeyPress: (e) => e.key === 'Enter' && handleSend(),
                placeholder: "تحدث هنا...",
                className: "flex-1 bg-slate-700/50 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            }),
            React.createElement('button', {
                onClick: handleSend,
                className: "bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold transition-colors"
            }, "إرسال")
        )
    );
}

const root = createRoot(document.getElementById('root'));
root.render(React.createElement(AmeenChat));
