(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_3707bdb4._.js", {

"[project]/src/components/CrewStateRenderer.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/react-markdown/lib/index.js [app-client] (ecmascript) <export Markdown as default>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
/**
 * Renders your Crew's steps & tasks in real-time.
 */ function CrewStateRenderer({ state, status }) {
    _s();
    const [isCollapsed, setIsCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const contentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const prevItemsLengthRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const [highlightId, setHighlightId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Combine steps + tasks
    const items = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CrewStateRenderer.useMemo[items]": ()=>{
            if (!state) return [];
            return [
                ...state.steps || [],
                ...state.tasks || []
            ].sort({
                "CrewStateRenderer.useMemo[items]": (a, b)=>new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            }["CrewStateRenderer.useMemo[items]"]);
        }
    }["CrewStateRenderer.useMemo[items]"], [
        state
    ]);
    // Highlight newly added item & auto-scroll
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CrewStateRenderer.useEffect": ()=>{
            if (!state) return;
            if (items.length > prevItemsLengthRef.current) {
                const newestItem = items[items.length - 1];
                setHighlightId(newestItem.id);
                setTimeout({
                    "CrewStateRenderer.useEffect": ()=>setHighlightId(null)
                }["CrewStateRenderer.useEffect"], 1500);
                if (contentRef.current && !isCollapsed) {
                    contentRef.current.scrollTop = contentRef.current.scrollHeight;
                }
            }
            prevItemsLengthRef.current = items.length;
        }
    }["CrewStateRenderer.useEffect"], [
        items,
        isCollapsed,
        state
    ]);
    if (!state) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: "Loading crew state..."
        }, void 0, false, {
            fileName: "[project]/src/components/CrewStateRenderer.tsx",
            lineNumber: 52,
            columnNumber: 12
        }, this);
    }
    // Hide entirely if collapsed & empty & not in progress
    if (isCollapsed && items.length === 0 && status !== "inProgress") return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-a5f3350c7a6b515a" + " " + "mt-2 text-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onClick: ()=>setIsCollapsed(!isCollapsed),
                className: "jsx-a5f3350c7a6b515a" + " " + "flex items-center cursor-pointer",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "jsx-a5f3350c7a6b515a" + " " + "mr-1",
                        children: isCollapsed ? "▶" : "▼"
                    }, void 0, false, {
                        fileName: "[project]/src/components/CrewStateRenderer.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "jsx-a5f3350c7a6b515a" + " " + "text-gray-700",
                        children: status === "inProgress" ? "Crew is analyzing..." : "Crew analysis"
                    }, void 0, false, {
                        fileName: "[project]/src/components/CrewStateRenderer.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/CrewStateRenderer.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            !isCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: contentRef,
                className: "jsx-a5f3350c7a6b515a" + " " + "max-h-[200px] overflow-auto border-l border-gray-200 pl-2 ml-1 mt-1",
                children: items.length > 0 ? items.map((item)=>{
                    const isTool = item.tool !== undefined;
                    const isHighlighted = item.id === highlightId;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-a5f3350c7a6b515a" + " " + `mb-2 ${isHighlighted ? "animate-fadeIn" : ""}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-a5f3350c7a6b515a" + " " + "font-bold text-gray-800 dark:text-gray-200",
                                children: isTool ? item.tool : item.name
                            }, void 0, false, {
                                fileName: "[project]/src/components/CrewStateRenderer.tsx",
                                lineNumber: 81,
                                columnNumber: 19
                            }, this),
                            "thought" in item && item.thought && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-a5f3350c7a6b515a" + " " + "mt-1 opacity-80 text-gray-600 dark:text-gray-400 prose dark:prose-invert max-w-none",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-a5f3350c7a6b515a" + " " + "font-medium",
                                        children: "Thought:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/CrewStateRenderer.tsx",
                                        lineNumber: 88,
                                        columnNumber: 23
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
                                        children: item.thought
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/CrewStateRenderer.tsx",
                                        lineNumber: 89,
                                        columnNumber: 23
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/CrewStateRenderer.tsx",
                                lineNumber: 87,
                                columnNumber: 21
                            }, this),
                            "result" in item && item.result !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                className: "jsx-a5f3350c7a6b515a" + " " + "mt-1 text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded-md overflow-x-auto",
                                children: JSON.stringify(item.result, null, 2)
                            }, void 0, false, {
                                fileName: "[project]/src/components/CrewStateRenderer.tsx",
                                lineNumber: 93,
                                columnNumber: 21
                            }, this),
                            "description" in item && item.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-a5f3350c7a6b515a" + " " + "mt-1 text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
                                    children: item.description
                                }, void 0, false, {
                                    fileName: "[project]/src/components/CrewStateRenderer.tsx",
                                    lineNumber: 99,
                                    columnNumber: 23
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/CrewStateRenderer.tsx",
                                lineNumber: 98,
                                columnNumber: 21
                            }, this)
                        ]
                    }, item.id, true, {
                        fileName: "[project]/src/components/CrewStateRenderer.tsx",
                        lineNumber: 78,
                        columnNumber: 17
                    }, this);
                }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-a5f3350c7a6b515a" + " " + "opacity-70 text-gray-500",
                    children: "No activity yet..."
                }, void 0, false, {
                    fileName: "[project]/src/components/CrewStateRenderer.tsx",
                    lineNumber: 106,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/CrewStateRenderer.tsx",
                lineNumber: 70,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "a5f3350c7a6b515a",
                children: "@keyframes fadeIn{0%{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}.animate-fadeIn.jsx-a5f3350c7a6b515a{animation:.5s fadeIn}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/CrewStateRenderer.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
_s(CrewStateRenderer, "5WUAdwucFmLtkFigAYW3NOVNVSA=");
_c = CrewStateRenderer;
const __TURBOPACK__default__export__ = CrewStateRenderer;
var _c;
__turbopack_context__.k.register(_c, "CrewStateRenderer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/CrewHumanFeedbackRenderer.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "CrewHumanFeedbackRenderer": (()=>CrewHumanFeedbackRenderer)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/react-markdown/lib/index.js [app-client] (ecmascript) <export Markdown as default>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
/**
 * Renders a simple UI for agent-requested user feedback (Approve / Reject).
 */ function CrewHumanFeedbackRenderer({ feedback, respond, status }) {
    _s();
    const [isExpanded, setIsExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [userResponse, setUserResponse] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    if (status === "complete") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                marginTop: 8,
                textAlign: "right"
            },
            children: userResponse || "Feedback submitted."
        }, void 0, false, {
            fileName: "[project]/src/components/CrewHumanFeedbackRenderer.tsx",
            lineNumber: 31,
            columnNumber: 7
        }, this);
    }
    if (status === "inProgress" || status === "executing") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                marginTop: 8
            },
            children: [
                isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border border-gray-200 rounded-lg p-4 mb-4 bg-white prose dark:prose-invert max-w-none dark:bg-gray-800 dark:border-gray-700 shadow-sm",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
                        children: feedback.task_output || ""
                    }, void 0, false, {
                        fileName: "[project]/src/components/CrewHumanFeedbackRenderer.tsx",
                        lineNumber: 42,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/CrewHumanFeedbackRenderer.tsx",
                    lineNumber: 41,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end gap-2 mt-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200",
                            onClick: ()=>setIsExpanded(!isExpanded),
                            children: [
                                isExpanded ? "Hide" : "Show",
                                " Feedback"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/CrewHumanFeedbackRenderer.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200",
                            onClick: ()=>{
                                setUserResponse("Approved");
                                respond?.("Approve");
                            },
                            children: "Approve"
                        }, void 0, false, {
                            fileName: "[project]/src/components/CrewHumanFeedbackRenderer.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200",
                            onClick: ()=>{
                                setUserResponse("Rejected");
                                respond?.("Reject");
                            },
                            children: "Reject"
                        }, void 0, false, {
                            fileName: "[project]/src/components/CrewHumanFeedbackRenderer.tsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/CrewHumanFeedbackRenderer.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/CrewHumanFeedbackRenderer.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, this);
    }
    return null;
}
_s(CrewHumanFeedbackRenderer, "akeabsagPgRC4Jl5P1bVtJROcA0=");
_c = CrewHumanFeedbackRenderer;
;
var _c;
__turbopack_context__.k.register(_c, "CrewHumanFeedbackRenderer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/Chat.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$dist$2f$chunk$2d$7EDMOLGH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/dist/chunk-7EDMOLGH.mjs [app-client] (ecmascript)");
"use client";
;
;
function Chat() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full relative overflow-y-auto",
        style: {
            "--copilot-kit-primary-color": "#4F4F4F"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$dist$2f$chunk$2d$7EDMOLGH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CopilotChat"], {
            instructions: "You are assisting the user as best as you can. Answer in the best way possible given the data you have.",
            labels: {
                title: "Your Assistant",
                initial: "Hi! 👋 Please provide the location you want to find a restaurant before we get started."
            },
            className: "h-full flex flex-col",
            icons: {
                spinnerIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "h-5 w-5 text-gray-500 animate-pulse",
                    children: "..."
                }, void 0, false, {
                    fileName: "[project]/src/components/Chat.tsx",
                    lineNumber: 27,
                    columnNumber: 13
                }, void 0)
            }
        }, void 0, false, {
            fileName: "[project]/src/components/Chat.tsx",
            lineNumber: 15,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Chat.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
_c = Chat;
const __TURBOPACK__default__export__ = Chat;
var _c;
__turbopack_context__.k.register(_c, "Chat");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/utils.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "cn": (()=>cn),
    "formatText": (()=>formatText)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function formatText(text) {
    if (!text) return "";
    // First check if text already has formatting (multiple consecutive newlines)
    const hasFormatting = /\n\s*\n/.test(text);
    // Process markdown elements first
    let formatted = text;
    // Convert markdown bold (**text**) to HTML bold
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    if (hasFormatting) {
        // Just convert newlines to <br> tags for pre-formatted text
        return formatted.replace(/\n/g, "<br>");
    } else {
        // For unformatted text, add proper spacing
        // Add double line breaks before restaurant entries (already converted to HTML)
        formatted = formatted.replace(/(<strong>\d+\.)/g, "<br><br>$1");
        // Add single line breaks before each property
        formatted = formatted.replace(/(\s-\s<strong>)/g, "<br>$1");
        return formatted;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/resizable.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ResizableHandle": (()=>ResizableHandle),
    "ResizablePanel": (()=>ResizablePanel),
    "ResizablePanelGroup": (()=>ResizablePanelGroup)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVerticalIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/grip-vertical.js [app-client] (ecmascript) <export default as GripVerticalIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$resizable$2d$panels$2f$dist$2f$react$2d$resizable$2d$panels$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-resizable-panels/dist/react-resizable-panels.browser.development.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function ResizablePanelGroup({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$resizable$2d$panels$2f$dist$2f$react$2d$resizable$2d$panels$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PanelGroup"], {
        "data-slot": "resizable-panel-group",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/resizable.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = ResizablePanelGroup;
function ResizablePanel({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$resizable$2d$panels$2f$dist$2f$react$2d$resizable$2d$panels$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
        "data-slot": "resizable-panel",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/resizable.tsx",
        lineNumber: 28,
        columnNumber: 10
    }, this);
}
_c1 = ResizablePanel;
function ResizableHandle({ withHandle, className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$resizable$2d$panels$2f$dist$2f$react$2d$resizable$2d$panels$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PanelResizeHandle"], {
        "data-slot": "resizable-handle",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90", className),
        ...props,
        children: withHandle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVerticalIcon$3e$__["GripVerticalIcon"], {
                className: "size-2.5"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/resizable.tsx",
                lineNumber: 49,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/ui/resizable.tsx",
            lineNumber: 48,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/resizable.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_c2 = ResizableHandle;
;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ResizablePanelGroup");
__turbopack_context__.k.register(_c1, "ResizablePanel");
__turbopack_context__.k.register(_c2, "ResizableHandle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/hooks/useWindowSize.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useWindowSize": (()=>useWindowSize)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useWindowSize(mobileBreakpoint = 768) {
    _s();
    const [windowSize, setWindowSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        width: ("TURBOPACK compile-time truthy", 1) ? window.innerWidth : ("TURBOPACK unreachable", undefined),
        height: ("TURBOPACK compile-time truthy", 1) ? window.innerHeight : ("TURBOPACK unreachable", undefined),
        isMobile: ("TURBOPACK compile-time truthy", 1) ? window.innerWidth < mobileBreakpoint : ("TURBOPACK unreachable", undefined)
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useWindowSize.useEffect": ()=>{
            function handleResize() {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                    isMobile: window.innerWidth < mobileBreakpoint
                });
            }
            // Add event listener
            window.addEventListener("resize", handleResize);
            // Call handler right away so state gets updated with initial window size
            handleResize();
            // Remove event listener on cleanup
            return ({
                "useWindowSize.useEffect": ()=>window.removeEventListener("resize", handleResize)
            })["useWindowSize.useEffect"];
        }
    }["useWindowSize.useEffect"], [
        mobileBreakpoint
    ]);
    return windowSize;
}
_s(useWindowSize, "GZ6AtH0ouxxlFyQ/nVTbZH5pT+g=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/CrewQuickstart.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "CrewQuickstart": (()=>CrewQuickstart)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$chunk$2d$TUEB3WSW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-core/dist/chunk-TUEB3WSW.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$chunk$2d$SGXCSXCK$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-core/dist/chunk-SGXCSXCK.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$chunk$2d$NY3BUYYZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-core/dist/chunk-NY3BUYYZ.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$chunk$2d$S3XGAWBE$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-core/dist/chunk-S3XGAWBE.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$chunk$2d$O3IIH54P$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-core/dist/chunk-O3IIH54P.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/react-markdown/lib/index.js [app-client] (ecmascript) <export Markdown as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CrewStateRenderer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CrewStateRenderer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CrewHumanFeedbackRenderer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CrewHumanFeedbackRenderer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$chunk$2d$4ZMC6WWN$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/runtime-client-gql/dist/chunk-4ZMC6WWN.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$chunk$2d$46WAWW7F$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/runtime-client-gql/dist/chunk-46WAWW7F.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Chat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Chat.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$resizable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/resizable.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useWindowSize$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useWindowSize.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
const CrewQuickstart = ({ crewName, inputs })=>{
    _s();
    const [initialMessageSent, setInitialMessageSent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { isMobile } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useWindowSize$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWindowSize"])();
    const [direction, setDirection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("horizontal");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CrewQuickstart.useEffect": ()=>{
            setDirection(isMobile ? "vertical" : "horizontal");
        }
    }["CrewQuickstart.useEffect"], [
        isMobile
    ]);
    const { state, setState, run } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$chunk$2d$TUEB3WSW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCoAgent"])({
        name: crewName,
        initialState: {
            inputs: {},
            result: "Crew result will appear here..."
        }
    });
    const { appendMessage, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$chunk$2d$S3XGAWBE$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCopilotChat"])();
    const instructions = "INPUTS ARE ABSOLUTELY REQUIRED. Please call getInputs before proceeding with anything else.";
    // Render an initial message when the chat is first loaded
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CrewQuickstart.useEffect": ()=>{
            if (initialMessageSent || isLoading) return;
            setTimeout({
                "CrewQuickstart.useEffect": async ()=>{
                    await appendMessage(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$chunk$2d$46WAWW7F$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextMessage"]({
                        content: "Hi, Please provide your inputs before we get started.",
                        role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$chunk$2d$4ZMC6WWN$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageRole"].Developer
                    }));
                    setInitialMessageSent(true);
                }
            }["CrewQuickstart.useEffect"], 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["CrewQuickstart.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CrewQuickstart.useEffect": ()=>{
            if (!initialMessageSent && Object.values(state?.inputs || {}).length > 0) {
                appendMessage(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$chunk$2d$46WAWW7F$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextMessage"]({
                    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$chunk$2d$4ZMC6WWN$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageRole"].Developer,
                    content: "My inputs are: " + JSON.stringify(state?.inputs)
                })).then({
                    "CrewQuickstart.useEffect": ()=>{
                        setInitialMessageSent(true);
                    }
                }["CrewQuickstart.useEffect"]);
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["CrewQuickstart.useEffect"], [
        initialMessageSent,
        state?.inputs
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$chunk$2d$O3IIH54P$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCopilotAdditionalInstructions"])({
        instructions,
        available: Object.values(state?.inputs || {}).length > 0 ? "enabled" : "disabled"
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$chunk$2d$NY3BUYYZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCopilotAction"])({
        name: "getInputs",
        followUp: false,
        description: "This action allows Crew to get required inputs from the user before starting the Crew.",
        renderAndWaitForResponse ({ status }) {
            if (status === "inProgress" || status === "executing") {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    className: "flex flex-col gap-4",
                    onSubmit: {
                        "CrewQuickstart.useCopilotAction": async (e)=>{
                            e.preventDefault();
                            const form = e.currentTarget;
                            const input = form.elements.namedItem("input");
                            const inputValue = input.value;
                            const inputKey = input.id;
                            setState({
                                ...state,
                                inputs: {
                                    ...state.inputs,
                                    [inputKey]: inputValue
                                }
                            });
                            setTimeout({
                                "CrewQuickstart.useCopilotAction": async ()=>{
                                    console.log("running crew");
                                    await run();
                                    console.log("crew run complete");
                                }
                            }["CrewQuickstart.useCopilotAction"], 0);
                        }
                    }["CrewQuickstart.useCopilotAction"],
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-4",
                        children: [
                            inputs.map({
                                "CrewQuickstart.useCopilotAction": (input)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            id: input,
                                            autoFocus: true,
                                            name: "input",
                                            placeholder: `Enter ${input} here`,
                                            required: true,
                                            className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CrewQuickstart.tsx",
                                            lineNumber: 154,
                                            columnNumber: 19
                                        }, this)
                                    }, input, false, {
                                        fileName: "[project]/src/components/CrewQuickstart.tsx",
                                        lineNumber: 153,
                                        columnNumber: 17
                                    }, this)
                            }["CrewQuickstart.useCopilotAction"]),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: "w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200",
                                children: "Submit"
                            }, void 0, false, {
                                fileName: "[project]/src/components/CrewQuickstart.tsx",
                                lineNumber: 164,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/CrewQuickstart.tsx",
                        lineNumber: 151,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/CrewQuickstart.tsx",
                    lineNumber: 127,
                    columnNumber: 11
                }, this);
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: "Inputs submitted"
            }, void 0, false);
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$chunk$2d$SGXCSXCK$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCoAgentStateRender"])({
        name: crewName,
        render: {
            "CrewQuickstart.useCoAgentStateRender": ({ state, status })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CrewStateRenderer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    state: state,
                    status: status
                }, void 0, false, {
                    fileName: "[project]/src/components/CrewQuickstart.tsx",
                    lineNumber: 180,
                    columnNumber: 7
                }, this)
        }["CrewQuickstart.useCoAgentStateRender"]
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$chunk$2d$NY3BUYYZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCopilotAction"])({
        name: "crew_requesting_feedback",
        description: "Request feedback from the user",
        renderAndWaitForResponse (props) {
            const { status, args, respond } = props;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CrewHumanFeedbackRenderer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CrewHumanFeedbackRenderer"], {
                feedback: args,
                respond: respond,
                status: status
            }, void 0, false, {
                fileName: "[project]/src/components/CrewQuickstart.tsx",
                lineNumber: 190,
                columnNumber: 9
            }, this);
        }
    });
    const agentName = crewName.replace(/[^a-zA-Z0-9]/g, " ");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-full relative",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$resizable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResizablePanelGroup"], {
            direction: direction,
            className: "w-full h-full",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$resizable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResizablePanel"], {
                    defaultSize: 60,
                    minSize: 30,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Chat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/components/CrewQuickstart.tsx",
                        lineNumber: 205,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/CrewQuickstart.tsx",
                    lineNumber: 204,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$resizable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResizableHandle"], {
                    withHandle: true
                }, void 0, false, {
                    fileName: "[project]/src/components/CrewQuickstart.tsx",
                    lineNumber: 208,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$resizable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResizablePanel"], {
                    defaultSize: 40,
                    minSize: 25,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-full overflow-y-auto bg-gray-50 dark:bg-gray-900 p-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col h-full",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-lg font-medium text-gray-800 dark:text-gray-200",
                                        children: agentName
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/CrewQuickstart.tsx",
                                        lineNumber: 214,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/CrewQuickstart.tsx",
                                    lineNumber: 213,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-md shadow-sm p-4 h-full overflow-y-auto prose dark:prose-invert max-w-none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
                                            children: state?.result || ""
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CrewQuickstart.tsx",
                                            lineNumber: 221,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/CrewQuickstart.tsx",
                                        lineNumber: 220,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/CrewQuickstart.tsx",
                                    lineNumber: 219,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/CrewQuickstart.tsx",
                            lineNumber: 212,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/CrewQuickstart.tsx",
                        lineNumber: 211,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/CrewQuickstart.tsx",
                    lineNumber: 210,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/CrewQuickstart.tsx",
            lineNumber: 203,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/CrewQuickstart.tsx",
        lineNumber: 202,
        columnNumber: 5
    }, this);
};
_s(CrewQuickstart, "dM6EBPn55svK9lYP2FiJi66Qcbk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useWindowSize$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWindowSize"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$chunk$2d$TUEB3WSW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCoAgent"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$chunk$2d$S3XGAWBE$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCopilotChat"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$chunk$2d$O3IIH54P$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCopilotAdditionalInstructions"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$chunk$2d$NY3BUYYZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCopilotAction"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$chunk$2d$SGXCSXCK$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCoAgentStateRender"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$chunk$2d$NY3BUYYZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCopilotAction"]
    ];
});
_c = CrewQuickstart;
var _c;
__turbopack_context__.k.register(_c, "CrewQuickstart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>Home)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CrewQuickstart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CrewQuickstart.tsx [app-client] (ecmascript)");
"use client";
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-full relative",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CrewQuickstart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CrewQuickstart"], {
            crewName: "restaurant_finder",
            inputs: [
                "location"
            ]
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 9,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_3707bdb4._.js.map