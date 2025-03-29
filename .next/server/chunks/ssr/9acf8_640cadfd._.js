module.exports = {

"[project]/node_modules/@copilotkit/react-ui/node_modules/hast-util-whitespace/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * Check if the given value is *inter-element whitespace*.
 *
 * @param {unknown} thing
 *   Thing to check (typically `Node` or `string`).
 * @returns {boolean}
 *   Whether the `value` is inter-element whitespace (`boolean`): consisting of
 *   zero or more of space, tab (`\t`), line feed (`\n`), carriage return
 *   (`\r`), or form feed (`\f`).
 *   If a node is passed it must be a `Text` node, whose `value` field is
 *   checked.
 */ __turbopack_context__.s({
    "whitespace": (()=>whitespace)
});
function whitespace(thing) {
    /** @type {string} */ const value = // @ts-expect-error looks like a node.
    thing && typeof thing === 'object' && thing.type === 'text' ? thing.value || '' : thing;
    // HTML whitespace expression.
    // See <https://infra.spec.whatwg.org/#ascii-whitespace>.
    return typeof value === 'string' && value.replace(/[ \t\n\f\r]/g, '') === '';
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/inline-style-parser/index.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
// http://www.w3.org/TR/CSS21/grammar.html
// https://github.com/visionmedia/css-parse/pull/49#issuecomment-30088027
var COMMENT_REGEX = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
var NEWLINE_REGEX = /\n/g;
var WHITESPACE_REGEX = /^\s*/;
// declaration
var PROPERTY_REGEX = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/;
var COLON_REGEX = /^:\s*/;
var VALUE_REGEX = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/;
var SEMICOLON_REGEX = /^[;\s]*/;
// https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
var TRIM_REGEX = /^\s+|\s+$/g;
// strings
var NEWLINE = '\n';
var FORWARD_SLASH = '/';
var ASTERISK = '*';
var EMPTY_STRING = '';
// types
var TYPE_COMMENT = 'comment';
var TYPE_DECLARATION = 'declaration';
/**
 * @param {String} style
 * @param {Object} [options]
 * @return {Object[]}
 * @throws {TypeError}
 * @throws {Error}
 */ module.exports = function(style, options) {
    if (typeof style !== 'string') {
        throw new TypeError('First argument must be a string');
    }
    if (!style) return [];
    options = options || {};
    /**
   * Positional.
   */ var lineno = 1;
    var column = 1;
    /**
   * Update lineno and column based on `str`.
   *
   * @param {String} str
   */ function updatePosition(str) {
        var lines = str.match(NEWLINE_REGEX);
        if (lines) lineno += lines.length;
        var i = str.lastIndexOf(NEWLINE);
        column = ~i ? str.length - i : column + str.length;
    }
    /**
   * Mark position and patch `node.position`.
   *
   * @return {Function}
   */ function position() {
        var start = {
            line: lineno,
            column: column
        };
        return function(node) {
            node.position = new Position(start);
            whitespace();
            return node;
        };
    }
    /**
   * Store position information for a node.
   *
   * @constructor
   * @property {Object} start
   * @property {Object} end
   * @property {undefined|String} source
   */ function Position(start) {
        this.start = start;
        this.end = {
            line: lineno,
            column: column
        };
        this.source = options.source;
    }
    /**
   * Non-enumerable source string.
   */ Position.prototype.content = style;
    var errorsList = [];
    /**
   * Error `msg`.
   *
   * @param {String} msg
   * @throws {Error}
   */ function error(msg) {
        var err = new Error(options.source + ':' + lineno + ':' + column + ': ' + msg);
        err.reason = msg;
        err.filename = options.source;
        err.line = lineno;
        err.column = column;
        err.source = style;
        if (options.silent) {
            errorsList.push(err);
        } else {
            throw err;
        }
    }
    /**
   * Match `re` and return captures.
   *
   * @param {RegExp} re
   * @return {undefined|Array}
   */ function match(re) {
        var m = re.exec(style);
        if (!m) return;
        var str = m[0];
        updatePosition(str);
        style = style.slice(str.length);
        return m;
    }
    /**
   * Parse whitespace.
   */ function whitespace() {
        match(WHITESPACE_REGEX);
    }
    /**
   * Parse comments.
   *
   * @param {Object[]} [rules]
   * @return {Object[]}
   */ function comments(rules) {
        var c;
        rules = rules || [];
        while(c = comment()){
            if (c !== false) {
                rules.push(c);
            }
        }
        return rules;
    }
    /**
   * Parse comment.
   *
   * @return {Object}
   * @throws {Error}
   */ function comment() {
        var pos = position();
        if (FORWARD_SLASH != style.charAt(0) || ASTERISK != style.charAt(1)) return;
        var i = 2;
        while(EMPTY_STRING != style.charAt(i) && (ASTERISK != style.charAt(i) || FORWARD_SLASH != style.charAt(i + 1))){
            ++i;
        }
        i += 2;
        if (EMPTY_STRING === style.charAt(i - 1)) {
            return error('End of comment missing');
        }
        var str = style.slice(2, i - 2);
        column += 2;
        updatePosition(str);
        style = style.slice(i);
        column += 2;
        return pos({
            type: TYPE_COMMENT,
            comment: str
        });
    }
    /**
   * Parse declaration.
   *
   * @return {Object}
   * @throws {Error}
   */ function declaration() {
        var pos = position();
        // prop
        var prop = match(PROPERTY_REGEX);
        if (!prop) return;
        comment();
        // :
        if (!match(COLON_REGEX)) return error("property missing ':'");
        // val
        var val = match(VALUE_REGEX);
        var ret = pos({
            type: TYPE_DECLARATION,
            property: trim(prop[0].replace(COMMENT_REGEX, EMPTY_STRING)),
            value: val ? trim(val[0].replace(COMMENT_REGEX, EMPTY_STRING)) : EMPTY_STRING
        });
        // ;
        match(SEMICOLON_REGEX);
        return ret;
    }
    /**
   * Parse declarations.
   *
   * @return {Object[]}
   */ function declarations() {
        var decls = [];
        comments(decls);
        // declarations
        var decl;
        while(decl = declaration()){
            if (decl !== false) {
                decls.push(decl);
                comments(decls);
            }
        }
        return decls;
    }
    whitespace();
    return declarations();
};
/**
 * Trim `str`.
 *
 * @param {String} str
 * @return {String}
 */ function trim(str) {
    return str ? str.replace(TRIM_REGEX, EMPTY_STRING) : EMPTY_STRING;
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/style-to-object/index.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
var parse = __turbopack_context__.r("[project]/node_modules/@copilotkit/react-ui/node_modules/inline-style-parser/index.js [app-ssr] (ecmascript)");
/**
 * Parses inline style to object.
 *
 * @example
 * // returns { 'line-height': '42' }
 * StyleToObject('line-height: 42;');
 *
 * @param  {String}      style      - The inline style.
 * @param  {Function}    [iterator] - The iterator function.
 * @return {null|Object}
 */ function StyleToObject(style, iterator) {
    var output = null;
    if (!style || typeof style !== 'string') {
        return output;
    }
    var declaration;
    var declarations = parse(style);
    var hasIterator = typeof iterator === 'function';
    var property;
    var value;
    for(var i = 0, len = declarations.length; i < len; i++){
        declaration = declarations[i];
        property = declaration.property;
        value = declaration.value;
        if (hasIterator) {
            iterator(property, value, declaration);
        } else if (value) {
            output || (output = {});
            output[property] = value;
        }
    }
    return output;
}
module.exports = StyleToObject;
module.exports.default = StyleToObject; // ESM support
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/style-to-object/index.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$style$2d$to$2d$object$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/style-to-object/index.js [app-ssr] (ecmascript)");
;
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$style$2d$to$2d$object$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"];
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/unist-util-position/lib/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * @typedef {import('unist').Position} Position
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Point} Point
 */ /**
 * @typedef NodeLike
 * @property {string} type
 * @property {PositionLike | null | undefined} [position]
 *
 * @typedef PositionLike
 * @property {PointLike | null | undefined} [start]
 * @property {PointLike | null | undefined} [end]
 *
 * @typedef PointLike
 * @property {number | null | undefined} [line]
 * @property {number | null | undefined} [column]
 * @property {number | null | undefined} [offset]
 */ /**
 * Get the starting point of `node`.
 *
 * @param node
 *   Node.
 * @returns
 *   Point.
 */ __turbopack_context__.s({
    "pointEnd": (()=>pointEnd),
    "pointStart": (()=>pointStart),
    "position": (()=>position)
});
const pointStart = point('start');
const pointEnd = point('end');
function position(node) {
    return {
        start: pointStart(node),
        end: pointEnd(node)
    };
}
/**
 * Get the positional info of `node`.
 *
 * @param {'start' | 'end'} type
 *   Side.
 * @returns
 *   Getter.
 */ function point(type) {
    return point;
    "TURBOPACK unreachable";
    /**
   * Get the point info of `node` at a bound side.
   *
   * @param {NodeLike | Node | null | undefined} [node]
   * @returns {Point}
   */ function point(node) {
        const point = node && node.position && node.position[type] || {};
        // To do: next major: don’t return points when invalid.
        return {
            // @ts-expect-error: in practice, null is allowed.
            line: point.line || null,
            // @ts-expect-error: in practice, null is allowed.
            column: point.column || null,
            // @ts-expect-error: in practice, null is allowed.
            offset: point.offset > -1 ? point.offset : null
        };
    }
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/unist-util-stringify-position/lib/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Point} Point
 * @typedef {import('unist').Position} Position
 */ /**
 * @typedef NodeLike
 * @property {string} type
 * @property {PositionLike | null | undefined} [position]
 *
 * @typedef PositionLike
 * @property {PointLike | null | undefined} [start]
 * @property {PointLike | null | undefined} [end]
 *
 * @typedef PointLike
 * @property {number | null | undefined} [line]
 * @property {number | null | undefined} [column]
 * @property {number | null | undefined} [offset]
 */ /**
 * Serialize the positional info of a point, position (start and end points),
 * or node.
 *
 * @param {Node | NodeLike | Position | PositionLike | Point | PointLike | null | undefined} [value]
 *   Node, position, or point.
 * @returns {string}
 *   Pretty printed positional info of a node (`string`).
 *
 *   In the format of a range `ls:cs-le:ce` (when given `node` or `position`)
 *   or a point `l:c` (when given `point`), where `l` stands for line, `c` for
 *   column, `s` for `start`, and `e` for end.
 *   An empty string (`''`) is returned if the given value is neither `node`,
 *   `position`, nor `point`.
 */ __turbopack_context__.s({
    "stringifyPosition": (()=>stringifyPosition)
});
function stringifyPosition(value) {
    // Nothing.
    if (!value || typeof value !== 'object') {
        return '';
    }
    // Node.
    if ('position' in value || 'type' in value) {
        return position(value.position);
    }
    // Position.
    if ('start' in value || 'end' in value) {
        return position(value);
    }
    // Point.
    if ('line' in value || 'column' in value) {
        return point(value);
    }
    // ?
    return '';
}
/**
 * @param {Point | PointLike | null | undefined} point
 * @returns {string}
 */ function point(point) {
    return index(point && point.line) + ':' + index(point && point.column);
}
/**
 * @param {Position | PositionLike | null | undefined} pos
 * @returns {string}
 */ function position(pos) {
    return point(pos && pos.start) + '-' + point(pos && pos.end);
}
/**
 * @param {number | null | undefined} value
 * @returns {number}
 */ function index(value) {
    return value && typeof value === 'number' ? value : 1;
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/vfile-message/lib/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Position} Position
 * @typedef {import('unist').Point} Point
 * @typedef {object & {type: string, position?: Position | undefined}} NodeLike
 */ __turbopack_context__.s({
    "VFileMessage": (()=>VFileMessage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$unist$2d$util$2d$stringify$2d$position$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/unist-util-stringify-position/lib/index.js [app-ssr] (ecmascript)");
;
class VFileMessage extends Error {
    /**
   * Create a message for `reason` at `place` from `origin`.
   *
   * When an error is passed in as `reason`, the `stack` is copied.
   *
   * @param {string | Error | VFileMessage} reason
   *   Reason for message, uses the stack and message of the error if given.
   *
   *   > 👉 **Note**: you should use markdown.
   * @param {Node | NodeLike | Position | Point | null | undefined} [place]
   *   Place in file where the message occurred.
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns
   *   Instance of `VFileMessage`.
   */ // To do: next major: expose `undefined` everywhere instead of `null`.
    constructor(reason, place, origin){
        /** @type {[string | null, string | null]} */ const parts = [
            null,
            null
        ];
        /** @type {Position} */ let position = {
            // @ts-expect-error: we always follows the structure of `position`.
            start: {
                line: null,
                column: null
            },
            // @ts-expect-error: "
            end: {
                line: null,
                column: null
            }
        };
        super();
        if (typeof place === 'string') {
            origin = place;
            place = undefined;
        }
        if (typeof origin === 'string') {
            const index = origin.indexOf(':');
            if (index === -1) {
                parts[1] = origin;
            } else {
                parts[0] = origin.slice(0, index);
                parts[1] = origin.slice(index + 1);
            }
        }
        if (place) {
            // Node.
            if ('type' in place || 'position' in place) {
                if (place.position) {
                    // To do: next major: deep clone.
                    // @ts-expect-error: looks like a position.
                    position = place.position;
                }
            } else if ('start' in place || 'end' in place) {
                // @ts-expect-error: looks like a position.
                // To do: next major: deep clone.
                position = place;
            } else if ('line' in place || 'column' in place) {
                // To do: next major: deep clone.
                position.start = place;
            }
        }
        // Fields from `Error`.
        /**
     * Serialized positional info of error.
     *
     * On normal errors, this would be something like `ParseError`, buit in
     * `VFile` messages we use this space to show where an error happened.
     */ this.name = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$unist$2d$util$2d$stringify$2d$position$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stringifyPosition"])(place) || '1:1';
        /**
     * Reason for message.
     *
     * @type {string}
     */ this.message = typeof reason === 'object' ? reason.message : reason;
        /**
     * Stack of message.
     *
     * This is used by normal errors to show where something happened in
     * programming code, irrelevant for `VFile` messages,
     *
     * @type {string}
     */ this.stack = '';
        if (typeof reason === 'object' && reason.stack) {
            this.stack = reason.stack;
        }
        /**
     * Reason for message.
     *
     * > 👉 **Note**: you should use markdown.
     *
     * @type {string}
     */ this.reason = this.message;
        /* eslint-disable no-unused-expressions */ /**
     * State of problem.
     *
     * * `true` — marks associated file as no longer processable (error)
     * * `false` — necessitates a (potential) change (warning)
     * * `null | undefined` — for things that might not need changing (info)
     *
     * @type {boolean | null | undefined}
     */ this.fatal;
        /**
     * Starting line of error.
     *
     * @type {number | null}
     */ this.line = position.start.line;
        /**
     * Starting column of error.
     *
     * @type {number | null}
     */ this.column = position.start.column;
        /**
     * Full unist position.
     *
     * @type {Position | null}
     */ this.position = position;
        /**
     * Namespace of message (example: `'my-package'`).
     *
     * @type {string | null}
     */ this.source = parts[0];
        /**
     * Category of message (example: `'my-rule'`).
     *
     * @type {string | null}
     */ this.ruleId = parts[1];
        /**
     * Path of a file (used throughout the `VFile` ecosystem).
     *
     * @type {string | null}
     */ this.file;
        // The following fields are “well known”.
        // Not standard.
        // Feel free to add other non-standard fields to your messages.
        /**
     * Specify the source value that’s being reported, which is deemed
     * incorrect.
     *
     * @type {string | null}
     */ this.actual;
        /**
     * Suggest acceptable values that can be used instead of `actual`.
     *
     * @type {Array<string> | null}
     */ this.expected;
        /**
     * Link to docs for the message.
     *
     * > 👉 **Note**: this must be an absolute URL that can be passed as `x`
     * > to `new URL(x)`.
     *
     * @type {string | null}
     */ this.url;
        /**
     * Long form description of the message (you should use markdown).
     *
     * @type {string | null}
     */ this.note;
    /* eslint-enable no-unused-expressions */ }
}
VFileMessage.prototype.file = '';
VFileMessage.prototype.name = '';
VFileMessage.prototype.reason = '';
VFileMessage.prototype.message = '';
VFileMessage.prototype.stack = '';
VFileMessage.prototype.fatal = null;
VFileMessage.prototype.column = null;
VFileMessage.prototype.line = null;
VFileMessage.prototype.source = null;
VFileMessage.prototype.ruleId = null;
VFileMessage.prototype.position = null;
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/mdast-util-to-string/lib/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * @typedef {import('mdast').Root|import('mdast').Content} Node
 *
 * @typedef Options
 *   Configuration (optional).
 * @property {boolean | null | undefined} [includeImageAlt=true]
 *   Whether to use `alt` for `image`s.
 * @property {boolean | null | undefined} [includeHtml=true]
 *   Whether to use `value` of HTML.
 */ /** @type {Options} */ __turbopack_context__.s({
    "toString": (()=>toString)
});
const emptyOptions = {};
function toString(value, options) {
    const settings = options || emptyOptions;
    const includeImageAlt = typeof settings.includeImageAlt === 'boolean' ? settings.includeImageAlt : true;
    const includeHtml = typeof settings.includeHtml === 'boolean' ? settings.includeHtml : true;
    return one(value, includeImageAlt, includeHtml);
}
/**
 * One node or several nodes.
 *
 * @param {unknown} value
 *   Thing to serialize.
 * @param {boolean} includeImageAlt
 *   Include image `alt`s.
 * @param {boolean} includeHtml
 *   Include HTML.
 * @returns {string}
 *   Serialized node.
 */ function one(value, includeImageAlt, includeHtml) {
    if (node(value)) {
        if ('value' in value) {
            return value.type === 'html' && !includeHtml ? '' : value.value;
        }
        if (includeImageAlt && 'alt' in value && value.alt) {
            return value.alt;
        }
        if ('children' in value) {
            return all(value.children, includeImageAlt, includeHtml);
        }
    }
    if (Array.isArray(value)) {
        return all(value, includeImageAlt, includeHtml);
    }
    return '';
}
/**
 * Serialize a list of nodes.
 *
 * @param {Array<unknown>} values
 *   Thing to serialize.
 * @param {boolean} includeImageAlt
 *   Include image `alt`s.
 * @param {boolean} includeHtml
 *   Include HTML.
 * @returns {string}
 *   Serialized nodes.
 */ function all(values, includeImageAlt, includeHtml) {
    /** @type {Array<string>} */ const result = [];
    let index = -1;
    while(++index < values.length){
        result[index] = one(values[index], includeImageAlt, includeHtml);
    }
    return result.join('');
}
/**
 * Check if `value` looks like a node.
 *
 * @param {unknown} value
 *   Thing.
 * @returns {value is Node}
 *   Whether `value` is a node.
 */ function node(value) {
    return Boolean(value && typeof value === 'object');
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-chunked/dev/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "push": (()=>push),
    "splice": (()=>splice)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/constants.js [app-ssr] (ecmascript)");
;
function splice(list, start, remove, items) {
    const end = list.length;
    let chunkStart = 0;
    /** @type {Array<unknown>} */ let parameters;
    // Make start between zero and `end` (included).
    if (start < 0) {
        start = -start > end ? 0 : end + start;
    } else {
        start = start > end ? end : start;
    }
    remove = remove > 0 ? remove : 0;
    // No need to chunk the items if there’s only a couple (10k) items.
    if (items.length < __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["constants"].v8MaxSafeChunkSize) {
        parameters = Array.from(items);
        parameters.unshift(start, remove);
        // @ts-expect-error Hush, it’s fine.
        list.splice(...parameters);
    } else {
        // Delete `remove` items starting from `start`
        if (remove) list.splice(start, remove);
        // Insert the items in chunks to not cause stack overflows.
        while(chunkStart < items.length){
            parameters = items.slice(chunkStart, chunkStart + __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["constants"].v8MaxSafeChunkSize);
            parameters.unshift(start, 0);
            // @ts-expect-error Hush, it’s fine.
            list.splice(...parameters);
            chunkStart += __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["constants"].v8MaxSafeChunkSize;
            start += __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["constants"].v8MaxSafeChunkSize;
        }
    }
}
function push(list, items) {
    if (list.length > 0) {
        splice(list, list.length, 0, items);
        return list;
    }
    return items;
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-combine-extensions/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * @typedef {import('micromark-util-types').Extension} Extension
 * @typedef {import('micromark-util-types').Handles} Handles
 * @typedef {import('micromark-util-types').HtmlExtension} HtmlExtension
 * @typedef {import('micromark-util-types').NormalizedExtension} NormalizedExtension
 */ __turbopack_context__.s({
    "combineExtensions": (()=>combineExtensions),
    "combineHtmlExtensions": (()=>combineHtmlExtensions)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$chunked$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-chunked/dev/index.js [app-ssr] (ecmascript)");
;
const hasOwnProperty = {}.hasOwnProperty;
function combineExtensions(extensions) {
    /** @type {NormalizedExtension} */ const all = {};
    let index = -1;
    while(++index < extensions.length){
        syntaxExtension(all, extensions[index]);
    }
    return all;
}
/**
 * Merge `extension` into `all`.
 *
 * @param {NormalizedExtension} all
 *   Extension to merge into.
 * @param {Extension} extension
 *   Extension to merge.
 * @returns {void}
 */ function syntaxExtension(all, extension) {
    /** @type {keyof Extension} */ let hook;
    for(hook in extension){
        const maybe = hasOwnProperty.call(all, hook) ? all[hook] : undefined;
        /** @type {Record<string, unknown>} */ const left = maybe || (all[hook] = {});
        /** @type {Record<string, unknown> | undefined} */ const right = extension[hook];
        /** @type {string} */ let code;
        if (right) {
            for(code in right){
                if (!hasOwnProperty.call(left, code)) left[code] = [];
                const value = right[code];
                constructs(// @ts-expect-error Looks like a list.
                left[code], Array.isArray(value) ? value : value ? [
                    value
                ] : []);
            }
        }
    }
}
/**
 * Merge `list` into `existing` (both lists of constructs).
 * Mutates `existing`.
 *
 * @param {Array<unknown>} existing
 * @param {Array<unknown>} list
 * @returns {void}
 */ function constructs(existing, list) {
    let index = -1;
    /** @type {Array<unknown>} */ const before = [];
    while(++index < list.length){
        // @ts-expect-error Looks like an object.
        ;
        (list[index].add === 'after' ? existing : before).push(list[index]);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$chunked$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["splice"])(existing, 0, 0, before);
}
function combineHtmlExtensions(htmlExtensions) {
    /** @type {HtmlExtension} */ const handlers = {};
    let index = -1;
    while(++index < htmlExtensions.length){
        htmlExtension(handlers, htmlExtensions[index]);
    }
    return handlers;
}
/**
 * Merge `extension` into `all`.
 *
 * @param {HtmlExtension} all
 *   Extension to merge into.
 * @param {HtmlExtension} extension
 *   Extension to merge.
 * @returns {void}
 */ function htmlExtension(all, extension) {
    /** @type {keyof HtmlExtension} */ let hook;
    for(hook in extension){
        const maybe = hasOwnProperty.call(all, hook) ? all[hook] : undefined;
        const left = maybe || (all[hook] = {});
        const right = extension[hook];
        /** @type {keyof Handles} */ let type;
        if (right) {
            for(type in right){
                // @ts-expect-error assume document vs regular handler are managed correctly.
                left[type] = right[type];
            }
        }
    }
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-character/dev/lib/unicode-punctuation-regex.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
// This module is generated by `script/`.
//
// CommonMark handles attention (emphasis, strong) markers based on what comes
// before or after them.
// One such difference is if those characters are Unicode punctuation.
// This script is generated from the Unicode data.
/**
 * Regular expression that matches a unicode punctuation character.
 */ __turbopack_context__.s({
    "unicodePunctuationRegex": (()=>unicodePunctuationRegex)
});
const unicodePunctuationRegex = /[!-/:-@[-`{-~\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/;
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-character/dev/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * @typedef {import('micromark-util-types').Code} Code
 */ __turbopack_context__.s({
    "asciiAlpha": (()=>asciiAlpha),
    "asciiAlphanumeric": (()=>asciiAlphanumeric),
    "asciiAtext": (()=>asciiAtext),
    "asciiControl": (()=>asciiControl),
    "asciiDigit": (()=>asciiDigit),
    "asciiHexDigit": (()=>asciiHexDigit),
    "asciiPunctuation": (()=>asciiPunctuation),
    "markdownLineEnding": (()=>markdownLineEnding),
    "markdownLineEndingOrSpace": (()=>markdownLineEndingOrSpace),
    "markdownSpace": (()=>markdownSpace),
    "unicodePunctuation": (()=>unicodePunctuation),
    "unicodeWhitespace": (()=>unicodeWhitespace)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/codes.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$lib$2f$unicode$2d$punctuation$2d$regex$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-character/dev/lib/unicode-punctuation-regex.js [app-ssr] (ecmascript)");
;
;
const asciiAlpha = regexCheck(/[A-Za-z]/);
const asciiAlphanumeric = regexCheck(/[\dA-Za-z]/);
const asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/);
function asciiControl(code) {
    return(// Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    code !== null && (code < __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].space || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].del));
}
const asciiDigit = regexCheck(/\d/);
const asciiHexDigit = regexCheck(/[\dA-Fa-f]/);
const asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/);
function markdownLineEnding(code) {
    return code !== null && code < __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].horizontalTab;
}
function markdownLineEndingOrSpace(code) {
    return code !== null && (code < __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].nul || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].space);
}
function markdownSpace(code) {
    return code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].horizontalTab || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].virtualSpace || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].space;
}
const unicodePunctuation = regexCheck(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$lib$2f$unicode$2d$punctuation$2d$regex$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unicodePunctuationRegex"]);
const unicodeWhitespace = regexCheck(/\s/);
/**
 * Create a code check from a regex.
 *
 * @param {RegExp} regex
 * @returns {(code: Code) => boolean}
 */ function regexCheck(regex) {
    return check;
    "TURBOPACK unreachable";
    /**
   * Check whether a code matches the bound regex.
   *
   * @param {Code} code
   *   Character code.
   * @returns {boolean}
   *   Whether the character code matches the bound regex.
   */ function check(code) {
        return code !== null && regex.test(String.fromCharCode(code));
    }
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-factory-space/dev/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenType} TokenType
 */ __turbopack_context__.s({
    "factorySpace": (()=>factorySpace)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-character/dev/index.js [app-ssr] (ecmascript)");
;
function factorySpace(effects, ok, type, max) {
    const limit = max ? max - 1 : Number.POSITIVE_INFINITY;
    let size = 0;
    return start;
    "TURBOPACK unreachable";
    /** @type {State} */ function start(code) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markdownSpace"])(code)) {
            effects.enter(type);
            return prefix(code);
        }
        return ok(code);
    }
    /** @type {State} */ function prefix(code) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markdownSpace"])(code) && size++ < limit) {
            effects.consume(code);
            return prefix;
        }
        effects.exit(type);
        return ok(code);
    }
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-subtokenize/dev/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * @typedef {import('micromark-util-types').Chunk} Chunk
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Token} Token
 */ __turbopack_context__.s({
    "subtokenize": (()=>subtokenize)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$chunked$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-chunked/dev/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/codes.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/types.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uvu/assert/index.mjs [app-ssr] (ecmascript)");
;
;
;
;
function subtokenize(events) {
    /** @type {Record<string, number>} */ const jumps = {};
    let index = -1;
    /** @type {Event} */ let event;
    /** @type {number | undefined} */ let lineIndex;
    /** @type {number} */ let otherIndex;
    /** @type {Event} */ let otherEvent;
    /** @type {Array<Event>} */ let parameters;
    /** @type {Array<Event>} */ let subevents;
    /** @type {boolean | undefined} */ let more;
    while(++index < events.length){
        while(index in jumps){
            index = jumps[index];
        }
        event = events[index];
        // Add a hook for the GFM tasklist extension, which needs to know if text
        // is in the first content of a list item.
        if (index && event[1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].chunkFlow && events[index - 1][1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].listItemPrefix) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(event[1]._tokenizer, 'expected `_tokenizer` on subtokens');
            subevents = event[1]._tokenizer.events;
            otherIndex = 0;
            if (otherIndex < subevents.length && subevents[otherIndex][1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].lineEndingBlank) {
                otherIndex += 2;
            }
            if (otherIndex < subevents.length && subevents[otherIndex][1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].content) {
                while(++otherIndex < subevents.length){
                    if (subevents[otherIndex][1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].content) {
                        break;
                    }
                    if (subevents[otherIndex][1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].chunkText) {
                        subevents[otherIndex][1]._isInFirstContentOfListItem = true;
                        otherIndex++;
                    }
                }
            }
        }
        // Enter.
        if (event[0] === 'enter') {
            if (event[1].contentType) {
                Object.assign(jumps, subcontent(events, index));
                index = jumps[index];
                more = true;
            }
        } else if (event[1]._container) {
            otherIndex = index;
            lineIndex = undefined;
            while(otherIndex--){
                otherEvent = events[otherIndex];
                if (otherEvent[1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].lineEnding || otherEvent[1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].lineEndingBlank) {
                    if (otherEvent[0] === 'enter') {
                        if (lineIndex) {
                            events[lineIndex][1].type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].lineEndingBlank;
                        }
                        otherEvent[1].type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].lineEnding;
                        lineIndex = otherIndex;
                    }
                } else {
                    break;
                }
            }
            if (lineIndex) {
                // Fix position.
                event[1].end = Object.assign({}, events[lineIndex][1].start);
                // Switch container exit w/ line endings.
                parameters = events.slice(lineIndex, index);
                parameters.unshift(event);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$chunked$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["splice"])(events, lineIndex, index - lineIndex + 1, parameters);
            }
        }
    }
    return !more;
}
/**
 * Tokenize embedded tokens.
 *
 * @param {Array<Event>} events
 * @param {number} eventIndex
 * @returns {Record<string, number>}
 */ function subcontent(events, eventIndex) {
    const token = events[eventIndex][1];
    const context = events[eventIndex][2];
    let startPosition = eventIndex - 1;
    /** @type {Array<number>} */ const startPositions = [];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(token.contentType, 'expected `contentType` on subtokens');
    const tokenizer = token._tokenizer || context.parser[token.contentType](token.start);
    const childEvents = tokenizer.events;
    /** @type {Array<[number, number]>} */ const jumps = [];
    /** @type {Record<string, number>} */ const gaps = {};
    /** @type {Array<Chunk>} */ let stream;
    /** @type {Token | undefined} */ let previous;
    let index = -1;
    /** @type {Token | undefined} */ let current = token;
    let adjust = 0;
    let start = 0;
    const breaks = [
        start
    ];
    // Loop forward through the linked tokens to pass them in order to the
    // subtokenizer.
    while(current){
        // Find the position of the event for this token.
        while(events[++startPosition][1] !== current){
        // Empty.
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(!previous || current.previous === previous, 'expected previous to match');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(!previous || previous.next === current, 'expected next to match');
        startPositions.push(startPosition);
        if (!current._tokenizer) {
            stream = context.sliceStream(current);
            if (!current.next) {
                stream.push(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].eof);
            }
            if (previous) {
                tokenizer.defineSkip(current.start);
            }
            if (current._isInFirstContentOfListItem) {
                tokenizer._gfmTasklistFirstContentOfListItem = true;
            }
            tokenizer.write(stream);
            if (current._isInFirstContentOfListItem) {
                tokenizer._gfmTasklistFirstContentOfListItem = undefined;
            }
        }
        // Unravel the next token.
        previous = current;
        current = current.next;
    }
    // Now, loop back through all events (and linked tokens), to figure out which
    // parts belong where.
    current = token;
    while(++index < childEvents.length){
        if (// Find a void token that includes a break.
        childEvents[index][0] === 'exit' && childEvents[index - 1][0] === 'enter' && childEvents[index][1].type === childEvents[index - 1][1].type && childEvents[index][1].start.line !== childEvents[index][1].end.line) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(current, 'expected a current token');
            start = index + 1;
            breaks.push(start);
            // Help GC.
            current._tokenizer = undefined;
            current.previous = undefined;
            current = current.next;
        }
    }
    // Help GC.
    tokenizer.events = [];
    // If there’s one more token (which is the cases for lines that end in an
    // EOF), that’s perfect: the last point we found starts it.
    // If there isn’t then make sure any remaining content is added to it.
    if (current) {
        // Help GC.
        current._tokenizer = undefined;
        current.previous = undefined;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(!current.next, 'expected no next token');
    } else {
        breaks.pop();
    }
    // Now splice the events from the subtokenizer into the current events,
    // moving back to front so that splice indices aren’t affected.
    index = breaks.length;
    while(index--){
        const slice = childEvents.slice(breaks[index], breaks[index + 1]);
        const start = startPositions.pop();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(start !== undefined, 'expected a start position when splicing');
        jumps.unshift([
            start,
            start + slice.length - 1
        ]);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$chunked$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["splice"])(events, start, 2, slice);
    }
    index = -1;
    while(++index < jumps.length){
        gaps[adjust + jumps[index][0]] = adjust + jumps[index][1];
        adjust += jumps[index][1] - jumps[index][0] - 1;
    }
    return gaps;
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-classify-character/dev/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * @typedef {import('micromark-util-types').Code} Code
 */ __turbopack_context__.s({
    "classifyCharacter": (()=>classifyCharacter)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-character/dev/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/codes.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/constants.js [app-ssr] (ecmascript)");
;
;
;
function classifyCharacter(code) {
    if (code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].eof || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markdownLineEndingOrSpace"])(code) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unicodeWhitespace"])(code)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["constants"].characterGroupWhitespace;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unicodePunctuation"])(code)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["constants"].characterGroupPunctuation;
    }
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-resolve-all/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 */ /**
 * Call all `resolveAll`s.
 *
 * @param {Array<{resolveAll?: Resolver | undefined}>} constructs
 *   List of constructs, optionally with `resolveAll`s.
 * @param {Array<Event>} events
 *   List of events.
 * @param {TokenizeContext} context
 *   Context used by `tokenize`.
 * @returns {Array<Event>}
 *   Changed events.
 */ __turbopack_context__.s({
    "resolveAll": (()=>resolveAll)
});
function resolveAll(constructs, events, context) {
    /** @type {Array<Resolver>} */ const called = [];
    let index = -1;
    while(++index < constructs.length){
        const resolve = constructs[index].resolveAll;
        if (resolve && !called.includes(resolve)) {
            events = resolve(events, context);
            called.push(resolve);
        }
    }
    return events;
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-factory-destination/dev/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenType} TokenType
 */ __turbopack_context__.s({
    "factoryDestination": (()=>factoryDestination)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-character/dev/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/codes.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/constants.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/types.js [app-ssr] (ecmascript)");
;
;
;
;
function factoryDestination(effects, ok, nok, type, literalType, literalMarkerType, rawType, stringType, max) {
    const limit = max || Number.POSITIVE_INFINITY;
    let balance = 0;
    return start;
    "TURBOPACK unreachable";
    /**
   * Start of destination.
   *
   * ```markdown
   * > | <aa>
   *     ^
   * > | aa
   *     ^
   * ```
   *
   * @type {State}
   */ function start(code) {
        if (code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].lessThan) {
            effects.enter(type);
            effects.enter(literalType);
            effects.enter(literalMarkerType);
            effects.consume(code);
            effects.exit(literalMarkerType);
            return enclosedBefore;
        }
        // ASCII control, space, closing paren.
        if (code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].eof || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].space || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].rightParenthesis || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asciiControl"])(code)) {
            return nok(code);
        }
        effects.enter(type);
        effects.enter(rawType);
        effects.enter(stringType);
        effects.enter(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].chunkString, {
            contentType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["constants"].contentTypeString
        });
        return raw(code);
    }
    /**
   * After `<`, at an enclosed destination.
   *
   * ```markdown
   * > | <aa>
   *      ^
   * ```
   *
   * @type {State}
   */ function enclosedBefore(code) {
        if (code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].greaterThan) {
            effects.enter(literalMarkerType);
            effects.consume(code);
            effects.exit(literalMarkerType);
            effects.exit(literalType);
            effects.exit(type);
            return ok;
        }
        effects.enter(stringType);
        effects.enter(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].chunkString, {
            contentType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["constants"].contentTypeString
        });
        return enclosed(code);
    }
    /**
   * In enclosed destination.
   *
   * ```markdown
   * > | <aa>
   *      ^
   * ```
   *
   * @type {State}
   */ function enclosed(code) {
        if (code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].greaterThan) {
            effects.exit(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].chunkString);
            effects.exit(stringType);
            return enclosedBefore(code);
        }
        if (code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].eof || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].lessThan || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markdownLineEnding"])(code)) {
            return nok(code);
        }
        effects.consume(code);
        return code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].backslash ? enclosedEscape : enclosed;
    }
    /**
   * After `\`, at a special character.
   *
   * ```markdown
   * > | <a\*a>
   *        ^
   * ```
   *
   * @type {State}
   */ function enclosedEscape(code) {
        if (code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].lessThan || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].greaterThan || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].backslash) {
            effects.consume(code);
            return enclosed;
        }
        return enclosed(code);
    }
    /**
   * In raw destination.
   *
   * ```markdown
   * > | aa
   *     ^
   * ```
   *
   * @type {State}
   */ function raw(code) {
        if (!balance && (code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].eof || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].rightParenthesis || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markdownLineEndingOrSpace"])(code))) {
            effects.exit(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].chunkString);
            effects.exit(stringType);
            effects.exit(rawType);
            effects.exit(type);
            return ok(code);
        }
        if (balance < limit && code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].leftParenthesis) {
            effects.consume(code);
            balance++;
            return raw;
        }
        if (code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].rightParenthesis) {
            effects.consume(code);
            balance--;
            return raw;
        }
        // ASCII control (but *not* `\0`) and space and `(`.
        // Note: in `markdown-rs`, `\0` exists in codes, in `micromark-js` it
        // doesn’t.
        if (code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].eof || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].space || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].leftParenthesis || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asciiControl"])(code)) {
            return nok(code);
        }
        effects.consume(code);
        return code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].backslash ? rawEscape : raw;
    }
    /**
   * After `\`, at special character.
   *
   * ```markdown
   * > | a\*a
   *       ^
   * ```
   *
   * @type {State}
   */ function rawEscape(code) {
        if (code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].leftParenthesis || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].rightParenthesis || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].backslash) {
            effects.consume(code);
            return raw;
        }
        return raw(code);
    }
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-factory-label/dev/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').TokenType} TokenType
 */ __turbopack_context__.s({
    "factoryLabel": (()=>factoryLabel)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-character/dev/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/codes.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/constants.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/types.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uvu/assert/index.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
function factoryLabel(effects, ok, nok, type, markerType, stringType) {
    const self = this;
    let size = 0;
    /** @type {boolean} */ let seen;
    return start;
    "TURBOPACK unreachable";
    /**
   * Start of label.
   *
   * ```markdown
   * > | [a]
   *     ^
   * ```
   *
   * @type {State}
   */ function start(code) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].leftSquareBracket, 'expected `[`');
        effects.enter(type);
        effects.enter(markerType);
        effects.consume(code);
        effects.exit(markerType);
        effects.enter(stringType);
        return atBreak;
    }
    /**
   * In label, at something, before something else.
   *
   * ```markdown
   * > | [a]
   *      ^
   * ```
   *
   * @type {State}
   */ function atBreak(code) {
        if (size > __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["constants"].linkReferenceSizeMax || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].eof || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].leftSquareBracket || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].rightSquareBracket && !seen || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].caret && !size && '_hiddenFootnoteSupport' in self.parser.constructs) {
            return nok(code);
        }
        if (code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].rightSquareBracket) {
            effects.exit(stringType);
            effects.enter(markerType);
            effects.consume(code);
            effects.exit(markerType);
            effects.exit(type);
            return ok;
        }
        // To do: indent? Link chunks and EOLs together?
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markdownLineEnding"])(code)) {
            effects.enter(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].lineEnding);
            effects.consume(code);
            effects.exit(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].lineEnding);
            return atBreak;
        }
        effects.enter(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].chunkString, {
            contentType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["constants"].contentTypeString
        });
        return labelInside(code);
    }
    /**
   * In label, in text.
   *
   * ```markdown
   * > | [a]
   *      ^
   * ```
   *
   * @type {State}
   */ function labelInside(code) {
        if (code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].eof || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].leftSquareBracket || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].rightSquareBracket || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markdownLineEnding"])(code) || size++ > __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["constants"].linkReferenceSizeMax) {
            effects.exit(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].chunkString);
            return atBreak(code);
        }
        effects.consume(code);
        if (!seen) seen = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markdownSpace"])(code);
        return code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].backslash ? labelEscape : labelInside;
    }
    /**
   * After `\`, at a special character.
   *
   * ```markdown
   * > | [a\*a]
   *        ^
   * ```
   *
   * @type {State}
   */ function labelEscape(code) {
        if (code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].leftSquareBracket || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].backslash || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].rightSquareBracket) {
            effects.consume(code);
            size++;
            return labelInside;
        }
        return labelInside(code);
    }
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-factory-title/dev/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenType} TokenType
 */ __turbopack_context__.s({
    "factoryTitle": (()=>factoryTitle)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$factory$2d$space$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-factory-space/dev/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-character/dev/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/codes.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/constants.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/types.js [app-ssr] (ecmascript)");
;
;
;
;
;
function factoryTitle(effects, ok, nok, type, markerType, stringType) {
    /** @type {NonNullable<Code>} */ let marker;
    return start;
    "TURBOPACK unreachable";
    /**
   * Start of title.
   *
   * ```markdown
   * > | "a"
   *     ^
   * ```
   *
   * @type {State}
   */ function start(code) {
        if (code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].quotationMark || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].apostrophe || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].leftParenthesis) {
            effects.enter(type);
            effects.enter(markerType);
            effects.consume(code);
            effects.exit(markerType);
            marker = code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].leftParenthesis ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].rightParenthesis : code;
            return begin;
        }
        return nok(code);
    }
    /**
   * After opening marker.
   *
   * This is also used at the closing marker.
   *
   * ```markdown
   * > | "a"
   *      ^
   * ```
   *
   * @type {State}
   */ function begin(code) {
        if (code === marker) {
            effects.enter(markerType);
            effects.consume(code);
            effects.exit(markerType);
            effects.exit(type);
            return ok;
        }
        effects.enter(stringType);
        return atBreak(code);
    }
    /**
   * At something, before something else.
   *
   * ```markdown
   * > | "a"
   *      ^
   * ```
   *
   * @type {State}
   */ function atBreak(code) {
        if (code === marker) {
            effects.exit(stringType);
            return begin(marker);
        }
        if (code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].eof) {
            return nok(code);
        }
        // Note: blank lines can’t exist in content.
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markdownLineEnding"])(code)) {
            // To do: use `space_or_tab_eol_with_options`, connect.
            effects.enter(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].lineEnding);
            effects.consume(code);
            effects.exit(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].lineEnding);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$factory$2d$space$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["factorySpace"])(effects, atBreak, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].linePrefix);
        }
        effects.enter(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].chunkString, {
            contentType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["constants"].contentTypeString
        });
        return inside(code);
    }
    /**
   *
   *
   * @type {State}
   */ function inside(code) {
        if (code === marker || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].eof || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markdownLineEnding"])(code)) {
            effects.exit(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].chunkString);
            return atBreak(code);
        }
        effects.consume(code);
        return code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].backslash ? escape : inside;
    }
    /**
   * After `\`, at a special character.
   *
   * ```markdown
   * > | "a\*b"
   *      ^
   * ```
   *
   * @type {State}
   */ function escape(code) {
        if (code === marker || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].backslash) {
            effects.consume(code);
            return inside;
        }
        return inside(code);
    }
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-factory-whitespace/dev/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 */ __turbopack_context__.s({
    "factoryWhitespace": (()=>factoryWhitespace)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$factory$2d$space$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-factory-space/dev/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-character/dev/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/types.js [app-ssr] (ecmascript)");
;
;
;
function factoryWhitespace(effects, ok) {
    /** @type {boolean} */ let seen;
    return start;
    "TURBOPACK unreachable";
    /** @type {State} */ function start(code) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markdownLineEnding"])(code)) {
            effects.enter(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].lineEnding);
            effects.consume(code);
            effects.exit(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].lineEnding);
            seen = true;
            return start;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markdownSpace"])(code)) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$factory$2d$space$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["factorySpace"])(effects, start, seen ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].linePrefix : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].lineSuffix)(code);
        }
        return ok(code);
    }
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-normalize-identifier/dev/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "normalizeIdentifier": (()=>normalizeIdentifier)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$values$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/values.js [app-ssr] (ecmascript)");
;
function normalizeIdentifier(value) {
    return value// Collapse markdown whitespace.
    .replace(/[\t\n\r ]+/g, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$values$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["values"].space)// Trim.
    .replace(/^ | $/g, '')// Some characters are considered “uppercase”, but if their lowercase
    // counterpart is uppercased will result in a different uppercase
    // character.
    // Hence, to get that form, we perform both lower- and uppercase.
    // Upper case makes sure keys will not interact with default prototypal
    // methods: no method is uppercase.
    .toLowerCase().toUpperCase();
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-html-tag-name/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * List of lowercase HTML “block” tag names.
 *
 * The list, when parsing HTML (flow), results in more relaxed rules (condition
 * 6).
 * Because they are known blocks, the HTML-like syntax doesn’t have to be
 * strictly parsed.
 * For tag names not in this list, a more strict algorithm (condition 7) is used
 * to detect whether the HTML-like syntax is seen as HTML (flow) or not.
 *
 * This is copied from:
 * <https://spec.commonmark.org/0.30/#html-blocks>.
 *
 * > 👉 **Note**: `search` was added in `CommonMark@0.31`.
 */ __turbopack_context__.s({
    "htmlBlockNames": (()=>htmlBlockNames),
    "htmlRawNames": (()=>htmlRawNames)
});
const htmlBlockNames = [
    'address',
    'article',
    'aside',
    'base',
    'basefont',
    'blockquote',
    'body',
    'caption',
    'center',
    'col',
    'colgroup',
    'dd',
    'details',
    'dialog',
    'dir',
    'div',
    'dl',
    'dt',
    'fieldset',
    'figcaption',
    'figure',
    'footer',
    'form',
    'frame',
    'frameset',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'head',
    'header',
    'hr',
    'html',
    'iframe',
    'legend',
    'li',
    'link',
    'main',
    'menu',
    'menuitem',
    'nav',
    'noframes',
    'ol',
    'optgroup',
    'option',
    'p',
    'param',
    'search',
    'section',
    'summary',
    'table',
    'tbody',
    'td',
    'tfoot',
    'th',
    'thead',
    'title',
    'tr',
    'track',
    'ul'
];
const htmlRawNames = [
    'pre',
    'script',
    'style',
    'textarea'
];
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-decode-numeric-character-reference/dev/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "decodeNumericCharacterReference": (()=>decodeNumericCharacterReference)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/codes.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$values$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/values.js [app-ssr] (ecmascript)");
;
;
function decodeNumericCharacterReference(value, base) {
    const code = Number.parseInt(value, base);
    if (// C0 except for HT, LF, FF, CR, space.
    code < __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].ht || code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].vt || code > __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].cr && code < __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].space || code > __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].tilde && code < 160 || code > 55295 && code < 57344 || code > 64975 && code < 65008 || /* eslint-disable no-bitwise */ (code & 65535) === 65535 || (code & 65535) === 65534 || /* eslint-enable no-bitwise */ // Out of range
    code > 1114111) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$values$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["values"].replacementCharacter;
    }
    return String.fromCharCode(code);
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-decode-string/dev/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "decodeString": (()=>decodeString)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$decode$2d$named$2d$character$2d$reference$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/decode-named-character-reference/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$decode$2d$numeric$2d$character$2d$reference$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-decode-numeric-character-reference/dev/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/codes.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/constants.js [app-ssr] (ecmascript)");
;
;
;
;
const characterEscapeOrReference = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
function decodeString(value) {
    return value.replace(characterEscapeOrReference, decode);
}
/**
 * @param {string} $0
 * @param {string} $1
 * @param {string} $2
 * @returns {string}
 */ function decode($0, $1, $2) {
    if ($1) {
        // Escape.
        return $1;
    }
    // Reference.
    const head = $2.charCodeAt(0);
    if (head === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].numberSign) {
        const head = $2.charCodeAt(1);
        const hex = head === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].lowercaseX || head === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].uppercaseX;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$decode$2d$numeric$2d$character$2d$reference$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decodeNumericCharacterReference"])($2.slice(hex ? 2 : 1), hex ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["constants"].numericBaseHexadecimal : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["constants"].numericBaseDecimal);
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$decode$2d$named$2d$character$2d$reference$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decodeNamedCharacterReference"])($2) || $0;
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/mdast-util-from-markdown/dev/lib/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * @typedef {import('micromark-util-types').Encoding} Encoding
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').ParseOptions} ParseOptions
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Value} Value
 *
 * @typedef {import('unist').Parent} UnistParent
 * @typedef {import('unist').Point} Point
 *
 * @typedef {import('mdast').PhrasingContent} PhrasingContent
 * @typedef {import('mdast').StaticPhrasingContent} StaticPhrasingContent
 * @typedef {import('mdast').Content} Content
 * @typedef {import('mdast').Break} Break
 * @typedef {import('mdast').Blockquote} Blockquote
 * @typedef {import('mdast').Code} Code
 * @typedef {import('mdast').Definition} Definition
 * @typedef {import('mdast').Emphasis} Emphasis
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('mdast').HTML} HTML
 * @typedef {import('mdast').Image} Image
 * @typedef {import('mdast').ImageReference} ImageReference
 * @typedef {import('mdast').InlineCode} InlineCode
 * @typedef {import('mdast').Link} Link
 * @typedef {import('mdast').LinkReference} LinkReference
 * @typedef {import('mdast').List} List
 * @typedef {import('mdast').ListItem} ListItem
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').Strong} Strong
 * @typedef {import('mdast').Text} Text
 * @typedef {import('mdast').ThematicBreak} ThematicBreak
 * @typedef {import('mdast').ReferenceType} ReferenceType
 * @typedef {import('../index.js').CompileData} CompileData
 */ /**
 * @typedef {Root | Content} Node
 * @typedef {Extract<Node, UnistParent>} Parent
 *
 * @typedef {Omit<UnistParent, 'type' | 'children'> & {type: 'fragment', children: Array<PhrasingContent>}} Fragment
 */ /**
 * @callback Transform
 *   Extra transform, to change the AST afterwards.
 * @param {Root} tree
 *   Tree to transform.
 * @returns {Root | undefined | null | void}
 *   New tree or nothing (in which case the current tree is used).
 *
 * @callback Handle
 *   Handle a token.
 * @param {CompileContext} this
 *   Context.
 * @param {Token} token
 *   Current token.
 * @returns {void}
 *   Nothing.
 *
 * @typedef {Record<string, Handle>} Handles
 *   Token types mapping to handles
 *
 * @callback OnEnterError
 *   Handle the case where the `right` token is open, but it is closed (by the
 *   `left` token) or because we reached the end of the document.
 * @param {Omit<CompileContext, 'sliceSerialize'>} this
 *   Context.
 * @param {Token | undefined} left
 *   Left token.
 * @param {Token} right
 *   Right token.
 * @returns {void}
 *   Nothing.
 *
 * @callback OnExitError
 *   Handle the case where the `right` token is open but it is closed by
 *   exiting the `left` token.
 * @param {Omit<CompileContext, 'sliceSerialize'>} this
 *   Context.
 * @param {Token} left
 *   Left token.
 * @param {Token} right
 *   Right token.
 * @returns {void}
 *   Nothing.
 *
 * @typedef {[Token, OnEnterError | undefined]} TokenTuple
 *   Open token on the stack, with an optional error handler for when
 *   that token isn’t closed properly.
 */ /**
 * @typedef Config
 *   Configuration.
 *
 *   We have our defaults, but extensions will add more.
 * @property {Array<string>} canContainEols
 *   Token types where line endings are used.
 * @property {Handles} enter
 *   Opening handles.
 * @property {Handles} exit
 *   Closing handles.
 * @property {Array<Transform>} transforms
 *   Tree transforms.
 *
 * @typedef {Partial<Config>} Extension
 *   Change how markdown tokens from micromark are turned into mdast.
 *
 * @typedef CompileContext
 *   mdast compiler context.
 * @property {Array<Node | Fragment>} stack
 *   Stack of nodes.
 * @property {Array<TokenTuple>} tokenStack
 *   Stack of tokens.
 * @property {<Key extends keyof CompileData>(key: Key) => CompileData[Key]} getData
 *   Get data from the key/value store.
 * @property {<Key extends keyof CompileData>(key: Key, value?: CompileData[Key]) => void} setData
 *   Set data into the key/value store.
 * @property {(this: CompileContext) => void} buffer
 *   Capture some of the output data.
 * @property {(this: CompileContext) => string} resume
 *   Stop capturing and access the output data.
 * @property {<Kind extends Node>(this: CompileContext, node: Kind, token: Token, onError?: OnEnterError) => Kind} enter
 *   Enter a token.
 * @property {(this: CompileContext, token: Token, onError?: OnExitError) => Node} exit
 *   Exit a token.
 * @property {TokenizeContext['sliceSerialize']} sliceSerialize
 *   Get the string value of a token.
 * @property {Config} config
 *   Configuration.
 *
 * @typedef FromMarkdownOptions
 *   Configuration for how to build mdast.
 * @property {Array<Extension | Array<Extension>> | null | undefined} [mdastExtensions]
 *   Extensions for this utility to change how tokens are turned into a tree.
 *
 * @typedef {ParseOptions & FromMarkdownOptions} Options
 *   Configuration.
 */ // To do: micromark: create a registry of tokens?
// To do: next major: don’t return given `Node` from `enter`.
// To do: next major: remove setter/getter.
__turbopack_context__.s({
    "fromMarkdown": (()=>fromMarkdown)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uvu/assert/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$mdast$2d$util$2d$to$2d$string$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/mdast-util-to-string/lib/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2f$dev$2f$lib$2f$parse$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark/dev/lib/parse.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2f$dev$2f$lib$2f$preprocess$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark/dev/lib/preprocess.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2f$dev$2f$lib$2f$postprocess$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark/dev/lib/postprocess.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$decode$2d$numeric$2d$character$2d$reference$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-decode-numeric-character-reference/dev/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$decode$2d$string$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-decode-string/dev/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$normalize$2d$identifier$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-normalize-identifier/dev/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/codes.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/constants.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/types.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$decode$2d$named$2d$character$2d$reference$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/decode-named-character-reference/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$unist$2d$util$2d$stringify$2d$position$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/unist-util-stringify-position/lib/index.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
const own = {}.hasOwnProperty;
const fromMarkdown = /**
     * @param {Value} value
     * @param {Encoding | Options | null | undefined} [encoding]
     * @param {Options | null | undefined} [options]
     * @returns {Root}
     */ function(value, encoding, options) {
    if (typeof encoding !== 'string') {
        options = encoding;
        encoding = undefined;
    }
    return compiler(options)((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2f$dev$2f$lib$2f$postprocess$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["postprocess"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2f$dev$2f$lib$2f$parse$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parse"])(options).document().write((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2f$dev$2f$lib$2f$preprocess$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["preprocess"])()(value, encoding, true))));
};
/**
 * Note this compiler only understand complete buffering, not streaming.
 *
 * @param {Options | null | undefined} [options]
 */ function compiler(options) {
    /** @type {Config} */ const config = {
        transforms: [],
        canContainEols: [
            'emphasis',
            'fragment',
            'heading',
            'paragraph',
            'strong'
        ],
        enter: {
            autolink: opener(link),
            autolinkProtocol: onenterdata,
            autolinkEmail: onenterdata,
            atxHeading: opener(heading),
            blockQuote: opener(blockQuote),
            characterEscape: onenterdata,
            characterReference: onenterdata,
            codeFenced: opener(codeFlow),
            codeFencedFenceInfo: buffer,
            codeFencedFenceMeta: buffer,
            codeIndented: opener(codeFlow, buffer),
            codeText: opener(codeText, buffer),
            codeTextData: onenterdata,
            data: onenterdata,
            codeFlowValue: onenterdata,
            definition: opener(definition),
            definitionDestinationString: buffer,
            definitionLabelString: buffer,
            definitionTitleString: buffer,
            emphasis: opener(emphasis),
            hardBreakEscape: opener(hardBreak),
            hardBreakTrailing: opener(hardBreak),
            htmlFlow: opener(html, buffer),
            htmlFlowData: onenterdata,
            htmlText: opener(html, buffer),
            htmlTextData: onenterdata,
            image: opener(image),
            label: buffer,
            link: opener(link),
            listItem: opener(listItem),
            listItemValue: onenterlistitemvalue,
            listOrdered: opener(list, onenterlistordered),
            listUnordered: opener(list),
            paragraph: opener(paragraph),
            reference: onenterreference,
            referenceString: buffer,
            resourceDestinationString: buffer,
            resourceTitleString: buffer,
            setextHeading: opener(heading),
            strong: opener(strong),
            thematicBreak: opener(thematicBreak)
        },
        exit: {
            atxHeading: closer(),
            atxHeadingSequence: onexitatxheadingsequence,
            autolink: closer(),
            autolinkEmail: onexitautolinkemail,
            autolinkProtocol: onexitautolinkprotocol,
            blockQuote: closer(),
            characterEscapeValue: onexitdata,
            characterReferenceMarkerHexadecimal: onexitcharacterreferencemarker,
            characterReferenceMarkerNumeric: onexitcharacterreferencemarker,
            characterReferenceValue: onexitcharacterreferencevalue,
            codeFenced: closer(onexitcodefenced),
            codeFencedFence: onexitcodefencedfence,
            codeFencedFenceInfo: onexitcodefencedfenceinfo,
            codeFencedFenceMeta: onexitcodefencedfencemeta,
            codeFlowValue: onexitdata,
            codeIndented: closer(onexitcodeindented),
            codeText: closer(onexitcodetext),
            codeTextData: onexitdata,
            data: onexitdata,
            definition: closer(),
            definitionDestinationString: onexitdefinitiondestinationstring,
            definitionLabelString: onexitdefinitionlabelstring,
            definitionTitleString: onexitdefinitiontitlestring,
            emphasis: closer(),
            hardBreakEscape: closer(onexithardbreak),
            hardBreakTrailing: closer(onexithardbreak),
            htmlFlow: closer(onexithtmlflow),
            htmlFlowData: onexitdata,
            htmlText: closer(onexithtmltext),
            htmlTextData: onexitdata,
            image: closer(onexitimage),
            label: onexitlabel,
            labelText: onexitlabeltext,
            lineEnding: onexitlineending,
            link: closer(onexitlink),
            listItem: closer(),
            listOrdered: closer(),
            listUnordered: closer(),
            paragraph: closer(),
            referenceString: onexitreferencestring,
            resourceDestinationString: onexitresourcedestinationstring,
            resourceTitleString: onexitresourcetitlestring,
            resource: onexitresource,
            setextHeading: closer(onexitsetextheading),
            setextHeadingLineSequence: onexitsetextheadinglinesequence,
            setextHeadingText: onexitsetextheadingtext,
            strong: closer(),
            thematicBreak: closer()
        }
    };
    configure(config, (options || {}).mdastExtensions || []);
    /** @type {CompileData} */ const data = {};
    return compile;
    "TURBOPACK unreachable";
    /**
   * Turn micromark events into an mdast tree.
   *
   * @param {Array<Event>} events
   *   Events.
   * @returns {Root}
   *   mdast tree.
   */ function compile(events) {
        /** @type {Root} */ let tree = {
            type: 'root',
            children: []
        };
        /** @type {Omit<CompileContext, 'sliceSerialize'>} */ const context = {
            stack: [
                tree
            ],
            tokenStack: [],
            config,
            enter,
            exit,
            buffer,
            resume,
            setData,
            getData
        };
        /** @type {Array<number>} */ const listStack = [];
        let index = -1;
        while(++index < events.length){
            // We preprocess lists to add `listItem` tokens, and to infer whether
            // items the list itself are spread out.
            if (events[index][1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].listOrdered || events[index][1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].listUnordered) {
                if (events[index][0] === 'enter') {
                    listStack.push(index);
                } else {
                    const tail = listStack.pop();
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(typeof tail === 'number', 'expected list ot be open');
                    index = prepareList(events, tail, index);
                }
            }
        }
        index = -1;
        while(++index < events.length){
            const handler = config[events[index][0]];
            if (own.call(handler, events[index][1].type)) {
                handler[events[index][1].type].call(Object.assign({
                    sliceSerialize: events[index][2].sliceSerialize
                }, context), events[index][1]);
            }
        }
        // Handle tokens still being open.
        if (context.tokenStack.length > 0) {
            const tail = context.tokenStack[context.tokenStack.length - 1];
            const handler = tail[1] || defaultOnError;
            handler.call(context, undefined, tail[0]);
        }
        // Figure out `root` position.
        tree.position = {
            start: point(events.length > 0 ? events[0][1].start : {
                line: 1,
                column: 1,
                offset: 0
            }),
            end: point(events.length > 0 ? events[events.length - 2][1].end : {
                line: 1,
                column: 1,
                offset: 0
            })
        };
        // Call transforms.
        index = -1;
        while(++index < config.transforms.length){
            tree = config.transforms[index](tree) || tree;
        }
        return tree;
    }
    /**
   * @param {Array<Event>} events
   * @param {number} start
   * @param {number} length
   * @returns {number}
   */ function prepareList(events, start, length) {
        let index = start - 1;
        let containerBalance = -1;
        let listSpread = false;
        /** @type {Token | undefined} */ let listItem;
        /** @type {number | undefined} */ let lineIndex;
        /** @type {number | undefined} */ let firstBlankLineIndex;
        /** @type {boolean | undefined} */ let atMarker;
        while(++index <= length){
            const event = events[index];
            if (event[1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].listUnordered || event[1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].listOrdered || event[1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].blockQuote) {
                if (event[0] === 'enter') {
                    containerBalance++;
                } else {
                    containerBalance--;
                }
                atMarker = undefined;
            } else if (event[1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].lineEndingBlank) {
                if (event[0] === 'enter') {
                    if (listItem && !atMarker && !containerBalance && !firstBlankLineIndex) {
                        firstBlankLineIndex = index;
                    }
                    atMarker = undefined;
                }
            } else if (event[1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].linePrefix || event[1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].listItemValue || event[1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].listItemMarker || event[1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].listItemPrefix || event[1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].listItemPrefixWhitespace) {
            // Empty.
            } else {
                atMarker = undefined;
            }
            if (!containerBalance && event[0] === 'enter' && event[1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].listItemPrefix || containerBalance === -1 && event[0] === 'exit' && (event[1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].listUnordered || event[1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].listOrdered)) {
                if (listItem) {
                    let tailIndex = index;
                    lineIndex = undefined;
                    while(tailIndex--){
                        const tailEvent = events[tailIndex];
                        if (tailEvent[1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].lineEnding || tailEvent[1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].lineEndingBlank) {
                            if (tailEvent[0] === 'exit') continue;
                            if (lineIndex) {
                                events[lineIndex][1].type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].lineEndingBlank;
                                listSpread = true;
                            }
                            tailEvent[1].type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].lineEnding;
                            lineIndex = tailIndex;
                        } else if (tailEvent[1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].linePrefix || tailEvent[1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].blockQuotePrefix || tailEvent[1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].blockQuotePrefixWhitespace || tailEvent[1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].blockQuoteMarker || tailEvent[1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].listItemIndent) {
                        // Empty
                        } else {
                            break;
                        }
                    }
                    if (firstBlankLineIndex && (!lineIndex || firstBlankLineIndex < lineIndex)) {
                        listItem._spread = true;
                    }
                    // Fix position.
                    listItem.end = Object.assign({}, lineIndex ? events[lineIndex][1].start : event[1].end);
                    events.splice(lineIndex || index, 0, [
                        'exit',
                        listItem,
                        event[2]
                    ]);
                    index++;
                    length++;
                }
                // Create a new list item.
                if (event[1].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].listItemPrefix) {
                    listItem = {
                        type: 'listItem',
                        _spread: false,
                        start: Object.assign({}, event[1].start),
                        // @ts-expect-error: we’ll add `end` in a second.
                        end: undefined
                    };
                    // @ts-expect-error: `listItem` is most definitely defined, TS...
                    events.splice(index, 0, [
                        'enter',
                        listItem,
                        event[2]
                    ]);
                    index++;
                    length++;
                    firstBlankLineIndex = undefined;
                    atMarker = true;
                }
            }
        }
        events[start][1]._spread = listSpread;
        return length;
    }
    /**
   * Set data.
   *
   * @template {keyof CompileData} Key
   *   Field type.
   * @param {Key} key
   *   Key of field.
   * @param {CompileData[Key]} [value]
   *   New value.
   * @returns {void}
   *   Nothing.
   */ function setData(key, value) {
        data[key] = value;
    }
    /**
   * Get data.
   *
   * @template {keyof CompileData} Key
   *   Field type.
   * @param {Key} key
   *   Key of field.
   * @returns {CompileData[Key]}
   *   Value.
   */ function getData(key) {
        return data[key];
    }
    /**
   * Create an opener handle.
   *
   * @param {(token: Token) => Node} create
   *   Create a node.
   * @param {Handle} [and]
   *   Optional function to also run.
   * @returns {Handle}
   *   Handle.
   */ function opener(create, and) {
        return open;
        "TURBOPACK unreachable";
        /**
     * @this {CompileContext}
     * @param {Token} token
     * @returns {void}
     */ function open(token) {
            enter.call(this, create(token), token);
            if (and) and.call(this, token);
        }
    }
    /**
   * @this {CompileContext}
   * @returns {void}
   */ function buffer() {
        this.stack.push({
            type: 'fragment',
            children: []
        });
    }
    /**
   * @template {Node} Kind
   *   Node type.
   * @this {CompileContext}
   *   Context.
   * @param {Kind} node
   *   Node to enter.
   * @param {Token} token
   *   Corresponding token.
   * @param {OnEnterError | undefined} [errorHandler]
   *   Handle the case where this token is open, but it is closed by something else.
   * @returns {Kind}
   *   The given node.
   */ function enter(node, token, errorHandler) {
        const parent = this.stack[this.stack.length - 1];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(parent, 'expected `parent`');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])('children' in parent, 'expected `parent`');
        // @ts-expect-error: Assume `Node` can exist as a child of `parent`.
        parent.children.push(node);
        this.stack.push(node);
        this.tokenStack.push([
            token,
            errorHandler
        ]);
        // @ts-expect-error: `end` will be patched later.
        node.position = {
            start: point(token.start)
        };
        return node;
    }
    /**
   * Create a closer handle.
   *
   * @param {Handle} [and]
   *   Optional function to also run.
   * @returns {Handle}
   *   Handle.
   */ function closer(and) {
        return close;
        "TURBOPACK unreachable";
        /**
     * @this {CompileContext}
     * @param {Token} token
     * @returns {void}
     */ function close(token) {
            if (and) and.call(this, token);
            exit.call(this, token);
        }
    }
    /**
   * @this {CompileContext}
   *   Context.
   * @param {Token} token
   *   Corresponding token.
   * @param {OnExitError | undefined} [onExitError]
   *   Handle the case where another token is open.
   * @returns {Node}
   *   The closed node.
   */ function exit(token, onExitError) {
        const node = this.stack.pop();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node, 'expected `node`');
        const open = this.tokenStack.pop();
        if (!open) {
            throw new Error('Cannot close `' + token.type + '` (' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$unist$2d$util$2d$stringify$2d$position$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stringifyPosition"])({
                start: token.start,
                end: token.end
            }) + '): it’s not open');
        } else if (open[0].type !== token.type) {
            if (onExitError) {
                onExitError.call(this, token, open[0]);
            } else {
                const handler = open[1] || defaultOnError;
                handler.call(this, token, open[0]);
            }
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node.type !== 'fragment', 'unexpected fragment `exit`ed');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node.position, 'expected `position` to be defined');
        node.position.end = point(token.end);
        return node;
    }
    /**
   * @this {CompileContext}
   * @returns {string}
   */ function resume() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$mdast$2d$util$2d$to$2d$string$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toString"])(this.stack.pop());
    }
    //
    // Handlers.
    //
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onenterlistordered() {
        setData('expectingFirstListItemValue', true);
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onenterlistitemvalue(token) {
        if (getData('expectingFirstListItemValue')) {
            const ancestor = this.stack[this.stack.length - 2];
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(ancestor, 'expected nodes on stack');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(ancestor.type === 'list', 'expected list on stack');
            ancestor.start = Number.parseInt(this.sliceSerialize(token), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["constants"].numericBaseDecimal);
            setData('expectingFirstListItemValue');
        }
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitcodefencedfenceinfo() {
        const data = this.resume();
        const node = this.stack[this.stack.length - 1];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node, 'expected node on stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node.type === 'code', 'expected code on stack');
        node.lang = data;
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitcodefencedfencemeta() {
        const data = this.resume();
        const node = this.stack[this.stack.length - 1];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node, 'expected node on stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node.type === 'code', 'expected code on stack');
        node.meta = data;
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitcodefencedfence() {
        // Exit if this is the closing fence.
        if (getData('flowCodeInside')) return;
        this.buffer();
        setData('flowCodeInside', true);
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitcodefenced() {
        const data = this.resume();
        const node = this.stack[this.stack.length - 1];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node, 'expected node on stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node.type === 'code', 'expected code on stack');
        node.value = data.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, '');
        setData('flowCodeInside');
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitcodeindented() {
        const data = this.resume();
        const node = this.stack[this.stack.length - 1];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node, 'expected node on stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node.type === 'code', 'expected code on stack');
        node.value = data.replace(/(\r?\n|\r)$/g, '');
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitdefinitionlabelstring(token) {
        const label = this.resume();
        const node = this.stack[this.stack.length - 1];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node, 'expected node on stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node.type === 'definition', 'expected definition on stack');
        node.label = label;
        node.identifier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$normalize$2d$identifier$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeIdentifier"])(this.sliceSerialize(token)).toLowerCase();
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitdefinitiontitlestring() {
        const data = this.resume();
        const node = this.stack[this.stack.length - 1];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node, 'expected node on stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node.type === 'definition', 'expected definition on stack');
        node.title = data;
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitdefinitiondestinationstring() {
        const data = this.resume();
        const node = this.stack[this.stack.length - 1];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node, 'expected node on stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node.type === 'definition', 'expected definition on stack');
        node.url = data;
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitatxheadingsequence(token) {
        const node = this.stack[this.stack.length - 1];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node, 'expected node on stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node.type === 'heading', 'expected heading on stack');
        if (!node.depth) {
            const depth = this.sliceSerialize(token).length;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(depth === 1 || depth === 2 || depth === 3 || depth === 4 || depth === 5 || depth === 6, 'expected `depth` between `1` and `6`');
            node.depth = depth;
        }
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitsetextheadingtext() {
        setData('setextHeadingSlurpLineEnding', true);
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitsetextheadinglinesequence(token) {
        const node = this.stack[this.stack.length - 1];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node, 'expected node on stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node.type === 'heading', 'expected heading on stack');
        node.depth = this.sliceSerialize(token).charCodeAt(0) === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].equalsTo ? 1 : 2;
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitsetextheading() {
        setData('setextHeadingSlurpLineEnding');
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onenterdata(token) {
        const node = this.stack[this.stack.length - 1];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node, 'expected node on stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])('children' in node, 'expected parent on stack');
        let tail = node.children[node.children.length - 1];
        if (!tail || tail.type !== 'text') {
            // Add a new text node.
            tail = text();
            // @ts-expect-error: we’ll add `end` later.
            tail.position = {
                start: point(token.start)
            };
            // @ts-expect-error: Assume `parent` accepts `text`.
            node.children.push(tail);
        }
        this.stack.push(tail);
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitdata(token) {
        const tail = this.stack.pop();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(tail, 'expected a `node` to be on the stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])('value' in tail, 'expected a `literal` to be on the stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(tail.position, 'expected `node` to have an open position');
        tail.value += this.sliceSerialize(token);
        tail.position.end = point(token.end);
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitlineending(token) {
        const context = this.stack[this.stack.length - 1];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(context, 'expected `node`');
        // If we’re at a hard break, include the line ending in there.
        if (getData('atHardBreak')) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])('children' in context, 'expected `parent`');
            const tail = context.children[context.children.length - 1];
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(tail.position, 'expected tail to have a starting position');
            tail.position.end = point(token.end);
            setData('atHardBreak');
            return;
        }
        if (!getData('setextHeadingSlurpLineEnding') && config.canContainEols.includes(context.type)) {
            onenterdata.call(this, token);
            onexitdata.call(this, token);
        }
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexithardbreak() {
        setData('atHardBreak', true);
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexithtmlflow() {
        const data = this.resume();
        const node = this.stack[this.stack.length - 1];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node, 'expected node on stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node.type === 'html', 'expected html on stack');
        node.value = data;
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexithtmltext() {
        const data = this.resume();
        const node = this.stack[this.stack.length - 1];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node, 'expected node on stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node.type === 'html', 'expected html on stack');
        node.value = data;
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitcodetext() {
        const data = this.resume();
        const node = this.stack[this.stack.length - 1];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node, 'expected node on stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node.type === 'inlineCode', 'expected inline code on stack');
        node.value = data;
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitlink() {
        const node = this.stack[this.stack.length - 1];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node, 'expected node on stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node.type === 'link', 'expected link on stack');
        // Note: there are also `identifier` and `label` fields on this link node!
        // These are used / cleaned here.
        // To do: clean.
        if (getData('inReference')) {
            /** @type {ReferenceType} */ const referenceType = getData('referenceType') || 'shortcut';
            node.type += 'Reference';
            // @ts-expect-error: mutate.
            node.referenceType = referenceType;
            // @ts-expect-error: mutate.
            delete node.url;
            delete node.title;
        } else {
            // @ts-expect-error: mutate.
            delete node.identifier;
            // @ts-expect-error: mutate.
            delete node.label;
        }
        setData('referenceType');
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitimage() {
        const node = this.stack[this.stack.length - 1];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node, 'expected node on stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node.type === 'image', 'expected image on stack');
        // Note: there are also `identifier` and `label` fields on this link node!
        // These are used / cleaned here.
        // To do: clean.
        if (getData('inReference')) {
            /** @type {ReferenceType} */ const referenceType = getData('referenceType') || 'shortcut';
            node.type += 'Reference';
            // @ts-expect-error: mutate.
            node.referenceType = referenceType;
            // @ts-expect-error: mutate.
            delete node.url;
            delete node.title;
        } else {
            // @ts-expect-error: mutate.
            delete node.identifier;
            // @ts-expect-error: mutate.
            delete node.label;
        }
        setData('referenceType');
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitlabeltext(token) {
        const string = this.sliceSerialize(token);
        const ancestor = this.stack[this.stack.length - 2];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(ancestor, 'expected ancestor on stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(ancestor.type === 'image' || ancestor.type === 'link', 'expected image or link on stack');
        // @ts-expect-error: stash this on the node, as it might become a reference
        // later.
        ancestor.label = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$decode$2d$string$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decodeString"])(string);
        // @ts-expect-error: same as above.
        ancestor.identifier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$normalize$2d$identifier$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeIdentifier"])(string).toLowerCase();
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitlabel() {
        const fragment = this.stack[this.stack.length - 1];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(fragment, 'expected node on stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(fragment.type === 'fragment', 'expected fragment on stack');
        const value = this.resume();
        const node = this.stack[this.stack.length - 1];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node, 'expected node on stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node.type === 'image' || node.type === 'link', 'expected image or link on stack');
        // Assume a reference.
        setData('inReference', true);
        if (node.type === 'link') {
            /** @type {Array<StaticPhrasingContent>} */ // @ts-expect-error: Assume static phrasing content.
            const children = fragment.children;
            node.children = children;
        } else {
            node.alt = value;
        }
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitresourcedestinationstring() {
        const data = this.resume();
        const node = this.stack[this.stack.length - 1];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node, 'expected node on stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node.type === 'image' || node.type === 'link', 'expected image or link on stack');
        node.url = data;
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitresourcetitlestring() {
        const data = this.resume();
        const node = this.stack[this.stack.length - 1];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node, 'expected node on stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node.type === 'image' || node.type === 'link', 'expected image or link on stack');
        node.title = data;
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitresource() {
        setData('inReference');
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onenterreference() {
        setData('referenceType', 'collapsed');
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitreferencestring(token) {
        const label = this.resume();
        const node = this.stack[this.stack.length - 1];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node, 'expected node on stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node.type === 'image' || node.type === 'link', 'expected image reference or link reference on stack');
        // @ts-expect-error: stash this on the node, as it might become a reference
        // later.
        node.label = label;
        // @ts-expect-error: same as above.
        node.identifier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$normalize$2d$identifier$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeIdentifier"])(this.sliceSerialize(token)).toLowerCase();
        setData('referenceType', 'full');
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitcharacterreferencemarker(token) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(token.type === 'characterReferenceMarkerNumeric' || token.type === 'characterReferenceMarkerHexadecimal');
        setData('characterReferenceType', token.type);
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitcharacterreferencevalue(token) {
        const data = this.sliceSerialize(token);
        const type = getData('characterReferenceType');
        /** @type {string} */ let value;
        if (type) {
            value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$decode$2d$numeric$2d$character$2d$reference$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decodeNumericCharacterReference"])(data, type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["types"].characterReferenceMarkerNumeric ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["constants"].numericBaseDecimal : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["constants"].numericBaseHexadecimal);
            setData('characterReferenceType');
        } else {
            const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$decode$2d$named$2d$character$2d$reference$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decodeNamedCharacterReference"])(data);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(result !== false, 'expected reference to decode');
            value = result;
        }
        const tail = this.stack.pop();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(tail, 'expected `node`');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(tail.position, 'expected `node.position`');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])('value' in tail, 'expected `node.value`');
        tail.value += value;
        tail.position.end = point(token.end);
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitautolinkprotocol(token) {
        onexitdata.call(this, token);
        const node = this.stack[this.stack.length - 1];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node, 'expected node on stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node.type === 'link', 'expected link on stack');
        node.url = this.sliceSerialize(token);
    }
    /**
   * @this {CompileContext}
   * @type {Handle}
   */ function onexitautolinkemail(token) {
        onexitdata.call(this, token);
        const node = this.stack[this.stack.length - 1];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node, 'expected node on stack');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uvu$2f$assert$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ok"])(node.type === 'link', 'expected link on stack');
        node.url = 'mailto:' + this.sliceSerialize(token);
    }
    //
    // Creaters.
    //
    /** @returns {Blockquote} */ function blockQuote() {
        return {
            type: 'blockquote',
            children: []
        };
    }
    /** @returns {Code} */ function codeFlow() {
        return {
            type: 'code',
            lang: null,
            meta: null,
            value: ''
        };
    }
    /** @returns {InlineCode} */ function codeText() {
        return {
            type: 'inlineCode',
            value: ''
        };
    }
    /** @returns {Definition} */ function definition() {
        return {
            type: 'definition',
            identifier: '',
            label: null,
            title: null,
            url: ''
        };
    }
    /** @returns {Emphasis} */ function emphasis() {
        return {
            type: 'emphasis',
            children: []
        };
    }
    /** @returns {Heading} */ function heading() {
        // @ts-expect-error `depth` will be set later.
        return {
            type: 'heading',
            depth: undefined,
            children: []
        };
    }
    /** @returns {Break} */ function hardBreak() {
        return {
            type: 'break'
        };
    }
    /** @returns {HTML} */ function html() {
        return {
            type: 'html',
            value: ''
        };
    }
    /** @returns {Image} */ function image() {
        return {
            type: 'image',
            title: null,
            url: '',
            alt: null
        };
    }
    /** @returns {Link} */ function link() {
        return {
            type: 'link',
            title: null,
            url: '',
            children: []
        };
    }
    /**
   * @param {Token} token
   * @returns {List}
   */ function list(token) {
        return {
            type: 'list',
            ordered: token.type === 'listOrdered',
            start: null,
            spread: token._spread,
            children: []
        };
    }
    /**
   * @param {Token} token
   * @returns {ListItem}
   */ function listItem(token) {
        return {
            type: 'listItem',
            spread: token._spread,
            checked: null,
            children: []
        };
    }
    /** @returns {Paragraph} */ function paragraph() {
        return {
            type: 'paragraph',
            children: []
        };
    }
    /** @returns {Strong} */ function strong() {
        return {
            type: 'strong',
            children: []
        };
    }
    /** @returns {Text} */ function text() {
        return {
            type: 'text',
            value: ''
        };
    }
    /** @returns {ThematicBreak} */ function thematicBreak() {
        return {
            type: 'thematicBreak'
        };
    }
}
/**
 * Copy a point-like value.
 *
 * @param {Point} d
 *   Point-like value.
 * @returns {Point}
 *   unist point.
 */ function point(d) {
    return {
        line: d.line,
        column: d.column,
        offset: d.offset
    };
}
/**
 * @param {Config} combined
 * @param {Array<Extension | Array<Extension>>} extensions
 * @returns {void}
 */ function configure(combined, extensions) {
    let index = -1;
    while(++index < extensions.length){
        const value = extensions[index];
        if (Array.isArray(value)) {
            configure(combined, value);
        } else {
            extension(combined, value);
        }
    }
}
/**
 * @param {Config} combined
 * @param {Extension} extension
 * @returns {void}
 */ function extension(combined, extension) {
    /** @type {keyof Extension} */ let key;
    for(key in extension){
        if (own.call(extension, key)) {
            if (key === 'canContainEols') {
                const right = extension[key];
                if (right) {
                    combined[key].push(...right);
                }
            } else if (key === 'transforms') {
                const right = extension[key];
                if (right) {
                    combined[key].push(...right);
                }
            } else if (key === 'enter' || key === 'exit') {
                const right = extension[key];
                if (right) {
                    Object.assign(combined[key], right);
                }
            }
        }
    }
}
/** @type {OnEnterError} */ function defaultOnError(left, right) {
    if (left) {
        throw new Error('Cannot close `' + left.type + '` (' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$unist$2d$util$2d$stringify$2d$position$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stringifyPosition"])({
            start: left.start,
            end: left.end
        }) + '): a different token (`' + right.type + '`, ' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$unist$2d$util$2d$stringify$2d$position$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stringifyPosition"])({
            start: right.start,
            end: right.end
        }) + ') is open');
    } else {
        throw new Error('Cannot close document, a token (`' + right.type + '`, ' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$unist$2d$util$2d$stringify$2d$position$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stringifyPosition"])({
            start: right.start,
            end: right.end
        }) + ') is still open');
    }
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/remark-parse/lib/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast-util-from-markdown').Options} Options
 */ __turbopack_context__.s({
    "default": (()=>remarkParse)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$mdast$2d$util$2d$from$2d$markdown$2f$dev$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/mdast-util-from-markdown/dev/lib/index.js [app-ssr] (ecmascript)");
;
function remarkParse(options) {
    /** @type {import('unified').ParserFunction<Root>} */ const parser = (doc)=>{
        // Assume options.
        const settings = this.data('settings');
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$mdast$2d$util$2d$from$2d$markdown$2f$dev$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fromMarkdown"])(doc, Object.assign({}, settings, options, {
            // Note: these options are not in the readme.
            // The goal is for them to be set by plugins on `data` instead of being
            // passed by users.
            extensions: this.data('micromarkExtensions') || [],
            mdastExtensions: this.data('fromMarkdownExtensions') || []
        }));
    };
    Object.assign(this, {
        Parser: parser
    });
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-encode/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "encode": (()=>encode)
});
const characterReferences = {
    '"': 'quot',
    '&': 'amp',
    '<': 'lt',
    '>': 'gt'
};
function encode(value) {
    return value.replace(/["&<>]/g, replace);
    "TURBOPACK unreachable";
    /**
   * @param {string} value
   * @returns {string}
   */ function replace(value) {
        // @ts-expect-error Hush, it’s fine.
        return '&' + characterReferences[value] + ';';
    }
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-sanitize-uri/dev/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "normalizeUri": (()=>normalizeUri),
    "sanitizeUri": (()=>sanitizeUri)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-character/dev/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$encode$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-encode/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/codes.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$values$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/micromark-util-symbol/values.js [app-ssr] (ecmascript)");
;
;
;
;
function sanitizeUri(url, protocol) {
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$encode$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["encode"])(normalizeUri(url || ''));
    if (!protocol) {
        return value;
    }
    const colon = value.indexOf(':');
    const questionMark = value.indexOf('?');
    const numberSign = value.indexOf('#');
    const slash = value.indexOf('/');
    if (// If there is no protocol, it’s relative.
    colon < 0 || slash > -1 && colon > slash || questionMark > -1 && colon > questionMark || numberSign > -1 && colon > numberSign || // It is a protocol, it should be allowed.
    protocol.test(value.slice(0, colon))) {
        return value;
    }
    return '';
}
function normalizeUri(value) {
    /** @type {Array<string>} */ const result = [];
    let index = -1;
    let start = 0;
    let skip = 0;
    while(++index < value.length){
        const code = value.charCodeAt(index);
        /** @type {string} */ let replace = '';
        // A correct percent encoded value.
        if (code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$codes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codes"].percentSign && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asciiAlphanumeric"])(value.charCodeAt(index + 1)) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asciiAlphanumeric"])(value.charCodeAt(index + 2))) {
            skip = 2;
        } else if (code < 128) {
            if (!/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(code))) {
                replace = String.fromCharCode(code);
            }
        } else if (code > 55295 && code < 57344) {
            const next = value.charCodeAt(index + 1);
            // A correct surrogate pair.
            if (code < 56320 && next > 56319 && next < 57344) {
                replace = String.fromCharCode(code, next);
                skip = 1;
            } else {
                replace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$micromark$2d$util$2d$symbol$2f$values$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["values"].replacementCharacter;
            }
        } else {
            replace = String.fromCharCode(code);
        }
        if (replace) {
            result.push(value.slice(start, index), encodeURIComponent(replace));
            start = index + skip + 1;
            replace = '';
        }
        if (skip) {
            index += skip;
            skip = 0;
        }
    }
    return result.join('') + value.slice(start);
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/unist-util-visit/lib/index.js [app-ssr] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('unist-util-is').Test} Test
 * @typedef {import('unist-util-visit-parents').VisitorResult} VisitorResult
 */ /**
 * Check if `Child` can be a child of `Ancestor`.
 *
 * Returns the ancestor when `Child` can be a child of `Ancestor`, or returns
 * `never`.
 *
 * @template {Node} Ancestor
 *   Node type.
 * @template {Node} Child
 *   Node type.
 * @typedef {(
 *   Ancestor extends Parent
 *     ? Child extends Ancestor['children'][number]
 *       ? Ancestor
 *       : never
 *     : never
 * )} ParentsOf
 */ /**
 * @template {Node} [Visited=Node]
 *   Visited node type.
 * @template {Parent} [Ancestor=Parent]
 *   Ancestor type.
 * @callback Visitor
 *   Handle a node (matching `test`, if given).
 *
 *   Visitors are free to transform `node`.
 *   They can also transform `parent`.
 *
 *   Replacing `node` itself, if `SKIP` is not returned, still causes its
 *   descendants to be walked (which is a bug).
 *
 *   When adding or removing previous siblings of `node` (or next siblings, in
 *   case of reverse), the `Visitor` should return a new `Index` to specify the
 *   sibling to traverse after `node` is traversed.
 *   Adding or removing next siblings of `node` (or previous siblings, in case
 *   of reverse) is handled as expected without needing to return a new `Index`.
 *
 *   Removing the children property of `parent` still results in them being
 *   traversed.
 * @param {Visited} node
 *   Found node.
 * @param {Visited extends Node ? number | null : never} index
 *   Index of `node` in `parent`.
 * @param {Ancestor extends Node ? Ancestor | null : never} parent
 *   Parent of `node`.
 * @returns {VisitorResult}
 *   What to do next.
 *
 *   An `Index` is treated as a tuple of `[CONTINUE, Index]`.
 *   An `Action` is treated as a tuple of `[Action]`.
 *
 *   Passing a tuple back only makes sense if the `Action` is `SKIP`.
 *   When the `Action` is `EXIT`, that action can be returned.
 *   When the `Action` is `CONTINUE`, `Index` can be returned.
 */ /**
 * Build a typed `Visitor` function from a node and all possible parents.
 *
 * It will infer which values are passed as `node` and which as `parent`.
 *
 * @template {Node} Visited
 *   Node type.
 * @template {Parent} Ancestor
 *   Parent type.
 * @typedef {Visitor<Visited, ParentsOf<Ancestor, Visited>>} BuildVisitorFromMatch
 */ /**
 * Build a typed `Visitor` function from a list of descendants and a test.
 *
 * It will infer which values are passed as `node` and which as `parent`.
 *
 * @template {Node} Descendant
 *   Node type.
 * @template {Test} Check
 *   Test type.
 * @typedef {(
 *   BuildVisitorFromMatch<
 *     import('unist-util-visit-parents/complex-types.js').Matches<Descendant, Check>,
 *     Extract<Descendant, Parent>
 *   >
 * )} BuildVisitorFromDescendants
 */ /**
 * Build a typed `Visitor` function from a tree and a test.
 *
 * It will infer which values are passed as `node` and which as `parent`.
 *
 * @template {Node} [Tree=Node]
 *   Node type.
 * @template {Test} [Check=string]
 *   Test type.
 * @typedef {(
 *   BuildVisitorFromDescendants<
 *     import('unist-util-visit-parents/complex-types.js').InclusiveDescendant<Tree>,
 *     Check
 *   >
 * )} BuildVisitor
 */ __turbopack_context__.s({
    "visit": (()=>visit)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$unist$2d$util$2d$visit$2d$parents$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/unist-util-visit-parents/lib/index.js [app-ssr] (ecmascript)");
;
const visit = /**
     * @param {Node} tree
     * @param {Test} test
     * @param {Visitor} visitor
     * @param {boolean | null | undefined} [reverse]
     * @returns {void}
     */ function(tree, test, visitor, reverse) {
    if (typeof test === 'function' && typeof visitor !== 'function') {
        reverse = visitor;
        visitor = test;
        test = null;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$unist$2d$util$2d$visit$2d$parents$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["visitParents"])(tree, test, overload, reverse);
    /**
       * @param {Node} node
       * @param {Array<Parent>} parents
       */ function overload(node, parents) {
        const parent = parents[parents.length - 1];
        return visitor(node, parent ? parent.children.indexOf(node) : null, parent);
    }
};
;
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/remark-rehype/lib/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * @typedef {import('hast').Root} HastRoot
 * @typedef {import('mdast').Root} MdastRoot
 * @typedef {import('mdast-util-to-hast').Options} Options
 * @typedef {import('unified').Processor<any, any, any, any>} Processor
 *
 * @typedef {import('mdast-util-to-hast')} DoNotTouchAsThisImportIncludesRawInTree
 */ __turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$mdast$2d$util$2d$to$2d$hast$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/mdast-util-to-hast/lib/index.js [app-ssr] (ecmascript)");
;
// Note: the `<MdastRoot, HastRoot>` overload doesn’t seem to work :'(
/**
 * Plugin that turns markdown into HTML to support rehype.
 *
 * *   If a destination processor is given, that processor runs with a new HTML
 *     (hast) tree (bridge-mode).
 *     As the given processor runs with a hast tree, and rehype plugins support
 *     hast, that means rehype plugins can be used with the given processor.
 *     The hast tree is discarded in the end.
 *     It’s highly unlikely that you want to do this.
 * *   The common case is to not pass a destination processor, in which case the
 *     current processor continues running with a new HTML (hast) tree
 *     (mutate-mode).
 *     As the current processor continues with a hast tree, and rehype plugins
 *     support hast, that means rehype plugins can be used after
 *     `remark-rehype`.
 *     It’s likely that this is what you want to do.
 *
 * @param destination
 *   Optional unified processor.
 * @param options
 *   Options passed to `mdast-util-to-hast`.
 */ const remarkRehype = function(destination, options) {
    return destination && 'run' in destination ? bridge(destination, options) : mutate(destination || options);
};
const __TURBOPACK__default__export__ = remarkRehype;
/**
 * Bridge-mode.
 * Runs the destination with the new hast tree.
 *
 * @type {import('unified').Plugin<[Processor, Options?], MdastRoot>}
 */ function bridge(destination, options) {
    return (node, file, next)=>{
        destination.run((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$mdast$2d$util$2d$to$2d$hast$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toHast"])(node, options), file, (error)=>{
            next(error);
        });
    };
}
/**
 * Mutate-mode.
 * Further plugins run on the hast tree.
 *
 * @type {import('unified').Plugin<[Options?]|void[], MdastRoot, HastRoot>}
 */ function mutate(options) {
    // @ts-expect-error: assume a corresponding node is returned by `toHast`.
    return (node)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$mdast$2d$util$2d$to$2d$hast$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toHast"])(node, options);
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/vfile/lib/minurl.shared.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * @typedef URL
 * @property {string} hash
 * @property {string} host
 * @property {string} hostname
 * @property {string} href
 * @property {string} origin
 * @property {string} password
 * @property {string} pathname
 * @property {string} port
 * @property {string} protocol
 * @property {string} search
 * @property {any} searchParams
 * @property {string} username
 * @property {() => string} toString
 * @property {() => string} toJSON
 */ /**
 * Check if `fileUrlOrPath` looks like a URL.
 *
 * @param {unknown} fileUrlOrPath
 *   File path or URL.
 * @returns {fileUrlOrPath is URL}
 *   Whether it’s a URL.
 */ // From: <https://github.com/nodejs/node/blob/fcf8ba4/lib/internal/url.js#L1501>
__turbopack_context__.s({
    "isUrl": (()=>isUrl)
});
function isUrl(fileUrlOrPath) {
    return fileUrlOrPath !== null && typeof fileUrlOrPath === 'object' && // @ts-expect-error: indexable.
    fileUrlOrPath.href && // @ts-expect-error: indexable.
    fileUrlOrPath.origin;
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/vfile/lib/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Position} Position
 * @typedef {import('unist').Point} Point
 * @typedef {import('./minurl.shared.js').URL} URL
 * @typedef {import('../index.js').Data} Data
 * @typedef {import('../index.js').Value} Value
 */ /**
 * @typedef {Record<string, unknown> & {type: string, position?: Position | undefined}} NodeLike
 *
 * @typedef {'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex'} BufferEncoding
 *   Encodings supported by the buffer class.
 *
 *   This is a copy of the types from Node, copied to prevent Node globals from
 *   being needed.
 *   Copied from: <https://github.com/DefinitelyTyped/DefinitelyTyped/blob/90a4ec8/types/node/buffer.d.ts#L170>
 *
 * @typedef {Options | URL | Value | VFile} Compatible
 *   Things that can be passed to the constructor.
 *
 * @typedef VFileCoreOptions
 *   Set multiple values.
 * @property {Value | null | undefined} [value]
 *   Set `value`.
 * @property {string | null | undefined} [cwd]
 *   Set `cwd`.
 * @property {Array<string> | null | undefined} [history]
 *   Set `history`.
 * @property {URL | string | null | undefined} [path]
 *   Set `path`.
 * @property {string | null | undefined} [basename]
 *   Set `basename`.
 * @property {string | null | undefined} [stem]
 *   Set `stem`.
 * @property {string | null | undefined} [extname]
 *   Set `extname`.
 * @property {string | null | undefined} [dirname]
 *   Set `dirname`.
 * @property {Data | null | undefined} [data]
 *   Set `data`.
 *
 * @typedef Map
 *   Raw source map.
 *
 *   See:
 *   <https://github.com/mozilla/source-map/blob/58819f0/source-map.d.ts#L15-L23>.
 * @property {number} version
 *   Which version of the source map spec this map is following.
 * @property {Array<string>} sources
 *   An array of URLs to the original source files.
 * @property {Array<string>} names
 *   An array of identifiers which can be referenced by individual mappings.
 * @property {string | undefined} [sourceRoot]
 *   The URL root from which all sources are relative.
 * @property {Array<string> | undefined} [sourcesContent]
 *   An array of contents of the original source files.
 * @property {string} mappings
 *   A string of base64 VLQs which contain the actual mappings.
 * @property {string} file
 *   The generated file this source map is associated with.
 *
 * @typedef {{[key: string]: unknown} & VFileCoreOptions} Options
 *   Configuration.
 *
 *   A bunch of keys that will be shallow copied over to the new file.
 *
 * @typedef {Record<string, unknown>} ReporterSettings
 *   Configuration for reporters.
 */ /**
 * @template {ReporterSettings} Settings
 *   Options type.
 * @callback Reporter
 *   Type for a reporter.
 * @param {Array<VFile>} files
 *   Files to report.
 * @param {Settings} options
 *   Configuration.
 * @returns {string}
 *   Report.
 */ __turbopack_context__.s({
    "VFile": (()=>VFile)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$is$2d$buffer$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/is-buffer/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$vfile$2d$message$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/vfile-message/lib/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs) <export default as path>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$process__$5b$external$5d$__$28$process$2c$__cjs$29$__$3c$export__default__as__proc$3e$__ = __turbopack_context__.i("[externals]/process [external] (process, cjs) <export default as proc>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$url__$5b$external$5d$__$28$url$2c$__cjs$29$__$3c$export__fileURLToPath__as__urlToPath$3e$__ = __turbopack_context__.i("[externals]/url [external] (url, cjs) <export fileURLToPath as urlToPath>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$vfile$2f$lib$2f$minurl$2e$shared$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/vfile/lib/minurl.shared.js [app-ssr] (ecmascript)");
;
;
;
;
;
/**
 * Order of setting (least specific to most), we need this because otherwise
 * `{stem: 'a', path: '~/b.js'}` would throw, as a path is needed before a
 * stem can be set.
 *
 * @type {Array<'basename' | 'dirname' | 'extname' | 'history' | 'path' | 'stem'>}
 */ const order = [
    'history',
    'path',
    'basename',
    'stem',
    'extname',
    'dirname'
];
class VFile {
    /**
   * Create a new virtual file.
   *
   * `options` is treated as:
   *
   * *   `string` or `Buffer` — `{value: options}`
   * *   `URL` — `{path: options}`
   * *   `VFile` — shallow copies its data over to the new file
   * *   `object` — all fields are shallow copied over to the new file
   *
   * Path related fields are set in the following order (least specific to
   * most specific): `history`, `path`, `basename`, `stem`, `extname`,
   * `dirname`.
   *
   * You cannot set `dirname` or `extname` without setting either `history`,
   * `path`, `basename`, or `stem` too.
   *
   * @param {Compatible | null | undefined} [value]
   *   File value.
   * @returns
   *   New instance.
   */ constructor(value){
        /** @type {Options | VFile} */ let options;
        if (!value) {
            options = {};
        } else if (typeof value === 'string' || buffer(value)) {
            options = {
                value
            };
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$vfile$2f$lib$2f$minurl$2e$shared$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isUrl"])(value)) {
            options = {
                path: value
            };
        } else {
            options = value;
        }
        /**
     * Place to store custom information (default: `{}`).
     *
     * It’s OK to store custom data directly on the file but moving it to
     * `data` is recommended.
     *
     * @type {Data}
     */ this.data = {};
        /**
     * List of messages associated with the file.
     *
     * @type {Array<VFileMessage>}
     */ this.messages = [];
        /**
     * List of filepaths the file moved between.
     *
     * The first is the original path and the last is the current path.
     *
     * @type {Array<string>}
     */ this.history = [];
        /**
     * Base of `path` (default: `process.cwd()` or `'/'` in browsers).
     *
     * @type {string}
     */ this.cwd = __TURBOPACK__imported__module__$5b$externals$5d2f$process__$5b$external$5d$__$28$process$2c$__cjs$29$__$3c$export__default__as__proc$3e$__["proc"].cwd();
        /* eslint-disable no-unused-expressions */ /**
     * Raw value.
     *
     * @type {Value}
     */ this.value;
        // The below are non-standard, they are “well-known”.
        // As in, used in several tools.
        /**
     * Whether a file was saved to disk.
     *
     * This is used by vfile reporters.
     *
     * @type {boolean}
     */ this.stored;
        /**
     * Custom, non-string, compiled, representation.
     *
     * This is used by unified to store non-string results.
     * One example is when turning markdown into React nodes.
     *
     * @type {unknown}
     */ this.result;
        /**
     * Source map.
     *
     * This type is equivalent to the `RawSourceMap` type from the `source-map`
     * module.
     *
     * @type {Map | null | undefined}
     */ this.map;
        /* eslint-enable no-unused-expressions */ // Set path related properties in the correct order.
        let index = -1;
        while(++index < order.length){
            const prop = order[index];
            // Note: we specifically use `in` instead of `hasOwnProperty` to accept
            // `vfile`s too.
            if (prop in options && options[prop] !== undefined && options[prop] !== null) {
                // @ts-expect-error: TS doesn’t understand basic reality.
                this[prop] = prop === 'history' ? [
                    ...options[prop]
                ] : options[prop];
            }
        }
        /** @type {string} */ let prop;
        // Set non-path related properties.
        for(prop in options){
            // @ts-expect-error: fine to set other things.
            if (!order.includes(prop)) {
                // @ts-expect-error: fine to set other things.
                this[prop] = options[prop];
            }
        }
    }
    /**
   * Get the full path (example: `'~/index.min.js'`).
   *
   * @returns {string}
   */ get path() {
        return this.history[this.history.length - 1];
    }
    /**
   * Set the full path (example: `'~/index.min.js'`).
   *
   * Cannot be nullified.
   * You can set a file URL (a `URL` object with a `file:` protocol) which will
   * be turned into a path with `url.fileURLToPath`.
   *
   * @param {string | URL} path
   */ set path(path) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$vfile$2f$lib$2f$minurl$2e$shared$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isUrl"])(path)) {
            path = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$url__$5b$external$5d$__$28$url$2c$__cjs$29$__$3c$export__fileURLToPath__as__urlToPath$3e$__["urlToPath"])(path);
        }
        assertNonEmpty(path, 'path');
        if (this.path !== path) {
            this.history.push(path);
        }
    }
    /**
   * Get the parent path (example: `'~'`).
   */ get dirname() {
        return typeof this.path === 'string' ? __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].dirname(this.path) : undefined;
    }
    /**
   * Set the parent path (example: `'~'`).
   *
   * Cannot be set if there’s no `path` yet.
   */ set dirname(dirname) {
        assertPath(this.basename, 'dirname');
        this.path = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].join(dirname || '', this.basename);
    }
    /**
   * Get the basename (including extname) (example: `'index.min.js'`).
   */ get basename() {
        return typeof this.path === 'string' ? __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].basename(this.path) : undefined;
    }
    /**
   * Set basename (including extname) (`'index.min.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   */ set basename(basename) {
        assertNonEmpty(basename, 'basename');
        assertPart(basename, 'basename');
        this.path = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].join(this.dirname || '', basename);
    }
    /**
   * Get the extname (including dot) (example: `'.js'`).
   */ get extname() {
        return typeof this.path === 'string' ? __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].extname(this.path) : undefined;
    }
    /**
   * Set the extname (including dot) (example: `'.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be set if there’s no `path` yet.
   */ set extname(extname) {
        assertPart(extname, 'extname');
        assertPath(this.dirname, 'extname');
        if (extname) {
            if (extname.charCodeAt(0) !== 46 /* `.` */ ) {
                throw new Error('`extname` must start with `.`');
            }
            if (extname.includes('.', 1)) {
                throw new Error('`extname` cannot contain multiple dots');
            }
        }
        this.path = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].join(this.dirname, this.stem + (extname || ''));
    }
    /**
   * Get the stem (basename w/o extname) (example: `'index.min'`).
   */ get stem() {
        return typeof this.path === 'string' ? __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].basename(this.path, this.extname) : undefined;
    }
    /**
   * Set the stem (basename w/o extname) (example: `'index.min'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   */ set stem(stem) {
        assertNonEmpty(stem, 'stem');
        assertPart(stem, 'stem');
        this.path = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].join(this.dirname || '', stem + (this.extname || ''));
    }
    /**
   * Serialize the file.
   *
   * @param {BufferEncoding | null | undefined} [encoding='utf8']
   *   Character encoding to understand `value` as when it’s a `Buffer`
   *   (default: `'utf8'`).
   * @returns {string}
   *   Serialized file.
   */ toString(encoding) {
        return (this.value || '').toString(encoding || undefined);
    }
    /**
   * Create a warning message associated with the file.
   *
   * Its `fatal` is set to `false` and `file` is set to the current file path.
   * Its added to `file.messages`.
   *
   * @param {string | Error | VFileMessage} reason
   *   Reason for message, uses the stack and message of the error if given.
   * @param {Node | NodeLike | Position | Point | null | undefined} [place]
   *   Place in file where the message occurred.
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */ message(reason, place, origin) {
        const message = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$vfile$2d$message$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VFileMessage"](reason, place, origin);
        if (this.path) {
            message.name = this.path + ':' + message.name;
            message.file = this.path;
        }
        message.fatal = false;
        this.messages.push(message);
        return message;
    }
    /**
   * Create an info message associated with the file.
   *
   * Its `fatal` is set to `null` and `file` is set to the current file path.
   * Its added to `file.messages`.
   *
   * @param {string | Error | VFileMessage} reason
   *   Reason for message, uses the stack and message of the error if given.
   * @param {Node | NodeLike | Position | Point | null | undefined} [place]
   *   Place in file where the message occurred.
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */ info(reason, place, origin) {
        const message = this.message(reason, place, origin);
        message.fatal = null;
        return message;
    }
    /**
   * Create a fatal error associated with the file.
   *
   * Its `fatal` is set to `true` and `file` is set to the current file path.
   * Its added to `file.messages`.
   *
   * > 👉 **Note**: a fatal error means that a file is no longer processable.
   *
   * @param {string | Error | VFileMessage} reason
   *   Reason for message, uses the stack and message of the error if given.
   * @param {Node | NodeLike | Position | Point | null | undefined} [place]
   *   Place in file where the message occurred.
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {never}
   *   Message.
   * @throws {VFileMessage}
   *   Message.
   */ fail(reason, place, origin) {
        const message = this.message(reason, place, origin);
        message.fatal = true;
        throw message;
    }
}
/**
 * Assert that `part` is not a path (as in, does not contain `path.sep`).
 *
 * @param {string | null | undefined} part
 *   File path part.
 * @param {string} name
 *   Part name.
 * @returns {void}
 *   Nothing.
 */ function assertPart(part, name) {
    if (part && part.includes(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].sep)) {
        throw new Error('`' + name + '` cannot be a path: did not expect `' + __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].sep + '`');
    }
}
/**
 * Assert that `part` is not empty.
 *
 * @param {string | undefined} part
 *   Thing.
 * @param {string} name
 *   Part name.
 * @returns {asserts part is string}
 *   Nothing.
 */ function assertNonEmpty(part, name) {
    if (!part) {
        throw new Error('`' + name + '` cannot be empty');
    }
}
/**
 * Assert `path` exists.
 *
 * @param {string | undefined} path
 *   Path.
 * @param {string} name
 *   Dependency name.
 * @returns {asserts path is string}
 *   Nothing.
 */ function assertPath(path, name) {
    if (!path) {
        throw new Error('Setting `' + name + '` requires `path` to be set too');
    }
}
/**
 * Assert `value` is a buffer.
 *
 * @param {unknown} value
 *   thing.
 * @returns {value is Buffer}
 *   Whether `value` is a Node.js buffer.
 */ function buffer(value) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$is$2d$buffer$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(value);
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/unified/lib/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('vfile').VFileCompatible} VFileCompatible
 * @typedef {import('vfile').VFileValue} VFileValue
 * @typedef {import('..').Processor} Processor
 * @typedef {import('..').Plugin} Plugin
 * @typedef {import('..').Preset} Preset
 * @typedef {import('..').Pluggable} Pluggable
 * @typedef {import('..').PluggableList} PluggableList
 * @typedef {import('..').Transformer} Transformer
 * @typedef {import('..').Parser} Parser
 * @typedef {import('..').Compiler} Compiler
 * @typedef {import('..').RunCallback} RunCallback
 * @typedef {import('..').ProcessCallback} ProcessCallback
 *
 * @typedef Context
 * @property {Node} tree
 * @property {VFile} file
 */ __turbopack_context__.s({
    "unified": (()=>unified)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bail$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bail/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$is$2d$buffer$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/is-buffer/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$extend$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/extend/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$is$2d$plain$2d$obj$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/is-plain-obj/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$trough$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/trough/lib/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$vfile$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/vfile/lib/index.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
const unified = base().freeze();
const own = {}.hasOwnProperty;
// Function to create the first processor.
/**
 * @returns {Processor}
 */ function base() {
    const transformers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$trough$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trough"])();
    /** @type {Processor['attachers']} */ const attachers = [];
    /** @type {Record<string, unknown>} */ let namespace = {};
    /** @type {boolean|undefined} */ let frozen;
    let freezeIndex = -1;
    // Data management.
    // @ts-expect-error: overloads are handled.
    processor.data = data;
    processor.Parser = undefined;
    processor.Compiler = undefined;
    // Lock.
    processor.freeze = freeze;
    // Plugins.
    processor.attachers = attachers;
    // @ts-expect-error: overloads are handled.
    processor.use = use;
    // API.
    processor.parse = parse;
    processor.stringify = stringify;
    // @ts-expect-error: overloads are handled.
    processor.run = run;
    processor.runSync = runSync;
    // @ts-expect-error: overloads are handled.
    processor.process = process;
    processor.processSync = processSync;
    // Expose.
    return processor;
    "TURBOPACK unreachable";
    // Create a new processor based on the processor in the current scope.
    /** @type {Processor} */ function processor() {
        const destination = base();
        let index = -1;
        while(++index < attachers.length){
            destination.use(...attachers[index]);
        }
        destination.data((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$extend$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(true, {}, namespace));
        return destination;
    }
    /**
   * @param {string|Record<string, unknown>} [key]
   * @param {unknown} [value]
   * @returns {unknown}
   */ function data(key, value) {
        if (typeof key === 'string') {
            // Set `key`.
            if (arguments.length === 2) {
                assertUnfrozen('data', frozen);
                namespace[key] = value;
                return processor;
            }
            // Get `key`.
            return own.call(namespace, key) && namespace[key] || null;
        }
        // Set space.
        if (key) {
            assertUnfrozen('data', frozen);
            namespace = key;
            return processor;
        }
        // Get space.
        return namespace;
    }
    /** @type {Processor['freeze']} */ function freeze() {
        if (frozen) {
            return processor;
        }
        while(++freezeIndex < attachers.length){
            const [attacher, ...options] = attachers[freezeIndex];
            if (options[0] === false) {
                continue;
            }
            if (options[0] === true) {
                options[0] = undefined;
            }
            /** @type {Transformer|void} */ const transformer = attacher.call(processor, ...options);
            if (typeof transformer === 'function') {
                transformers.use(transformer);
            }
        }
        frozen = true;
        freezeIndex = Number.POSITIVE_INFINITY;
        return processor;
    }
    /**
   * @param {Pluggable|null|undefined} [value]
   * @param {...unknown} options
   * @returns {Processor}
   */ function use(value, ...options) {
        /** @type {Record<string, unknown>|undefined} */ let settings;
        assertUnfrozen('use', frozen);
        if (value === null || value === undefined) {
        // Empty.
        } else if (typeof value === 'function') {
            addPlugin(value, ...options);
        } else if (typeof value === 'object') {
            if (Array.isArray(value)) {
                addList(value);
            } else {
                addPreset(value);
            }
        } else {
            throw new TypeError('Expected usable value, not `' + value + '`');
        }
        if (settings) {
            namespace.settings = Object.assign(namespace.settings || {}, settings);
        }
        return processor;
        "TURBOPACK unreachable";
        /**
     * @param {import('..').Pluggable<unknown[]>} value
     * @returns {void}
     */ function add(value) {
            if (typeof value === 'function') {
                addPlugin(value);
            } else if (typeof value === 'object') {
                if (Array.isArray(value)) {
                    const [plugin, ...options] = value;
                    addPlugin(plugin, ...options);
                } else {
                    addPreset(value);
                }
            } else {
                throw new TypeError('Expected usable value, not `' + value + '`');
            }
        }
        /**
     * @param {Preset} result
     * @returns {void}
     */ function addPreset(result) {
            addList(result.plugins);
            if (result.settings) {
                settings = Object.assign(settings || {}, result.settings);
            }
        }
        /**
     * @param {PluggableList|null|undefined} [plugins]
     * @returns {void}
     */ function addList(plugins) {
            let index = -1;
            if (plugins === null || plugins === undefined) {
            // Empty.
            } else if (Array.isArray(plugins)) {
                while(++index < plugins.length){
                    const thing = plugins[index];
                    add(thing);
                }
            } else {
                throw new TypeError('Expected a list of plugins, not `' + plugins + '`');
            }
        }
        /**
     * @param {Plugin} plugin
     * @param {...unknown} [value]
     * @returns {void}
     */ function addPlugin(plugin, value) {
            let index = -1;
            /** @type {Processor['attachers'][number]|undefined} */ let entry;
            while(++index < attachers.length){
                if (attachers[index][0] === plugin) {
                    entry = attachers[index];
                    break;
                }
            }
            if (entry) {
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$is$2d$plain$2d$obj$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(entry[1]) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$is$2d$plain$2d$obj$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(value)) {
                    value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$extend$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(true, entry[1], value);
                }
                entry[1] = value;
            } else {
                // @ts-expect-error: fine.
                attachers.push([
                    ...arguments
                ]);
            }
        }
    }
    /** @type {Processor['parse']} */ function parse(doc) {
        processor.freeze();
        const file = vfile(doc);
        const Parser = processor.Parser;
        assertParser('parse', Parser);
        if (newable(Parser, 'parse')) {
            // @ts-expect-error: `newable` checks this.
            return new Parser(String(file), file).parse();
        }
        // @ts-expect-error: `newable` checks this.
        return Parser(String(file), file) // eslint-disable-line new-cap
        ;
    }
    /** @type {Processor['stringify']} */ function stringify(node, doc) {
        processor.freeze();
        const file = vfile(doc);
        const Compiler = processor.Compiler;
        assertCompiler('stringify', Compiler);
        assertNode(node);
        if (newable(Compiler, 'compile')) {
            // @ts-expect-error: `newable` checks this.
            return new Compiler(node, file).compile();
        }
        // @ts-expect-error: `newable` checks this.
        return Compiler(node, file) // eslint-disable-line new-cap
        ;
    }
    /**
   * @param {Node} node
   * @param {VFileCompatible|RunCallback} [doc]
   * @param {RunCallback} [callback]
   * @returns {Promise<Node>|void}
   */ function run(node, doc, callback) {
        assertNode(node);
        processor.freeze();
        if (!callback && typeof doc === 'function') {
            callback = doc;
            doc = undefined;
        }
        if (!callback) {
            return new Promise(executor);
        }
        executor(null, callback);
        /**
     * @param {null|((node: Node) => void)} resolve
     * @param {(error: Error) => void} reject
     * @returns {void}
     */ function executor(resolve, reject) {
            // @ts-expect-error: `doc` can’t be a callback anymore, we checked.
            transformers.run(node, vfile(doc), done);
            /**
       * @param {Error|null} error
       * @param {Node} tree
       * @param {VFile} file
       * @returns {void}
       */ function done(error, tree, file) {
                tree = tree || node;
                if (error) {
                    reject(error);
                } else if (resolve) {
                    resolve(tree);
                } else {
                    // @ts-expect-error: `callback` is defined if `resolve` is not.
                    callback(null, tree, file);
                }
            }
        }
    }
    /** @type {Processor['runSync']} */ function runSync(node, file) {
        /** @type {Node|undefined} */ let result;
        /** @type {boolean|undefined} */ let complete;
        processor.run(node, file, done);
        assertDone('runSync', 'run', complete);
        // @ts-expect-error: we either bailed on an error or have a tree.
        return result;
        "TURBOPACK unreachable";
        /**
     * @param {Error|null} [error]
     * @param {Node} [tree]
     * @returns {void}
     */ function done(error, tree) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bail$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bail"])(error);
            result = tree;
            complete = true;
        }
    }
    /**
   * @param {VFileCompatible} doc
   * @param {ProcessCallback} [callback]
   * @returns {Promise<VFile>|undefined}
   */ function process(doc, callback) {
        processor.freeze();
        assertParser('process', processor.Parser);
        assertCompiler('process', processor.Compiler);
        if (!callback) {
            return new Promise(executor);
        }
        executor(null, callback);
        /**
     * @param {null|((file: VFile) => void)} resolve
     * @param {(error?: Error|null|undefined) => void} reject
     * @returns {void}
     */ function executor(resolve, reject) {
            const file = vfile(doc);
            processor.run(processor.parse(file), file, (error, tree, file)=>{
                if (error || !tree || !file) {
                    done(error);
                } else {
                    /** @type {unknown} */ const result = processor.stringify(tree, file);
                    if (result === undefined || result === null) {
                    // Empty.
                    } else if (looksLikeAVFileValue(result)) {
                        file.value = result;
                    } else {
                        file.result = result;
                    }
                    done(error, file);
                }
            });
            /**
       * @param {Error|null|undefined} [error]
       * @param {VFile|undefined} [file]
       * @returns {void}
       */ function done(error, file) {
                if (error || !file) {
                    reject(error);
                } else if (resolve) {
                    resolve(file);
                } else {
                    // @ts-expect-error: `callback` is defined if `resolve` is not.
                    callback(null, file);
                }
            }
        }
    }
    /** @type {Processor['processSync']} */ function processSync(doc) {
        /** @type {boolean|undefined} */ let complete;
        processor.freeze();
        assertParser('processSync', processor.Parser);
        assertCompiler('processSync', processor.Compiler);
        const file = vfile(doc);
        processor.process(file, done);
        assertDone('processSync', 'process', complete);
        return file;
        "TURBOPACK unreachable";
        /**
     * @param {Error|null|undefined} [error]
     * @returns {void}
     */ function done(error) {
            complete = true;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bail$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bail"])(error);
        }
    }
}
/**
 * Check if `value` is a constructor.
 *
 * @param {unknown} value
 * @param {string} name
 * @returns {boolean}
 */ function newable(value, name) {
    return typeof value === 'function' && // Prototypes do exist.
    // type-coverage:ignore-next-line
    value.prototype && // A function with keys in its prototype is probably a constructor.
    // Classes’ prototype methods are not enumerable, so we check if some value
    // exists in the prototype.
    // type-coverage:ignore-next-line
    (keys(value.prototype) || name in value.prototype);
}
/**
 * Check if `value` is an object with keys.
 *
 * @param {Record<string, unknown>} value
 * @returns {boolean}
 */ function keys(value) {
    /** @type {string} */ let key;
    for(key in value){
        if (own.call(value, key)) {
            return true;
        }
    }
    return false;
}
/**
 * Assert a parser is available.
 *
 * @param {string} name
 * @param {unknown} value
 * @returns {asserts value is Parser}
 */ function assertParser(name, value) {
    if (typeof value !== 'function') {
        throw new TypeError('Cannot `' + name + '` without `Parser`');
    }
}
/**
 * Assert a compiler is available.
 *
 * @param {string} name
 * @param {unknown} value
 * @returns {asserts value is Compiler}
 */ function assertCompiler(name, value) {
    if (typeof value !== 'function') {
        throw new TypeError('Cannot `' + name + '` without `Compiler`');
    }
}
/**
 * Assert the processor is not frozen.
 *
 * @param {string} name
 * @param {unknown} frozen
 * @returns {asserts frozen is false}
 */ function assertUnfrozen(name, frozen) {
    if (frozen) {
        throw new Error('Cannot call `' + name + '` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.');
    }
}
/**
 * Assert `node` is a unist node.
 *
 * @param {unknown} node
 * @returns {asserts node is Node}
 */ function assertNode(node) {
    // `isPlainObj` unfortunately uses `any` instead of `unknown`.
    // type-coverage:ignore-next-line
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$is$2d$plain$2d$obj$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(node) || typeof node.type !== 'string') {
        throw new TypeError('Expected node, got `' + node + '`');
    // Fine.
    }
}
/**
 * Assert that `complete` is `true`.
 *
 * @param {string} name
 * @param {string} asyncName
 * @param {unknown} complete
 * @returns {asserts complete is true}
 */ function assertDone(name, asyncName, complete) {
    if (!complete) {
        throw new Error('`' + name + '` finished async. Use `' + asyncName + '` instead');
    }
}
/**
 * @param {VFileCompatible} [value]
 * @returns {VFile}
 */ function vfile(value) {
    return looksLikeAVFile(value) ? value : new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$vfile$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VFile"](value);
}
/**
 * @param {VFileCompatible} [value]
 * @returns {value is VFile}
 */ function looksLikeAVFile(value) {
    return Boolean(value && typeof value === 'object' && 'message' in value && 'messages' in value);
}
/**
 * @param {unknown} [value]
 * @returns {value is VFileValue}
 */ function looksLikeAVFileValue(value) {
    return typeof value === 'string' || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$is$2d$buffer$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(value);
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/react-markdown/lib/rehype-filter.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>rehypeFilter)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$unist$2d$util$2d$visit$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/unist-util-visit/lib/index.js [app-ssr] (ecmascript) <locals>");
;
function rehypeFilter(options) {
    if (options.allowedElements && options.disallowedElements) {
        throw new TypeError('Only one of `allowedElements` and `disallowedElements` should be defined');
    }
    if (options.allowedElements || options.disallowedElements || options.allowElement) {
        return (tree)=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$unist$2d$util$2d$visit$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["visit"])(tree, 'element', (node, index, parent_)=>{
                const parent = parent_;
                /** @type {boolean|undefined} */ let remove;
                if (options.allowedElements) {
                    remove = !options.allowedElements.includes(node.tagName);
                } else if (options.disallowedElements) {
                    remove = options.disallowedElements.includes(node.tagName);
                }
                if (!remove && options.allowElement && typeof index === 'number') {
                    remove = !options.allowElement(node, index, parent);
                }
                if (remove && typeof index === 'number') {
                    if (options.unwrapDisallowed && node.children) {
                        parent.children.splice(index, 1, ...node.children);
                    } else {
                        parent.children.splice(index, 1);
                    }
                    return index;
                }
                return undefined;
            });
        };
    }
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/react-markdown/lib/uri-transformer.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "uriTransformer": (()=>uriTransformer)
});
const protocols = [
    'http',
    'https',
    'mailto',
    'tel'
];
function uriTransformer(uri) {
    const url = (uri || '').trim();
    const first = url.charAt(0);
    if (first === '#' || first === '/') {
        return url;
    }
    const colon = url.indexOf(':');
    if (colon === -1) {
        return url;
    }
    let index = -1;
    while(++index < protocols.length){
        const protocol = protocols[index];
        if (colon === protocol.length && url.slice(0, protocol.length).toLowerCase() === protocol) {
            return url;
        }
    }
    index = url.indexOf('?');
    if (index !== -1 && colon > index) {
        return url;
    }
    index = url.indexOf('#');
    if (index !== -1 && colon > index) {
        return url;
    }
    // eslint-disable-next-line no-script-url
    return 'javascript:void(0)';
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/react-markdown/lib/ast-to-react.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * @template T
 * @typedef {import('react').ComponentType<T>} ComponentType<T>
 */ /**
 * @template {import('react').ElementType} T
 * @typedef {import('react').ComponentPropsWithoutRef<T>} ComponentPropsWithoutRef<T>
 */ /**
 * @typedef {import('react').ReactNode} ReactNode
 * @typedef {import('unist').Position} Position
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').ElementContent} ElementContent
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Text} Text
 * @typedef {import('hast').Comment} Comment
 * @typedef {import('hast').DocType} Doctype
 * @typedef {import('property-information').Info} Info
 * @typedef {import('property-information').Schema} Schema
 * @typedef {import('./complex-types.js').ReactMarkdownProps} ReactMarkdownProps
 *
 * @typedef Raw
 * @property {'raw'} type
 * @property {string} value
 *
 * @typedef Context
 * @property {Options} options
 * @property {Schema} schema
 * @property {number} listDepth
 *
 * @callback TransformLink
 * @param {string} href
 * @param {Array<ElementContent>} children
 * @param {string?} title
 * @returns {string}
 *
 * @callback TransformImage
 * @param {string} src
 * @param {string} alt
 * @param {string?} title
 * @returns {string}
 *
 * @typedef {import('react').HTMLAttributeAnchorTarget} TransformLinkTargetType
 *
 * @callback TransformLinkTarget
 * @param {string} href
 * @param {Array<ElementContent>} children
 * @param {string?} title
 * @returns {TransformLinkTargetType|undefined}
 *
 * @typedef {keyof JSX.IntrinsicElements} ReactMarkdownNames
 *
 * To do: is `data-sourcepos` typeable?
 *
 * @typedef {ComponentPropsWithoutRef<'code'> & ReactMarkdownProps & {inline?: boolean}} CodeProps
 * @typedef {ComponentPropsWithoutRef<'h1'> & ReactMarkdownProps & {level: number}} HeadingProps
 * @typedef {ComponentPropsWithoutRef<'li'> & ReactMarkdownProps & {checked: boolean|null, index: number, ordered: boolean}} LiProps
 * @typedef {ComponentPropsWithoutRef<'ol'> & ReactMarkdownProps & {depth: number, ordered: true}} OrderedListProps
 * @typedef {ComponentPropsWithoutRef<'td'> & ReactMarkdownProps & {style?: Record<string, unknown>, isHeader: false}} TableDataCellProps
 * @typedef {ComponentPropsWithoutRef<'th'> & ReactMarkdownProps & {style?: Record<string, unknown>, isHeader: true}} TableHeaderCellProps
 * @typedef {ComponentPropsWithoutRef<'tr'> & ReactMarkdownProps & {isHeader: boolean}} TableRowProps
 * @typedef {ComponentPropsWithoutRef<'ul'> & ReactMarkdownProps & {depth: number, ordered: false}} UnorderedListProps
 *
 * @typedef {ComponentType<CodeProps>} CodeComponent
 * @typedef {ComponentType<HeadingProps>} HeadingComponent
 * @typedef {ComponentType<LiProps>} LiComponent
 * @typedef {ComponentType<OrderedListProps>} OrderedListComponent
 * @typedef {ComponentType<TableDataCellProps>} TableDataCellComponent
 * @typedef {ComponentType<TableHeaderCellProps>} TableHeaderCellComponent
 * @typedef {ComponentType<TableRowProps>} TableRowComponent
 * @typedef {ComponentType<UnorderedListProps>} UnorderedListComponent
 *
 * @typedef SpecialComponents
 * @property {CodeComponent|ReactMarkdownNames} code
 * @property {HeadingComponent|ReactMarkdownNames} h1
 * @property {HeadingComponent|ReactMarkdownNames} h2
 * @property {HeadingComponent|ReactMarkdownNames} h3
 * @property {HeadingComponent|ReactMarkdownNames} h4
 * @property {HeadingComponent|ReactMarkdownNames} h5
 * @property {HeadingComponent|ReactMarkdownNames} h6
 * @property {LiComponent|ReactMarkdownNames} li
 * @property {OrderedListComponent|ReactMarkdownNames} ol
 * @property {TableDataCellComponent|ReactMarkdownNames} td
 * @property {TableHeaderCellComponent|ReactMarkdownNames} th
 * @property {TableRowComponent|ReactMarkdownNames} tr
 * @property {UnorderedListComponent|ReactMarkdownNames} ul
 *
 * @typedef {Partial<Omit<import('./complex-types.js').NormalComponents, keyof SpecialComponents> & SpecialComponents>} Components
 *
 * @typedef Options
 * @property {boolean} [sourcePos=false]
 * @property {boolean} [rawSourcePos=false]
 * @property {boolean} [skipHtml=false]
 * @property {boolean} [includeElementIndex=false]
 * @property {null|false|TransformLink} [transformLinkUri]
 * @property {TransformImage} [transformImageUri]
 * @property {TransformLinkTargetType|TransformLinkTarget} [linkTarget]
 * @property {Components} [components]
 */ __turbopack_context__.s({
    "childrenToReact": (()=>childrenToReact)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$react$2d$is$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/react-is/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$hast$2d$util$2d$whitespace$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/hast-util-whitespace/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$property$2d$information$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/property-information/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$property$2d$information$2f$lib$2f$find$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/property-information/lib/find.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$property$2d$information$2f$lib$2f$hast$2d$to$2d$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/property-information/lib/hast-to-react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$space$2d$separated$2d$tokens$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/space-separated-tokens/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$comma$2d$separated$2d$tokens$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/comma-separated-tokens/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$style$2d$to$2d$object$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/style-to-object/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$react$2d$markdown$2f$lib$2f$uri$2d$transformer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/react-markdown/lib/uri-transformer.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
const own = {}.hasOwnProperty;
// The table-related elements that must not contain whitespace text according
// to React.
const tableElements = new Set([
    'table',
    'thead',
    'tbody',
    'tfoot',
    'tr'
]);
function childrenToReact(context, node) {
    /** @type {Array<ReactNode>} */ const children = [];
    let childIndex = -1;
    /** @type {Comment|Doctype|Element|Raw|Text} */ let child;
    while(++childIndex < node.children.length){
        child = node.children[childIndex];
        if (child.type === 'element') {
            children.push(toReact(context, child, childIndex, node));
        } else if (child.type === 'text') {
            // Currently, a warning is triggered by react for *any* white space in
            // tables.
            // So we drop it.
            // See: <https://github.com/facebook/react/pull/7081>.
            // See: <https://github.com/facebook/react/pull/7515>.
            // See: <https://github.com/remarkjs/remark-react/issues/64>.
            // See: <https://github.com/remarkjs/react-markdown/issues/576>.
            if (node.type !== 'element' || !tableElements.has(node.tagName) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$hast$2d$util$2d$whitespace$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["whitespace"])(child)) {
                children.push(child.value);
            }
        } else if (child.type === 'raw' && !context.options.skipHtml) {
            // Default behavior is to show (encoded) HTML.
            children.push(child.value);
        }
    }
    return children;
}
/**
 * @param {Context} context
 * @param {Element} node
 * @param {number} index
 * @param {Element|Root} parent
 */ function toReact(context, node, index, parent) {
    const options = context.options;
    const transform = options.transformLinkUri === undefined ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$react$2d$markdown$2f$lib$2f$uri$2d$transformer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["uriTransformer"] : options.transformLinkUri;
    const parentSchema = context.schema;
    /** @type {ReactMarkdownNames} */ // @ts-expect-error assume a known HTML/SVG element.
    const name = node.tagName;
    /** @type {Record<string, unknown>} */ const properties = {};
    let schema = parentSchema;
    /** @type {string} */ let property;
    if (parentSchema.space === 'html' && name === 'svg') {
        schema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$property$2d$information$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["svg"];
        context.schema = schema;
    }
    if (node.properties) {
        for(property in node.properties){
            if (own.call(node.properties, property)) {
                addProperty(properties, property, node.properties[property], context);
            }
        }
    }
    if (name === 'ol' || name === 'ul') {
        context.listDepth++;
    }
    const children = childrenToReact(context, node);
    if (name === 'ol' || name === 'ul') {
        context.listDepth--;
    }
    // Restore parent schema.
    context.schema = parentSchema;
    // Nodes created by plugins do not have positional info, in which case we use
    // an object that matches the position interface.
    const position = node.position || {
        start: {
            line: null,
            column: null,
            offset: null
        },
        end: {
            line: null,
            column: null,
            offset: null
        }
    };
    const component = options.components && own.call(options.components, name) ? options.components[name] : name;
    const basic = typeof component === 'string' || component === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Fragment;
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$react$2d$is$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].isValidElementType(component)) {
        throw new TypeError(`Component for name \`${name}\` not defined or is not renderable`);
    }
    properties.key = index;
    if (name === 'a' && options.linkTarget) {
        properties.target = typeof options.linkTarget === 'function' ? options.linkTarget(String(properties.href || ''), node.children, typeof properties.title === 'string' ? properties.title : null) : options.linkTarget;
    }
    if (name === 'a' && transform) {
        properties.href = transform(String(properties.href || ''), node.children, typeof properties.title === 'string' ? properties.title : null);
    }
    if (!basic && name === 'code' && parent.type === 'element' && parent.tagName !== 'pre') {
        properties.inline = true;
    }
    if (!basic && (name === 'h1' || name === 'h2' || name === 'h3' || name === 'h4' || name === 'h5' || name === 'h6')) {
        properties.level = Number.parseInt(name.charAt(1), 10);
    }
    if (name === 'img' && options.transformImageUri) {
        properties.src = options.transformImageUri(String(properties.src || ''), String(properties.alt || ''), typeof properties.title === 'string' ? properties.title : null);
    }
    if (!basic && name === 'li' && parent.type === 'element') {
        const input = getInputElement(node);
        properties.checked = input && input.properties ? Boolean(input.properties.checked) : null;
        properties.index = getElementsBeforeCount(parent, node);
        properties.ordered = parent.tagName === 'ol';
    }
    if (!basic && (name === 'ol' || name === 'ul')) {
        properties.ordered = name === 'ol';
        properties.depth = context.listDepth;
    }
    if (name === 'td' || name === 'th') {
        if (properties.align) {
            if (!properties.style) properties.style = {};
            // @ts-expect-error assume `style` is an object
            properties.style.textAlign = properties.align;
            delete properties.align;
        }
        if (!basic) {
            properties.isHeader = name === 'th';
        }
    }
    if (!basic && name === 'tr' && parent.type === 'element') {
        properties.isHeader = Boolean(parent.tagName === 'thead');
    }
    // If `sourcePos` is given, pass source information (line/column info from markdown source).
    if (options.sourcePos) {
        properties['data-sourcepos'] = flattenPosition(position);
    }
    if (!basic && options.rawSourcePos) {
        properties.sourcePosition = node.position;
    }
    // If `includeElementIndex` is given, pass node index info to components.
    if (!basic && options.includeElementIndex) {
        properties.index = getElementsBeforeCount(parent, node);
        properties.siblingCount = getElementsBeforeCount(parent);
    }
    if (!basic) {
        properties.node = node;
    }
    // Ensure no React warnings are emitted for void elements w/ children.
    return children.length > 0 ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(component, properties, children) : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(component, properties);
}
/**
 * @param {Element|Root} node
 * @returns {Element?}
 */ function getInputElement(node) {
    let index = -1;
    while(++index < node.children.length){
        const child = node.children[index];
        if (child.type === 'element' && child.tagName === 'input') {
            return child;
        }
    }
    return null;
}
/**
 * @param {Element|Root} parent
 * @param {Element} [node]
 * @returns {number}
 */ function getElementsBeforeCount(parent, node) {
    let index = -1;
    let count = 0;
    while(++index < parent.children.length){
        if (parent.children[index] === node) break;
        if (parent.children[index].type === 'element') count++;
    }
    return count;
}
/**
 * @param {Record<string, unknown>} props
 * @param {string} prop
 * @param {unknown} value
 * @param {Context} ctx
 */ function addProperty(props, prop, value, ctx) {
    const info = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$property$2d$information$2f$lib$2f$find$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["find"])(ctx.schema, prop);
    let result = value;
    // Ignore nullish and `NaN` values.
    // eslint-disable-next-line no-self-compare
    if (result === null || result === undefined || result !== result) {
        return;
    }
    // Accept `array`.
    // Most props are space-separated.
    if (Array.isArray(result)) {
        result = info.commaSeparated ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$comma$2d$separated$2d$tokens$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stringify"])(result) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$space$2d$separated$2d$tokens$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stringify"])(result);
    }
    if (info.property === 'style' && typeof result === 'string') {
        result = parseStyle(result);
    }
    if (info.space && info.property) {
        props[own.call(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$property$2d$information$2f$lib$2f$hast$2d$to$2d$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hastToReact"], info.property) ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$property$2d$information$2f$lib$2f$hast$2d$to$2d$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hastToReact"][info.property] : info.property] = result;
    } else if (info.attribute) {
        props[info.attribute] = result;
    }
}
/**
 * @param {string} value
 * @returns {Record<string, string>}
 */ function parseStyle(value) {
    /** @type {Record<string, string>} */ const result = {};
    try {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$style$2d$to$2d$object$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(value, iterator);
    } catch  {
    // Silent.
    }
    return result;
    "TURBOPACK unreachable";
    /**
   * @param {string} name
   * @param {string} v
   */ function iterator(name, v) {
        const k = name.slice(0, 4) === '-ms-' ? `ms-${name.slice(4)}` : name;
        result[k.replace(/-([a-z])/g, styleReplacer)] = v;
    }
}
/**
 * @param {unknown} _
 * @param {string} $1
 */ function styleReplacer(_, $1) {
    return $1.toUpperCase();
}
/**
 * @param {Position|{start: {line: null, column: null, offset: null}, end: {line: null, column: null, offset: null}}} pos
 * @returns {string}
 */ function flattenPosition(pos) {
    return [
        pos.start.line,
        ':',
        pos.start.column,
        '-',
        pos.end.line,
        ':',
        pos.end.column
    ].map(String).join('');
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/react-markdown/lib/react-markdown.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * @typedef {import('react').ReactNode} ReactNode
 * @typedef {import('react').ReactElement<{}>} ReactElement
 * @typedef {import('unified').PluggableList} PluggableList
 * @typedef {import('hast').Root} Root
 * @typedef {import('./rehype-filter.js').Options} FilterOptions
 * @typedef {import('./ast-to-react.js').Options} TransformOptions
 *
 * @typedef CoreOptions
 * @property {string} children
 *
 * @typedef PluginOptions
 * @property {PluggableList} [remarkPlugins=[]]
 * @property {PluggableList} [rehypePlugins=[]]
 * @property {import('remark-rehype').Options | undefined} [remarkRehypeOptions={}]
 *
 * @typedef LayoutOptions
 * @property {string} [className]
 *
 * @typedef {CoreOptions & PluginOptions & LayoutOptions & FilterOptions & TransformOptions} ReactMarkdownOptions
 *
 * @typedef Deprecation
 * @property {string} id
 * @property {string} [to]
 */ __turbopack_context__.s({
    "ReactMarkdown": (()=>ReactMarkdown)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$vfile$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/vfile/lib/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$unified$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/unified/lib/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$remark$2d$parse$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/remark-parse/lib/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$remark$2d$rehype$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/remark-rehype/lib/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/prop-types/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$property$2d$information$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/property-information/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$react$2d$markdown$2f$lib$2f$rehype$2d$filter$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/react-markdown/lib/rehype-filter.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$react$2d$markdown$2f$lib$2f$ast$2d$to$2d$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/react-markdown/lib/ast-to-react.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
const own = {}.hasOwnProperty;
const changelog = 'https://github.com/remarkjs/react-markdown/blob/main/changelog.md';
/** @type {Record<string, Deprecation>} */ const deprecated = {
    plugins: {
        to: 'remarkPlugins',
        id: 'change-plugins-to-remarkplugins'
    },
    renderers: {
        to: 'components',
        id: 'change-renderers-to-components'
    },
    astPlugins: {
        id: 'remove-buggy-html-in-markdown-parser'
    },
    allowDangerousHtml: {
        id: 'remove-buggy-html-in-markdown-parser'
    },
    escapeHtml: {
        id: 'remove-buggy-html-in-markdown-parser'
    },
    source: {
        to: 'children',
        id: 'change-source-to-children'
    },
    allowNode: {
        to: 'allowElement',
        id: 'replace-allownode-allowedtypes-and-disallowedtypes'
    },
    allowedTypes: {
        to: 'allowedElements',
        id: 'replace-allownode-allowedtypes-and-disallowedtypes'
    },
    disallowedTypes: {
        to: 'disallowedElements',
        id: 'replace-allownode-allowedtypes-and-disallowedtypes'
    },
    includeNodeIndex: {
        to: 'includeElementIndex',
        id: 'change-includenodeindex-to-includeelementindex'
    }
};
function ReactMarkdown(options) {
    for(const key in deprecated){
        if (own.call(deprecated, key) && own.call(options, key)) {
            const deprecation = deprecated[key];
            console.warn(`[react-markdown] Warning: please ${deprecation.to ? `use \`${deprecation.to}\` instead of` : 'remove'} \`${key}\` (see <${changelog}#${deprecation.id}> for more info)`);
            delete deprecated[key];
        }
    }
    const processor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$unified$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unified"])().use(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$remark$2d$parse$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]).use(options.remarkPlugins || []).use(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$remark$2d$rehype$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        ...options.remarkRehypeOptions,
        allowDangerousHtml: true
    }).use(options.rehypePlugins || []).use(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$react$2d$markdown$2f$lib$2f$rehype$2d$filter$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], options);
    const file = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$vfile$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VFile"]();
    if (typeof options.children === 'string') {
        file.value = options.children;
    } else if (options.children !== undefined && options.children !== null) {
        console.warn(`[react-markdown] Warning: please pass a string as \`children\` (not: \`${options.children}\`)`);
    }
    const hastNode = processor.runSync(processor.parse(file), file);
    if (hastNode.type !== 'root') {
        throw new TypeError('Expected a `root` node');
    }
    /** @type {ReactElement} */ let result = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Fragment, {}, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$react$2d$markdown$2f$lib$2f$ast$2d$to$2d$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["childrenToReact"])({
        options,
        schema: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$property$2d$information$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["html"],
        listDepth: 0
    }, hastNode));
    if (options.className) {
        result = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement('div', {
            className: options.className
        }, result);
    }
    return result;
}
ReactMarkdown.propTypes = {
    // Core options:
    children: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].string,
    // Layout options:
    className: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].string,
    // Filter options:
    allowElement: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].func,
    allowedElements: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].arrayOf(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].string),
    disallowedElements: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].arrayOf(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].string),
    unwrapDisallowed: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].bool,
    // Plugin options:
    remarkPlugins: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].arrayOf(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].oneOfType([
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].object,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].func,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].arrayOf(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].oneOfType([
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].bool,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].string,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].object,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].func,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].arrayOf(// prettier-ignore
            // type-coverage:ignore-next-line
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].any)
        ]))
    ])),
    rehypePlugins: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].arrayOf(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].oneOfType([
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].object,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].func,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].arrayOf(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].oneOfType([
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].bool,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].string,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].object,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].func,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].arrayOf(// prettier-ignore
            // type-coverage:ignore-next-line
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].any)
        ]))
    ])),
    // Transform options:
    sourcePos: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].bool,
    rawSourcePos: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].bool,
    skipHtml: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].bool,
    includeElementIndex: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].bool,
    transformLinkUri: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].oneOfType([
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].func,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].bool
    ]),
    linkTarget: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].oneOfType([
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].func,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].string
    ]),
    transformImageUri: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].func,
    components: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].object
};
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/react-markdown/lib/react-markdown.js [app-ssr] (ecmascript) <export ReactMarkdown as default>": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$react$2d$markdown$2f$lib$2f$react$2d$markdown$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReactMarkdown"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$copilotkit$2f$react$2d$ui$2f$node_modules$2f$react$2d$markdown$2f$lib$2f$react$2d$markdown$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@copilotkit/react-ui/node_modules/react-markdown/lib/react-markdown.js [app-ssr] (ecmascript)");
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/react-is/cjs/react-is.development.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
/**
 * @license React
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ 'use strict';
if ("TURBOPACK compile-time truthy", 1) {
    (function() {
        'use strict';
        // ATTENTION
        // When adding new symbols to this file,
        // Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
        // The Symbol used to tag the ReactElement-like types.
        var REACT_ELEMENT_TYPE = Symbol.for('react.element');
        var REACT_PORTAL_TYPE = Symbol.for('react.portal');
        var REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
        var REACT_STRICT_MODE_TYPE = Symbol.for('react.strict_mode');
        var REACT_PROFILER_TYPE = Symbol.for('react.profiler');
        var REACT_PROVIDER_TYPE = Symbol.for('react.provider');
        var REACT_CONTEXT_TYPE = Symbol.for('react.context');
        var REACT_SERVER_CONTEXT_TYPE = Symbol.for('react.server_context');
        var REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref');
        var REACT_SUSPENSE_TYPE = Symbol.for('react.suspense');
        var REACT_SUSPENSE_LIST_TYPE = Symbol.for('react.suspense_list');
        var REACT_MEMO_TYPE = Symbol.for('react.memo');
        var REACT_LAZY_TYPE = Symbol.for('react.lazy');
        var REACT_OFFSCREEN_TYPE = Symbol.for('react.offscreen');
        // -----------------------------------------------------------------------------
        var enableScopeAPI = false; // Experimental Create Event Handle API.
        var enableCacheElement = false;
        var enableTransitionTracing = false; // No known bugs, but needs performance testing
        var enableLegacyHidden = false; // Enables unstable_avoidThisFallback feature in Fiber
        // stuff. Intended to enable React core members to more easily debug scheduling
        // issues in DEV builds.
        var enableDebugTracing = false; // Track which Fiber(s) schedule render work.
        var REACT_MODULE_REFERENCE;
        {
            REACT_MODULE_REFERENCE = Symbol.for('react.module.reference');
        }
        function isValidElementType(type) {
            if (typeof type === 'string' || typeof type === 'function') {
                return true;
            } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).
            if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
                return true;
            }
            if (typeof type === 'object' && type !== null) {
                if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
                // types supported by any Flight configuration anywhere since
                // we don't know which Flight build this will end up being used
                // with.
                type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== undefined) {
                    return true;
                }
            }
            return false;
        }
        function typeOf(object) {
            if (typeof object === 'object' && object !== null) {
                var $$typeof = object.$$typeof;
                switch($$typeof){
                    case REACT_ELEMENT_TYPE:
                        var type = object.type;
                        switch(type){
                            case REACT_FRAGMENT_TYPE:
                            case REACT_PROFILER_TYPE:
                            case REACT_STRICT_MODE_TYPE:
                            case REACT_SUSPENSE_TYPE:
                            case REACT_SUSPENSE_LIST_TYPE:
                                return type;
                            default:
                                var $$typeofType = type && type.$$typeof;
                                switch($$typeofType){
                                    case REACT_SERVER_CONTEXT_TYPE:
                                    case REACT_CONTEXT_TYPE:
                                    case REACT_FORWARD_REF_TYPE:
                                    case REACT_LAZY_TYPE:
                                    case REACT_MEMO_TYPE:
                                    case REACT_PROVIDER_TYPE:
                                        return $$typeofType;
                                    default:
                                        return $$typeof;
                                }
                        }
                    case REACT_PORTAL_TYPE:
                        return $$typeof;
                }
            }
            return undefined;
        }
        var ContextConsumer = REACT_CONTEXT_TYPE;
        var ContextProvider = REACT_PROVIDER_TYPE;
        var Element = REACT_ELEMENT_TYPE;
        var ForwardRef = REACT_FORWARD_REF_TYPE;
        var Fragment = REACT_FRAGMENT_TYPE;
        var Lazy = REACT_LAZY_TYPE;
        var Memo = REACT_MEMO_TYPE;
        var Portal = REACT_PORTAL_TYPE;
        var Profiler = REACT_PROFILER_TYPE;
        var StrictMode = REACT_STRICT_MODE_TYPE;
        var Suspense = REACT_SUSPENSE_TYPE;
        var SuspenseList = REACT_SUSPENSE_LIST_TYPE;
        var hasWarnedAboutDeprecatedIsAsyncMode = false;
        var hasWarnedAboutDeprecatedIsConcurrentMode = false; // AsyncMode should be deprecated
        function isAsyncMode(object) {
            {
                if (!hasWarnedAboutDeprecatedIsAsyncMode) {
                    hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint
                    console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 18+.');
                }
            }
            return false;
        }
        function isConcurrentMode(object) {
            {
                if (!hasWarnedAboutDeprecatedIsConcurrentMode) {
                    hasWarnedAboutDeprecatedIsConcurrentMode = true; // Using console['warn'] to evade Babel and ESLint
                    console['warn']('The ReactIs.isConcurrentMode() alias has been deprecated, ' + 'and will be removed in React 18+.');
                }
            }
            return false;
        }
        function isContextConsumer(object) {
            return typeOf(object) === REACT_CONTEXT_TYPE;
        }
        function isContextProvider(object) {
            return typeOf(object) === REACT_PROVIDER_TYPE;
        }
        function isElement(object) {
            return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        function isForwardRef(object) {
            return typeOf(object) === REACT_FORWARD_REF_TYPE;
        }
        function isFragment(object) {
            return typeOf(object) === REACT_FRAGMENT_TYPE;
        }
        function isLazy(object) {
            return typeOf(object) === REACT_LAZY_TYPE;
        }
        function isMemo(object) {
            return typeOf(object) === REACT_MEMO_TYPE;
        }
        function isPortal(object) {
            return typeOf(object) === REACT_PORTAL_TYPE;
        }
        function isProfiler(object) {
            return typeOf(object) === REACT_PROFILER_TYPE;
        }
        function isStrictMode(object) {
            return typeOf(object) === REACT_STRICT_MODE_TYPE;
        }
        function isSuspense(object) {
            return typeOf(object) === REACT_SUSPENSE_TYPE;
        }
        function isSuspenseList(object) {
            return typeOf(object) === REACT_SUSPENSE_LIST_TYPE;
        }
        exports.ContextConsumer = ContextConsumer;
        exports.ContextProvider = ContextProvider;
        exports.Element = Element;
        exports.ForwardRef = ForwardRef;
        exports.Fragment = Fragment;
        exports.Lazy = Lazy;
        exports.Memo = Memo;
        exports.Portal = Portal;
        exports.Profiler = Profiler;
        exports.StrictMode = StrictMode;
        exports.Suspense = Suspense;
        exports.SuspenseList = SuspenseList;
        exports.isAsyncMode = isAsyncMode;
        exports.isConcurrentMode = isConcurrentMode;
        exports.isContextConsumer = isContextConsumer;
        exports.isContextProvider = isContextProvider;
        exports.isElement = isElement;
        exports.isForwardRef = isForwardRef;
        exports.isFragment = isFragment;
        exports.isLazy = isLazy;
        exports.isMemo = isMemo;
        exports.isPortal = isPortal;
        exports.isProfiler = isProfiler;
        exports.isStrictMode = isStrictMode;
        exports.isSuspense = isSuspense;
        exports.isSuspenseList = isSuspenseList;
        exports.isValidElementType = isValidElementType;
        exports.typeOf = typeOf;
    })();
}
}}),
"[project]/node_modules/@copilotkit/react-ui/node_modules/react-is/index.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
'use strict';
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
} else {
    module.exports = __turbopack_context__.r("[project]/node_modules/@copilotkit/react-ui/node_modules/react-is/cjs/react-is.development.js [app-ssr] (ecmascript)");
}
}}),

};

//# sourceMappingURL=9acf8_640cadfd._.js.map