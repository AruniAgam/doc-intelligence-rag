module.exports = {

"[project]/src/app/chat/[docId]/page.jsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ChatPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
;
function ChatPage() {
    const { docId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [question, setQuestion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [chatSessionId, setChatSessionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Load saved session ID from localStorage on first render
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const storedSessionId = localStorage.getItem(`chat_session_${docId}`);
        console.log("Loaded session from storage:", storedSessionId);
        if (storedSessionId) {
            setChatSessionId(parseInt(storedSessionId));
        }
    }, [
        docId
    ]);
    // Load chat history when session ID is set
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadChatHistory = async ()=>{
            if (!chatSessionId) return;
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/chat-history/${chatSessionId}/`);
                const data = await res.json();
                setMessages(data);
            } catch (err) {
                console.error('Failed to load chat history:', err);
            }
        };
        loadChatHistory();
    }, [
        chatSessionId
    ]);
    const askQuestion = async ()=>{
        if (!question.trim()) return;
        const userMessage = {
            type: 'question',
            text: question
        };
        setMessages((prev)=>[
                ...prev,
                userMessage
            ]);
        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/api/ask-question/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    document_id: parseInt(docId),
                    question: question,
                    chat_session_id: chatSessionId,
                    top_k: 4
                })
            });
            if (!res.ok) {
                const errorText = await res.text();
                console.error("API error response:", res.status, errorText);
                throw new Error('Failed to get answer');
            }
            const data = await res.json();
            // Save session ID to state and localStorage
            if (!chatSessionId && data.chat_session_id) {
                setChatSessionId(data.chat_session_id);
                localStorage.setItem(`chat_session_${docId}`, data.chat_session_id);
            }
            console.log("API response:", data);
            console.log("Sources type:", typeof data.sources, Array.isArray(data.sources));
            const botMessage = {
                type: 'answer',
                text: data.answer || 'No answer returned.',
                sources: data.sources || []
            };
            setMessages((prev)=>[
                    ...prev,
                    botMessage
                ]);
        } catch (err) {
            console.error(err);
            setMessages((prev)=>[
                    ...prev,
                    {
                        type: 'answer',
                        text: 'Error getting response.'
                    }
                ]);
        } finally{
            setLoading(false);
            setQuestion('');
        }
    };
    const handleKeyDown = (e)=>{
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            askQuestion();
        }
    };
    const clearChat = ()=>{
        localStorage.removeItem(`chat_session_${docId}`);
        setMessages([]);
        setChatSessionId(null);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6 max-w-3xl mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-xl font-bold mb-4",
                children: [
                    "Chat with Document #",
                    docId
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/chat/[docId]/page.jsx",
                lineNumber: 108,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm text-gray-500",
                        children: chatSessionId ? `Session ID: ${chatSessionId}` : 'No session started'
                    }, void 0, false, {
                        fileName: "[project]/src/app/chat/[docId]/page.jsx",
                        lineNumber: 111,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: clearChat,
                        className: "text-sm text-red-600 hover:underline",
                        children: "Clear Chat"
                    }, void 0, false, {
                        fileName: "[project]/src/app/chat/[docId]/page.jsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/chat/[docId]/page.jsx",
                lineNumber: 110,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border rounded p-4 h-[400px] overflow-y-auto space-y-4 mb-4 bg-gray-50",
                children: [
                    messages.map((msg, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `p-2 rounded ${msg.type === 'question' ? 'bg-pink-500 text-right' : 'bg-green-500 text-left'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: msg.text
                                }, void 0, false, {
                                    fileName: "[project]/src/app/chat/[docId]/page.jsx",
                                    lineNumber: 130,
                                    columnNumber: 13
                                }, this),
                                msg.type === 'answer' && Array.isArray(msg.sources) && msg.sources && msg.sources.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-1 text-xs text-gray-200",
                                    children: [
                                        "Sources:",
                                        ' ',
                                        msg.sources.map((src, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "Chunk #",
                                                    src.chunk_index,
                                                    src.page_number ? ` (Page ${src.page_number})` : '',
                                                    ' ',
                                                    i < msg.sources.length - 1 ? '· ' : ''
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/src/app/chat/[docId]/page.jsx",
                                                lineNumber: 136,
                                                columnNumber: 11
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/chat/[docId]/page.jsx",
                                    lineNumber: 133,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, idx, true, {
                            fileName: "[project]/src/app/chat/[docId]/page.jsx",
                            lineNumber: 124,
                            columnNumber: 11
                        }, this)),
                    loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "italic text-gray-500",
                        children: "Generating answer..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/chat/[docId]/page.jsx",
                        lineNumber: 149,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/chat/[docId]/page.jsx",
                lineNumber: 122,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                rows: 2,
                value: question,
                onChange: (e)=>setQuestion(e.target.value),
                onKeyDown: handleKeyDown,
                className: "w-full p-2 border rounded mb-2",
                placeholder: "Type your question and press Enter..."
            }, void 0, false, {
                fileName: "[project]/src/app/chat/[docId]/page.jsx",
                lineNumber: 152,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: askQuestion,
                className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700",
                disabled: loading,
                children: "Ask"
            }, void 0, false, {
                fileName: "[project]/src/app/chat/[docId]/page.jsx",
                lineNumber: 160,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/chat/[docId]/page.jsx",
        lineNumber: 107,
        columnNumber: 5
    }, this);
}
}}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}}),
"[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-ssr] (ecmascript)");
}}),

};

//# sourceMappingURL=_174848e4._.js.map