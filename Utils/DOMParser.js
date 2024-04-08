/**
 * DOMParser
 * @description 使用Env、OpenAPI等兼容方法进行网络请求, 这里使用Env举例
 * @example
 * 
const $ = new Env("ModuleName")
async function loadDOMParser() {
    return new Promise(async (resolve) => {
        $.getScript(
            'https://cdn.jsdelivr.net/gh/Yuheng0101/X@main/Utils/DOMParser.js'
        ).then((fn) => {
            eval(fn)
            const DOMParser = createDOMParser()
            console.log(`✅ DOMParser加载成功, 请继续`)
            resolve(DOMParser)
        })
    })
}
 */
function createDOMParser() {
    function r(e, n, t) {
        let result = {}
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = 'function' == typeof require && require
                    if (!f && c) return c(i, !0)
                    if (u) return u(i, !0)
                    var a = new Error("Cannot find module '" + i + "'")
                    throw ((a.code = 'MODULE_NOT_FOUND'), a)
                }
                var p = (n[i] = { exports: {} })
                e[i][0].call(
                    p.exports,
                    function (r) {
                        var n = e[i][1][r]
                        return o(n || r)
                    },
                    p,
                    p.exports,
                    r,
                    e,
                    n,
                    t
                )
            }
            // console.log(n[i].exports)
            return n[i].exports
        }
        for (var u = 'function' == typeof require && require, i = 0; i < t.length; i++) {
            Object.assign(result, o(t[i]))
        }
        return result
    }
    const utils = {
        5: [
            function (require, module, exports) {
                'use strict'

                /**
                 * Ponyfill for `Array.prototype.find` which is only available in ES6 runtimes.
                 *
                 * Works with anything that has a `length` property and index access properties, including NodeList.
                 *
                 * @template {unknown} T
                 * @param {Array<T> | ({length:number, [number]: T})} list
                 * @param {function (item: T, index: number, list:Array<T> | ({length:number, [number]: T})):boolean} predicate
                 * @param {Partial<Pick<ArrayConstructor['prototype'], 'find'>>?} ac `Array.prototype` by default,
                 *                allows injecting a custom implementation in tests
                 * @returns {T | undefined}
                 *
                 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
                 * @see https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.find
                 */
                function find(list, predicate, ac) {
                    if (ac === undefined) {
                        ac = Array.prototype
                    }
                    if (list && typeof ac.find === 'function') {
                        return ac.find.call(list, predicate)
                    }
                    for (var i = 0; i < list.length; i++) {
                        if (Object.prototype.hasOwnProperty.call(list, i)) {
                            var item = list[i]
                            if (predicate.call(undefined, item, i, list)) {
                                return item
                            }
                        }
                    }
                }

                /**
                 * "Shallow freezes" an object to render it immutable.
                 * Uses `Object.freeze` if available,
                 * otherwise the immutability is only in the type.
                 *
                 * Is used to create "enum like" objects.
                 *
                 * @template T
                 * @param {T} object the object to freeze
                 * @param {Pick<ObjectConstructor, 'freeze'> = Object} oc `Object` by default,
                 *                allows to inject custom object constructor for tests
                 * @returns {Readonly<T>}
                 *
                 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
                 */
                function freeze(object, oc) {
                    if (oc === undefined) {
                        oc = Object
                    }
                    return oc && typeof oc.freeze === 'function' ? oc.freeze(object) : object
                }

                /**
                 * Since we can not rely on `Object.assign` we provide a simplified version
                 * that is sufficient for our needs.
                 *
                 * @param {Object} target
                 * @param {Object | null | undefined} source
                 *
                 * @returns {Object} target
                 * @throws TypeError if target is not an object
                 *
                 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
                 * @see https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.assign
                 */
                function assign(target, source) {
                    if (target === null || typeof target !== 'object') {
                        throw new TypeError('target is not an object')
                    }
                    for (var key in source) {
                        if (Object.prototype.hasOwnProperty.call(source, key)) {
                            target[key] = source[key]
                        }
                    }
                    return target
                }

                /**
                 * All mime types that are allowed as input to `DOMParser.parseFromString`
                 *
                 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString#Argument02 MDN
                 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#domparsersupportedtype WHATWG HTML Spec
                 * @see DOMParser.prototype.parseFromString
                 */
                var MIME_TYPE = freeze({
                    /**
                     * `text/html`, the only mime type that triggers treating an XML document as HTML.
                     *
                     * @see DOMParser.SupportedType.isHTML
                     * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
                     * @see https://en.wikipedia.org/wiki/HTML Wikipedia
                     * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
                     * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring WHATWG HTML Spec
                     */
                    HTML: 'text/html',

                    /**
                     * Helper method to check a mime type if it indicates an HTML document
                     *
                     * @param {string} [value]
                     * @returns {boolean}
                     *
                     * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
                     * @see https://en.wikipedia.org/wiki/HTML Wikipedia
                     * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
                     * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring     */
                    isHTML: function (value) {
                        return value === MIME_TYPE.HTML
                    },

                    /**
                     * `application/xml`, the standard mime type for XML documents.
                     *
                     * @see https://www.iana.org/assignments/media-types/application/xml IANA MimeType registration
                     * @see https://tools.ietf.org/html/rfc7303#section-9.1 RFC 7303
                     * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
                     */
                    XML_APPLICATION: 'application/xml',

                    /**
                     * `text/html`, an alias for `application/xml`.
                     *
                     * @see https://tools.ietf.org/html/rfc7303#section-9.2 RFC 7303
                     * @see https://www.iana.org/assignments/media-types/text/xml IANA MimeType registration
                     * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
                     */
                    XML_TEXT: 'text/xml',

                    /**
                     * `application/xhtml+xml`, indicates an XML document that has the default HTML namespace,
                     * but is parsed as an XML document.
                     *
                     * @see https://www.iana.org/assignments/media-types/application/xhtml+xml IANA MimeType registration
                     * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument WHATWG DOM Spec
                     * @see https://en.wikipedia.org/wiki/XHTML Wikipedia
                     */
                    XML_XHTML_APPLICATION: 'application/xhtml+xml',

                    /**
                     * `image/svg+xml`,
                     *
                     * @see https://www.iana.org/assignments/media-types/image/svg+xml IANA MimeType registration
                     * @see https://www.w3.org/TR/SVG11/ W3C SVG 1.1
                     * @see https://en.wikipedia.org/wiki/Scalable_Vector_Graphics Wikipedia
                     */
                    XML_SVG_IMAGE: 'image/svg+xml'
                })

                /**
                 * Namespaces that are used in this code base.
                 *
                 * @see http://www.w3.org/TR/REC-xml-names
                 */
                var NAMESPACE = freeze({
                    /**
                     * The XHTML namespace.
                     *
                     * @see http://www.w3.org/1999/xhtml
                     */
                    HTML: 'http://www.w3.org/1999/xhtml',

                    /**
                     * Checks if `uri` equals `NAMESPACE.HTML`.
                     *
                     * @param {string} [uri]
                     *
                     * @see NAMESPACE.HTML
                     */
                    isHTML: function (uri) {
                        return uri === NAMESPACE.HTML
                    },

                    /**
                     * The SVG namespace.
                     *
                     * @see http://www.w3.org/2000/svg
                     */
                    SVG: 'http://www.w3.org/2000/svg',

                    /**
                     * The `xml:` namespace.
                     *
                     * @see http://www.w3.org/XML/1998/namespace
                     */
                    XML: 'http://www.w3.org/XML/1998/namespace',

                    /**
                     * The `xmlns:` namespace
                     *
                     * @see https://www.w3.org/2000/xmlns/
                     */
                    XMLNS: 'http://www.w3.org/2000/xmlns/'
                })

                exports.assign = assign
                exports.find = find
                exports.freeze = freeze
                exports.MIME_TYPE = MIME_TYPE
                exports.NAMESPACE = NAMESPACE
            },
            {}
        ],
        6: [
            function (require, module, exports) {
                var conventions = require('./conventions')
                var dom = require('./dom')
                var entities = require('./entities')
                var sax = require('./sax')

                var DOMImplementation = dom.DOMImplementation

                var NAMESPACE = conventions.NAMESPACE

                var ParseError = sax.ParseError
                var XMLReader = sax.XMLReader

                /**
                 * Normalizes line ending according to https://www.w3.org/TR/xml11/#sec-line-ends:
                 *
                 * > XML parsed entities are often stored in computer files which,
                 * > for editing convenience, are organized into lines.
                 * > These lines are typically separated by some combination
                 * > of the characters CARRIAGE RETURN (#xD) and LINE FEED (#xA).
                 * >
                 * > To simplify the tasks of applications, the XML processor must behave
                 * > as if it normalized all line breaks in external parsed entities (including the document entity)
                 * > on input, before parsing, by translating all of the following to a single #xA character:
                 * >
                 * > 1. the two-character sequence #xD #xA
                 * > 2. the two-character sequence #xD #x85
                 * > 3. the single character #x85
                 * > 4. the single character #x2028
                 * > 5. any #xD character that is not immediately followed by #xA or #x85.
                 *
                 * @param {string} input
                 * @returns {string}
                 */
                function normalizeLineEndings(input) {
                    return input.replace(/\r[\n\u0085]/g, '\n').replace(/[\r\u0085\u2028]/g, '\n')
                }

                /**
                 * @typedef Locator
                 * @property {number} [columnNumber]
                 * @property {number} [lineNumber]
                 */

                /**
                 * @typedef DOMParserOptions
                 * @property {DOMHandler} [domBuilder]
                 * @property {Function} [errorHandler]
                 * @property {(string) => string} [normalizeLineEndings] used to replace line endings before parsing
                 *                        defaults to `normalizeLineEndings`
                 * @property {Locator} [locator]
                 * @property {Record<string, string>} [xmlns]
                 *
                 * @see normalizeLineEndings
                 */

                /**
                 * The DOMParser interface provides the ability to parse XML or HTML source code
                 * from a string into a DOM `Document`.
                 *
                 * _xmldom is different from the spec in that it allows an `options` parameter,
                 * to override the default behavior._
                 *
                 * @param {DOMParserOptions} [options]
                 * @constructor
                 *
                 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
                 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-parsing-and-serialization
                 */
                function DOMParser(options) {
                    this.options = options || { locator: {} }
                }

                DOMParser.prototype.parseFromString = function (source, mimeType) {
                    var options = this.options
                    var sax = new XMLReader()
                    var domBuilder = options.domBuilder || new DOMHandler() //contentHandler and LexicalHandler
                    var errorHandler = options.errorHandler
                    var locator = options.locator
                    var defaultNSMap = options.xmlns || {}
                    var isHTML = /\/x?html?$/.test(mimeType) //mimeType.toLowerCase().indexOf('html') > -1;
                    var entityMap = isHTML ? entities.HTML_ENTITIES : entities.XML_ENTITIES
                    if (locator) {
                        domBuilder.setDocumentLocator(locator)
                    }

                    sax.errorHandler = buildErrorHandler(errorHandler, domBuilder, locator)
                    sax.domBuilder = options.domBuilder || domBuilder
                    if (isHTML) {
                        defaultNSMap[''] = NAMESPACE.HTML
                    }
                    defaultNSMap.xml = defaultNSMap.xml || NAMESPACE.XML
                    var normalize = options.normalizeLineEndings || normalizeLineEndings
                    if (source && typeof source === 'string') {
                        sax.parse(normalize(source), defaultNSMap, entityMap)
                    } else {
                        sax.errorHandler.error('invalid doc source')
                    }
                    return domBuilder.doc
                }

                function buildErrorHandler(errorImpl, domBuilder, locator) {
                    if (!errorImpl) {
                        if (domBuilder instanceof DOMHandler) {
                            return domBuilder
                        }
                        errorImpl = domBuilder
                    }
                    var errorHandler = {}
                    var isCallback = errorImpl instanceof Function
                    locator = locator || {}

                    function build(key) {
                        var fn = errorImpl[key]
                        if (!fn && isCallback) {
                            fn =
                                errorImpl.length == 2
                                    ? function (msg) {
                                          errorImpl(key, msg)
                                      }
                                    : errorImpl
                        }
                        errorHandler[key] =
                            (fn &&
                                function (msg) {
                                    fn('[xmldom ' + key + ']\t' + msg + _locator(locator))
                                }) ||
                            function () {}
                    }

                    build('warning')
                    build('error')
                    build('fatalError')
                    return errorHandler
                }

                //console.log('#\n\n\n\n\n\n\n####')
                /**
                 * +ContentHandler+ErrorHandler
                 * +LexicalHandler+EntityResolver2
                 * -DeclHandler-DTDHandler
                 *
                 * DefaultHandler:EntityResolver, DTDHandler, ContentHandler, ErrorHandler
                 * DefaultHandler2:DefaultHandler,LexicalHandler, DeclHandler, EntityResolver2
                 * @link http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html
                 */
                function DOMHandler() {
                    this.cdata = false
                }

                function position(locator, node) {
                    node.lineNumber = locator.lineNumber
                    node.columnNumber = locator.columnNumber
                }

                /**
                 * @see org.xml.sax.ContentHandler#startDocument
                 * @link http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
                 */
                DOMHandler.prototype = {
                    startDocument: function () {
                        this.doc = new DOMImplementation().createDocument(null, null, null)
                        if (this.locator) {
                            this.doc.documentURI = this.locator.systemId
                        }
                    },
                    startElement: function (namespaceURI, localName, qName, attrs) {
                        var doc = this.doc
                        var el = doc.createElementNS(namespaceURI, qName || localName)
                        var len = attrs.length
                        appendElement(this, el)
                        this.currentElement = el

                        this.locator && position(this.locator, el)
                        for (var i = 0; i < len; i++) {
                            var namespaceURI = attrs.getURI(i)
                            var value = attrs.getValue(i)
                            var qName = attrs.getQName(i)
                            var attr = doc.createAttributeNS(namespaceURI, qName)
                            this.locator && position(attrs.getLocator(i), attr)
                            attr.value = attr.nodeValue = value
                            el.setAttributeNode(attr)
                        }
                    },
                    endElement: function (namespaceURI, localName, qName) {
                        var current = this.currentElement
                        var tagName = current.tagName
                        this.currentElement = current.parentNode
                    },
                    startPrefixMapping: function (prefix, uri) {},
                    endPrefixMapping: function (prefix) {},
                    processingInstruction: function (target, data) {
                        var ins = this.doc.createProcessingInstruction(target, data)
                        this.locator && position(this.locator, ins)
                        appendElement(this, ins)
                    },
                    ignorableWhitespace: function (ch, start, length) {},
                    characters: function (chars, start, length) {
                        chars = _toString.apply(this, arguments)
                        //console.log(chars)
                        if (chars) {
                            if (this.cdata) {
                                var charNode = this.doc.createCDATASection(chars)
                            } else {
                                var charNode = this.doc.createTextNode(chars)
                            }
                            if (this.currentElement) {
                                this.currentElement.appendChild(charNode)
                            } else if (/^\s*$/.test(chars)) {
                                this.doc.appendChild(charNode)
                                //process xml
                            }
                            this.locator && position(this.locator, charNode)
                        }
                    },
                    skippedEntity: function (name) {},
                    endDocument: function () {
                        this.doc.normalize()
                    },
                    setDocumentLocator: function (locator) {
                        if ((this.locator = locator)) {
                            // && !('lineNumber' in locator)){
                            locator.lineNumber = 0
                        }
                    },
                    //LexicalHandler
                    comment: function (chars, start, length) {
                        chars = _toString.apply(this, arguments)
                        var comm = this.doc.createComment(chars)
                        this.locator && position(this.locator, comm)
                        appendElement(this, comm)
                    },

                    startCDATA: function () {
                        //used in characters() methods
                        this.cdata = true
                    },
                    endCDATA: function () {
                        this.cdata = false
                    },

                    startDTD: function (name, publicId, systemId) {
                        var impl = this.doc.implementation
                        if (impl && impl.createDocumentType) {
                            var dt = impl.createDocumentType(name, publicId, systemId)
                            this.locator && position(this.locator, dt)
                            appendElement(this, dt)
                            this.doc.doctype = dt
                        }
                    },
                    /**
                     * @see org.xml.sax.ErrorHandler
                     * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
                     */
                    warning: function (error) {
                        console.warn('[xmldom warning]\t' + error, _locator(this.locator))
                    },
                    error: function (error) {
                        console.error('[xmldom error]\t' + error, _locator(this.locator))
                    },
                    fatalError: function (error) {
                        throw new ParseError(error, this.locator)
                    }
                }

                function _locator(l) {
                    if (l) {
                        return '\n@' + (l.systemId || '') + '#[line:' + l.lineNumber + ',col:' + l.columnNumber + ']'
                    }
                }

                function _toString(chars, start, length) {
                    if (typeof chars == 'string') {
                        return chars.substr(start, length)
                    } else {
                        //java sax connect width xmldom on rhino(what about: "? && !(chars instanceof String)")
                        if (chars.length >= start + length || start) {
                            return new java.lang.String(chars, start, length) + ''
                        }
                        return chars
                    }
                }

                /*
                 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html
                 * used method of org.xml.sax.ext.LexicalHandler:
                 *  #comment(chars, start, length)
                 *  #startCDATA()
                 *  #endCDATA()
                 *  #startDTD(name, publicId, systemId)
                 *
                 *
                 * IGNORED method of org.xml.sax.ext.LexicalHandler:
                 *  #endDTD()
                 *  #startEntity(name)
                 *  #endEntity(name)
                 *
                 *
                 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html
                 * IGNORED method of org.xml.sax.ext.DeclHandler
                 * 	#attributeDecl(eName, aName, type, mode, value)
                 *  #elementDecl(name, model)
                 *  #externalEntityDecl(name, publicId, systemId)
                 *  #internalEntityDecl(name, value)
                 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
                 * IGNORED method of org.xml.sax.EntityResolver2
                 *  #resolveEntity(String name,String publicId,String baseURI,String systemId)
                 *  #resolveEntity(publicId, systemId)
                 *  #getExternalSubset(name, baseURI)
                 * @link http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
                 * IGNORED method of org.xml.sax.DTDHandler
                 *  #notationDecl(name, publicId, systemId) {};
                 *  #unparsedEntityDecl(name, publicId, systemId, notationName) {};
                 */
                'endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl'.replace(
                    /\w+/g,
                    function (key) {
                        DOMHandler.prototype[key] = function () {
                            return null
                        }
                    }
                )

                /* Private static helpers treated below as private instance methods, so don't need to add these to the public API; we might use a Relator to also get rid of non-standard public properties */
                function appendElement(hander, node) {
                    if (!hander.currentElement) {
                        hander.doc.appendChild(node)
                    } else {
                        hander.currentElement.appendChild(node)
                    }
                } //appendChild and setAttributeNS are preformance key

                exports.__DOMHandler = DOMHandler
                exports.normalizeLineEndings = normalizeLineEndings
                exports.DOMParser = DOMParser
            },
            { './conventions': 5, './dom': 7, './entities': 8, './sax': 10 }
        ],
        7: [
            function (require, module, exports) {
                var conventions = require('./conventions')

                var find = conventions.find
                var NAMESPACE = conventions.NAMESPACE

                /**
                 * A prerequisite for `[].filter`, to drop elements that are empty
                 * @param {string} input
                 * @returns {boolean}
                 */
                function notEmptyString(input) {
                    return input !== ''
                }

                /**
                 * @see https://infra.spec.whatwg.org/#split-on-ascii-whitespace
                 * @see https://infra.spec.whatwg.org/#ascii-whitespace
                 *
                 * @param {string} input
                 * @returns {string[]} (can be empty)
                 */
                function splitOnASCIIWhitespace(input) {
                    // U+0009 TAB, U+000A LF, U+000C FF, U+000D CR, U+0020 SPACE
                    return input ? input.split(/[\t\n\f\r ]+/).filter(notEmptyString) : []
                }

                /**
                 * Adds element as a key to current if it is not already present.
                 *
                 * @param {Record<string, boolean | undefined>} current
                 * @param {string} element
                 * @returns {Record<string, boolean | undefined>}
                 */
                function orderedSetReducer(current, element) {
                    if (!current.hasOwnProperty(element)) {
                        current[element] = true
                    }
                    return current
                }

                /**
                 * @see https://infra.spec.whatwg.org/#ordered-set
                 * @param {string} input
                 * @returns {string[]}
                 */
                function toOrderedSet(input) {
                    if (!input) return []
                    var list = splitOnASCIIWhitespace(input)
                    return Object.keys(list.reduce(orderedSetReducer, {}))
                }

                /**
                 * Uses `list.indexOf` to implement something like `Array.prototype.includes`,
                 * which we can not rely on being available.
                 *
                 * @param {any[]} list
                 * @returns {function(any): boolean}
                 */
                function arrayIncludes(list) {
                    return function (element) {
                        return list && list.indexOf(element) !== -1
                    }
                }

                function copy(src, dest) {
                    for (var p in src) {
                        if (Object.prototype.hasOwnProperty.call(src, p)) {
                            dest[p] = src[p]
                        }
                    }
                }

                /**
    ^\w+\.prototype\.([_\w]+)\s*=\s*((?:.*\{\s*?[\r\n][\s\S]*?^})|\S.*?(?=[;\r\n]));?
    ^\w+\.prototype\.([_\w]+)\s*=\s*(\S.*?(?=[;\r\n]));?
    */
                function _extends(Class, Super) {
                    var pt = Class.prototype
                    if (!(pt instanceof Super)) {
                        function t() {}
                        t.prototype = Super.prototype
                        t = new t()
                        copy(pt, t)
                        Class.prototype = pt = t
                    }
                    if (pt.constructor != Class) {
                        if (typeof Class != 'function') {
                            console.error('unknown Class:' + Class)
                        }
                        pt.constructor = Class
                    }
                }

                // Node Types
                var NodeType = {}
                var ELEMENT_NODE = (NodeType.ELEMENT_NODE = 1)
                var ATTRIBUTE_NODE = (NodeType.ATTRIBUTE_NODE = 2)
                var TEXT_NODE = (NodeType.TEXT_NODE = 3)
                var CDATA_SECTION_NODE = (NodeType.CDATA_SECTION_NODE = 4)
                var ENTITY_REFERENCE_NODE = (NodeType.ENTITY_REFERENCE_NODE = 5)
                var ENTITY_NODE = (NodeType.ENTITY_NODE = 6)
                var PROCESSING_INSTRUCTION_NODE = (NodeType.PROCESSING_INSTRUCTION_NODE = 7)
                var COMMENT_NODE = (NodeType.COMMENT_NODE = 8)
                var DOCUMENT_NODE = (NodeType.DOCUMENT_NODE = 9)
                var DOCUMENT_TYPE_NODE = (NodeType.DOCUMENT_TYPE_NODE = 10)
                var DOCUMENT_FRAGMENT_NODE = (NodeType.DOCUMENT_FRAGMENT_NODE = 11)
                var NOTATION_NODE = (NodeType.NOTATION_NODE = 12)

                // ExceptionCode
                var ExceptionCode = {}
                var ExceptionMessage = {}
                var INDEX_SIZE_ERR = (ExceptionCode.INDEX_SIZE_ERR = ((ExceptionMessage[1] = 'Index size error'), 1))
                var DOMSTRING_SIZE_ERR = (ExceptionCode.DOMSTRING_SIZE_ERR = ((ExceptionMessage[2] = 'DOMString size error'), 2))
                var HIERARCHY_REQUEST_ERR = (ExceptionCode.HIERARCHY_REQUEST_ERR = ((ExceptionMessage[3] = 'Hierarchy request error'), 3))
                var WRONG_DOCUMENT_ERR = (ExceptionCode.WRONG_DOCUMENT_ERR = ((ExceptionMessage[4] = 'Wrong document'), 4))
                var INVALID_CHARACTER_ERR = (ExceptionCode.INVALID_CHARACTER_ERR = ((ExceptionMessage[5] = 'Invalid character'), 5))
                var NO_DATA_ALLOWED_ERR = (ExceptionCode.NO_DATA_ALLOWED_ERR = ((ExceptionMessage[6] = 'No data allowed'), 6))
                var NO_MODIFICATION_ALLOWED_ERR = (ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = ((ExceptionMessage[7] = 'No modification allowed'), 7))
                var NOT_FOUND_ERR = (ExceptionCode.NOT_FOUND_ERR = ((ExceptionMessage[8] = 'Not found'), 8))
                var NOT_SUPPORTED_ERR = (ExceptionCode.NOT_SUPPORTED_ERR = ((ExceptionMessage[9] = 'Not supported'), 9))
                var INUSE_ATTRIBUTE_ERR = (ExceptionCode.INUSE_ATTRIBUTE_ERR = ((ExceptionMessage[10] = 'Attribute in use'), 10))
                //level2
                var INVALID_STATE_ERR = (ExceptionCode.INVALID_STATE_ERR = ((ExceptionMessage[11] = 'Invalid state'), 11))
                var SYNTAX_ERR = (ExceptionCode.SYNTAX_ERR = ((ExceptionMessage[12] = 'Syntax error'), 12))
                var INVALID_MODIFICATION_ERR = (ExceptionCode.INVALID_MODIFICATION_ERR = ((ExceptionMessage[13] = 'Invalid modification'), 13))
                var NAMESPACE_ERR = (ExceptionCode.NAMESPACE_ERR = ((ExceptionMessage[14] = 'Invalid namespace'), 14))
                var INVALID_ACCESS_ERR = (ExceptionCode.INVALID_ACCESS_ERR = ((ExceptionMessage[15] = 'Invalid access'), 15))

                /**
                 * DOM Level 2
                 * Object DOMException
                 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
                 * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
                 */
                function DOMException(code, message) {
                    if (message instanceof Error) {
                        var error = message
                    } else {
                        error = this
                        Error.call(this, ExceptionMessage[code])
                        this.message = ExceptionMessage[code]
                        if (Error.captureStackTrace) Error.captureStackTrace(this, DOMException)
                    }
                    error.code = code
                    if (message) this.message = this.message + ': ' + message
                    return error
                }
                DOMException.prototype = Error.prototype
                copy(ExceptionCode, DOMException)

                /**
                 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177
                 * The NodeList interface provides the abstraction of an ordered collection of nodes, without defining or constraining how this collection is implemented. NodeList objects in the DOM are live.
                 * The items in the NodeList are accessible via an integral index, starting from 0.
                 */
                function NodeList() {}
                NodeList.prototype = {
                    /**
                     * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
                     * @standard level1
                     */
                    length: 0,
                    /**
                     * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
                     * @standard level1
                     * @param index  unsigned long
                     *   Index into the collection.
                     * @return Node
                     *    The node at the indexth position in the NodeList, or null if that is not a valid index.
                     */
                    item: function (index) {
                        return index >= 0 && index < this.length ? this[index] : null
                    },
                    toString: function (isHTML, nodeFilter) {
                        for (var buf = [], i = 0; i < this.length; i++) {
                            serializeToString(this[i], buf, isHTML, nodeFilter)
                        }
                        return buf.join('')
                    },
                    /**
                     * @private
                     * @param {function (Node):boolean} predicate
                     * @returns {Node[]}
                     */
                    filter: function (predicate) {
                        return Array.prototype.filter.call(this, predicate)
                    },
                    /**
                     * @private
                     * @param {Node} item
                     * @returns {number}
                     */
                    indexOf: function (item) {
                        return Array.prototype.indexOf.call(this, item)
                    }
                }

                function LiveNodeList(node, refresh) {
                    this._node = node
                    this._refresh = refresh
                    _updateLiveList(this)
                }

                function _updateLiveList(list) {
                    var inc = list._node._inc || list._node.ownerDocument._inc
                    if (list._inc !== inc) {
                        var ls = list._refresh(list._node)
                        __set__(list, 'length', ls.length)
                        if (!list.$$length || ls.length < list.$$length) {
                            for (var i = ls.length; i in list; i++) {
                                if (Object.prototype.hasOwnProperty.call(list, i)) {
                                    delete list[i]
                                }
                            }
                        }
                        copy(ls, list)
                        list._inc = inc
                    }
                }

                LiveNodeList.prototype.item = function (i) {
                    _updateLiveList(this)
                    return this[i] || null
                }

                _extends(LiveNodeList, NodeList)

                /**
                 * Objects implementing the NamedNodeMap interface are used
                 * to represent collections of nodes that can be accessed by name.
                 * Note that NamedNodeMap does not inherit from NodeList;
                 * NamedNodeMaps are not maintained in any particular order.
                 * Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index,
                 * but this is simply to allow convenient enumeration of the contents of a NamedNodeMap,
                 * and does not imply that the DOM specifies an order to these Nodes.
                 * NamedNodeMap objects in the DOM are live.
                 * used for attributes or DocumentType entities
                 */
                function NamedNodeMap() {}

                function _findNodeIndex(list, node) {
                    var i = list.length
                    while (i--) {
                        if (list[i] === node) {
                            return i
                        }
                    }
                }

                function _addNamedNode(el, list, newAttr, oldAttr) {
                    if (oldAttr) {
                        list[_findNodeIndex(list, oldAttr)] = newAttr
                    } else {
                        list[list.length++] = newAttr
                    }
                    if (el) {
                        newAttr.ownerElement = el
                        var doc = el.ownerDocument
                        if (doc) {
                            oldAttr && _onRemoveAttribute(doc, el, oldAttr)
                            _onAddAttribute(doc, el, newAttr)
                        }
                    }
                }

                function _removeNamedNode(el, list, attr) {
                    //console.log('remove attr:'+attr)
                    var i = _findNodeIndex(list, attr)
                    if (i >= 0) {
                        var lastIndex = list.length - 1
                        while (i < lastIndex) {
                            list[i] = list[++i]
                        }
                        list.length = lastIndex
                        if (el) {
                            var doc = el.ownerDocument
                            if (doc) {
                                _onRemoveAttribute(doc, el, attr)
                                attr.ownerElement = null
                            }
                        }
                    } else {
                        throw new DOMException(NOT_FOUND_ERR, new Error(el.tagName + '@' + attr))
                    }
                }

                NamedNodeMap.prototype = {
                    length: 0,
                    item: NodeList.prototype.item,
                    getNamedItem: function (key) {
                        //		if(key.indexOf(':')>0 || key == 'xmlns'){
                        //			return null;
                        //		}
                        //console.log()
                        var i = this.length
                        while (i--) {
                            var attr = this[i]
                            //console.log(attr.nodeName,key)
                            if (attr.nodeName == key) {
                                return attr
                            }
                        }
                    },
                    setNamedItem: function (attr) {
                        var el = attr.ownerElement
                        if (el && el != this._ownerElement) {
                            throw new DOMException(INUSE_ATTRIBUTE_ERR)
                        }
                        var oldAttr = this.getNamedItem(attr.nodeName)
                        _addNamedNode(this._ownerElement, this, attr, oldAttr)
                        return oldAttr
                    },
                    /* returns Node */
                    setNamedItemNS: function (attr) {
                        // raises: WRONG_DOCUMENT_ERR,NO_MODIFICATION_ALLOWED_ERR,INUSE_ATTRIBUTE_ERR
                        var el = attr.ownerElement,
                            oldAttr
                        if (el && el != this._ownerElement) {
                            throw new DOMException(INUSE_ATTRIBUTE_ERR)
                        }
                        oldAttr = this.getNamedItemNS(attr.namespaceURI, attr.localName)
                        _addNamedNode(this._ownerElement, this, attr, oldAttr)
                        return oldAttr
                    },

                    /* returns Node */
                    removeNamedItem: function (key) {
                        var attr = this.getNamedItem(key)
                        _removeNamedNode(this._ownerElement, this, attr)
                        return attr
                    }, // raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR

                    //for level2
                    removeNamedItemNS: function (namespaceURI, localName) {
                        var attr = this.getNamedItemNS(namespaceURI, localName)
                        _removeNamedNode(this._ownerElement, this, attr)
                        return attr
                    },
                    getNamedItemNS: function (namespaceURI, localName) {
                        var i = this.length
                        while (i--) {
                            var node = this[i]
                            if (node.localName == localName && node.namespaceURI == namespaceURI) {
                                return node
                            }
                        }
                        return null
                    }
                }

                /**
                 * The DOMImplementation interface represents an object providing methods
                 * which are not dependent on any particular document.
                 * Such an object is returned by the `Document.implementation` property.
                 *
                 * __The individual methods describe the differences compared to the specs.__
                 *
                 * @constructor
                 *
                 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation MDN
                 * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490 DOM Level 1 Core (Initial)
                 * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-102161490 DOM Level 2 Core
                 * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-102161490 DOM Level 3 Core
                 * @see https://dom.spec.whatwg.org/#domimplementation DOM Living Standard
                 */
                function DOMImplementation() {}

                DOMImplementation.prototype = {
                    /**
                     * The DOMImplementation.hasFeature() method returns a Boolean flag indicating if a given feature is supported.
                     * The different implementations fairly diverged in what kind of features were reported.
                     * The latest version of the spec settled to force this method to always return true, where the functionality was accurate and in use.
                     *
                     * @deprecated It is deprecated and modern browsers return true in all cases.
                     *
                     * @param {string} feature
                     * @param {string} [version]
                     * @returns {boolean} always true
                     *
                     * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/hasFeature MDN
                     * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-5CED94D7 DOM Level 1 Core
                     * @see https://dom.spec.whatwg.org/#dom-domimplementation-hasfeature DOM Living Standard
                     */
                    hasFeature: function (feature, version) {
                        return true
                    },
                    /**
                     * Creates an XML Document object of the specified type with its document element.
                     *
                     * __It behaves slightly different from the description in the living standard__:
                     * - There is no interface/class `XMLDocument`, it returns a `Document` instance.
                     * - `contentType`, `encoding`, `mode`, `origin`, `url` fields are currently not declared.
                     * - this implementation is not validating names or qualified names
                     *   (when parsing XML strings, the SAX parser takes care of that)
                     *
                     * @param {string|null} namespaceURI
                     * @param {string} qualifiedName
                     * @param {DocumentType=null} doctype
                     * @returns {Document}
                     *
                     * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocument MDN
                     * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocument DOM Level 2 Core (initial)
                     * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument  DOM Level 2 Core
                     *
                     * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
                     * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
                     * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
                     */
                    createDocument: function (namespaceURI, qualifiedName, doctype) {
                        var doc = new Document()
                        doc.implementation = this
                        doc.childNodes = new NodeList()
                        doc.doctype = doctype || null
                        if (doctype) {
                            doc.appendChild(doctype)
                        }
                        if (qualifiedName) {
                            var root = doc.createElementNS(namespaceURI, qualifiedName)
                            doc.appendChild(root)
                        }
                        return doc
                    },
                    /**
                     * Returns a doctype, with the given `qualifiedName`, `publicId`, and `systemId`.
                     *
                     * __This behavior is slightly different from the in the specs__:
                     * - this implementation is not validating names or qualified names
                     *   (when parsing XML strings, the SAX parser takes care of that)
                     *
                     * @param {string} qualifiedName
                     * @param {string} [publicId]
                     * @param {string} [systemId]
                     * @returns {DocumentType} which can either be used with `DOMImplementation.createDocument` upon document creation
                     *                  or can be put into the document via methods like `Node.insertBefore()` or `Node.replaceChild()`
                     *
                     * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocumentType MDN
                     * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocType DOM Level 2 Core
                     * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocumenttype DOM Living Standard
                     *
                     * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
                     * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
                     * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
                     */
                    createDocumentType: function (qualifiedName, publicId, systemId) {
                        var node = new DocumentType()
                        node.name = qualifiedName
                        node.nodeName = qualifiedName
                        node.publicId = publicId || ''
                        node.systemId = systemId || ''

                        return node
                    }
                }

                /**
                 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247
                 */

                function Node() {}

                Node.prototype = {
                    firstChild: null,
                    lastChild: null,
                    previousSibling: null,
                    nextSibling: null,
                    attributes: null,
                    parentNode: null,
                    childNodes: null,
                    ownerDocument: null,
                    nodeValue: null,
                    namespaceURI: null,
                    prefix: null,
                    localName: null,
                    // Modified in DOM Level 2:
                    insertBefore: function (newChild, refChild) {
                        //raises
                        return _insertBefore(this, newChild, refChild)
                    },
                    replaceChild: function (newChild, oldChild) {
                        //raises
                        _insertBefore(this, newChild, oldChild, assertPreReplacementValidityInDocument)
                        if (oldChild) {
                            this.removeChild(oldChild)
                        }
                    },
                    removeChild: function (oldChild) {
                        return _removeChild(this, oldChild)
                    },
                    appendChild: function (newChild) {
                        return this.insertBefore(newChild, null)
                    },
                    hasChildNodes: function () {
                        return this.firstChild != null
                    },
                    cloneNode: function (deep) {
                        return cloneNode(this.ownerDocument || this, this, deep)
                    },
                    // Modified in DOM Level 2:
                    normalize: function () {
                        var child = this.firstChild
                        while (child) {
                            var next = child.nextSibling
                            if (next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE) {
                                this.removeChild(next)
                                child.appendData(next.data)
                            } else {
                                child.normalize()
                                child = next
                            }
                        }
                    },
                    // Introduced in DOM Level 2:
                    isSupported: function (feature, version) {
                        return this.ownerDocument.implementation.hasFeature(feature, version)
                    },
                    // Introduced in DOM Level 2:
                    hasAttributes: function () {
                        return this.attributes.length > 0
                    },
                    /**
                     * Look up the prefix associated to the given namespace URI, starting from this node.
                     * **The default namespace declarations are ignored by this method.**
                     * See Namespace Prefix Lookup for details on the algorithm used by this method.
                     *
                     * _Note: The implementation seems to be incomplete when compared to the algorithm described in the specs._
                     *
                     * @param {string | null} namespaceURI
                     * @returns {string | null}
                     * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespacePrefix
                     * @see https://www.w3.org/TR/DOM-Level-3-Core/namespaces-algorithms.html#lookupNamespacePrefixAlgo
                     * @see https://dom.spec.whatwg.org/#dom-node-lookupprefix
                     * @see https://github.com/xmldom/xmldom/issues/322
                     */
                    lookupPrefix: function (namespaceURI) {
                        var el = this
                        while (el) {
                            var map = el._nsMap
                            //console.dir(map)
                            if (map) {
                                for (var n in map) {
                                    if (Object.prototype.hasOwnProperty.call(map, n) && map[n] === namespaceURI) {
                                        return n
                                    }
                                }
                            }
                            el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode
                        }
                        return null
                    },
                    // Introduced in DOM Level 3:
                    lookupNamespaceURI: function (prefix) {
                        var el = this
                        while (el) {
                            var map = el._nsMap
                            //console.dir(map)
                            if (map) {
                                if (Object.prototype.hasOwnProperty.call(map, prefix)) {
                                    return map[prefix]
                                }
                            }
                            el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode
                        }
                        return null
                    },
                    // Introduced in DOM Level 3:
                    isDefaultNamespace: function (namespaceURI) {
                        var prefix = this.lookupPrefix(namespaceURI)
                        return prefix == null
                    }
                }

                function _xmlEncoder(c) {
                    return (c == '<' && '&lt;') || (c == '>' && '&gt;') || (c == '&' && '&amp;') || (c == '"' && '&quot;') || '&#' + c.charCodeAt() + ';'
                }

                copy(NodeType, Node)
                copy(NodeType, Node.prototype)

                /**
                 * @param callback return true for continue,false for break
                 * @return boolean true: break visit;
                 */
                function _visitNode(node, callback) {
                    if (callback(node)) {
                        return true
                    }
                    if ((node = node.firstChild)) {
                        do {
                            if (_visitNode(node, callback)) {
                                return true
                            }
                        } while ((node = node.nextSibling))
                    }
                }

                function Document() {
                    this.ownerDocument = this
                }

                function _onAddAttribute(doc, el, newAttr) {
                    doc && doc._inc++
                    var ns = newAttr.namespaceURI
                    if (ns === NAMESPACE.XMLNS) {
                        //update namespace
                        el._nsMap[newAttr.prefix ? newAttr.localName : ''] = newAttr.value
                    }
                }

                function _onRemoveAttribute(doc, el, newAttr, remove) {
                    doc && doc._inc++
                    var ns = newAttr.namespaceURI
                    if (ns === NAMESPACE.XMLNS) {
                        //update namespace
                        delete el._nsMap[newAttr.prefix ? newAttr.localName : '']
                    }
                }

                /**
                 * Updates `el.childNodes`, updating the indexed items and it's `length`.
                 * Passing `newChild` means it will be appended.
                 * Otherwise it's assumed that an item has been removed,
                 * and `el.firstNode` and it's `.nextSibling` are used
                 * to walk the current list of child nodes.
                 *
                 * @param {Document} doc
                 * @param {Node} el
                 * @param {Node} [newChild]
                 * @private
                 */
                function _onUpdateChild(doc, el, newChild) {
                    if (doc && doc._inc) {
                        doc._inc++
                        //update childNodes
                        var cs = el.childNodes
                        if (newChild) {
                            cs[cs.length++] = newChild
                        } else {
                            var child = el.firstChild
                            var i = 0
                            while (child) {
                                cs[i++] = child
                                child = child.nextSibling
                            }
                            cs.length = i
                            delete cs[cs.length]
                        }
                    }
                }

                /**
                 * Removes the connections between `parentNode` and `child`
                 * and any existing `child.previousSibling` or `child.nextSibling`.
                 *
                 * @see https://github.com/xmldom/xmldom/issues/135
                 * @see https://github.com/xmldom/xmldom/issues/145
                 *
                 * @param {Node} parentNode
                 * @param {Node} child
                 * @returns {Node} the child that was removed.
                 * @private
                 */
                function _removeChild(parentNode, child) {
                    var previous = child.previousSibling
                    var next = child.nextSibling
                    if (previous) {
                        previous.nextSibling = next
                    } else {
                        parentNode.firstChild = next
                    }
                    if (next) {
                        next.previousSibling = previous
                    } else {
                        parentNode.lastChild = previous
                    }
                    child.parentNode = null
                    child.previousSibling = null
                    child.nextSibling = null
                    _onUpdateChild(parentNode.ownerDocument, parentNode)
                    return child
                }

                /**
                 * Returns `true` if `node` can be a parent for insertion.
                 * @param {Node} node
                 * @returns {boolean}
                 */
                function hasValidParentNodeType(node) {
                    return (
                        node && (node.nodeType === Node.DOCUMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node.ELEMENT_NODE)
                    )
                }

                /**
                 * Returns `true` if `node` can be inserted according to it's `nodeType`.
                 * @param {Node} node
                 * @returns {boolean}
                 */
                function hasInsertableNodeType(node) {
                    return (
                        node &&
                        (isElementNode(node) ||
                            isTextNode(node) ||
                            isDocTypeNode(node) ||
                            node.nodeType === Node.DOCUMENT_FRAGMENT_NODE ||
                            node.nodeType === Node.COMMENT_NODE ||
                            node.nodeType === Node.PROCESSING_INSTRUCTION_NODE)
                    )
                }

                /**
                 * Returns true if `node` is a DOCTYPE node
                 * @param {Node} node
                 * @returns {boolean}
                 */
                function isDocTypeNode(node) {
                    return node && node.nodeType === Node.DOCUMENT_TYPE_NODE
                }

                /**
                 * Returns true if the node is an element
                 * @param {Node} node
                 * @returns {boolean}
                 */
                function isElementNode(node) {
                    return node && node.nodeType === Node.ELEMENT_NODE
                }

                /**
                 * Returns true if `node` is a text node
                 * @param {Node} node
                 * @returns {boolean}
                 */
                function isTextNode(node) {
                    return node && node.nodeType === Node.TEXT_NODE
                }

                /**
                 * Check if en element node can be inserted before `child`, or at the end if child is falsy,
                 * according to the presence and position of a doctype node on the same level.
                 *
                 * @param {Document} doc The document node
                 * @param {Node} child the node that would become the nextSibling if the element would be inserted
                 * @returns {boolean} `true` if an element can be inserted before child
                 * @private
                 * https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
                 */
                function isElementInsertionPossible(doc, child) {
                    var parentChildNodes = doc.childNodes || []
                    if (find(parentChildNodes, isElementNode) || isDocTypeNode(child)) {
                        return false
                    }
                    var docTypeNode = find(parentChildNodes, isDocTypeNode)
                    return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child))
                }

                /**
                 * Check if en element node can be inserted before `child`, or at the end if child is falsy,
                 * according to the presence and position of a doctype node on the same level.
                 *
                 * @param {Node} doc The document node
                 * @param {Node} child the node that would become the nextSibling if the element would be inserted
                 * @returns {boolean} `true` if an element can be inserted before child
                 * @private
                 * https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
                 */
                function isElementReplacementPossible(doc, child) {
                    var parentChildNodes = doc.childNodes || []

                    function hasElementChildThatIsNotChild(node) {
                        return isElementNode(node) && node !== child
                    }

                    if (find(parentChildNodes, hasElementChildThatIsNotChild)) {
                        return false
                    }
                    var docTypeNode = find(parentChildNodes, isDocTypeNode)
                    return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child))
                }

                /**
                 * @private
                 * Steps 1-5 of the checks before inserting and before replacing a child are the same.
                 *
                 * @param {Node} parent the parent node to insert `node` into
                 * @param {Node} node the node to insert
                 * @param {Node=} child the node that should become the `nextSibling` of `node`
                 * @returns {Node}
                 * @throws DOMException for several node combinations that would create a DOM that is not well-formed.
                 * @throws DOMException if `child` is provided but is not a child of `parent`.
                 * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
                 * @see https://dom.spec.whatwg.org/#concept-node-replace
                 */
                function assertPreInsertionValidity1to5(parent, node, child) {
                    // 1. If `parent` is not a Document, DocumentFragment, or Element node, then throw a "HierarchyRequestError" DOMException.
                    if (!hasValidParentNodeType(parent)) {
                        throw new DOMException(HIERARCHY_REQUEST_ERR, 'Unexpected parent node type ' + parent.nodeType)
                    }
                    // 2. If `node` is a host-including inclusive ancestor of `parent`, then throw a "HierarchyRequestError" DOMException.
                    // not implemented!
                    // 3. If `child` is non-null and its parent is not `parent`, then throw a "NotFoundError" DOMException.
                    if (child && child.parentNode !== parent) {
                        throw new DOMException(NOT_FOUND_ERR, 'child not in parent')
                    }
                    if (
                        // 4. If `node` is not a DocumentFragment, DocumentType, Element, or CharacterData node, then throw a "HierarchyRequestError" DOMException.
                        !hasInsertableNodeType(node) ||
                        // 5. If either `node` is a Text node and `parent` is a document,
                        // the sax parser currently adds top level text nodes, this will be fixed in 0.9.0
                        // || (node.nodeType === Node.TEXT_NODE && parent.nodeType === Node.DOCUMENT_NODE)
                        // or `node` is a doctype and `parent` is not a document, then throw a "HierarchyRequestError" DOMException.
                        (isDocTypeNode(node) && parent.nodeType !== Node.DOCUMENT_NODE)
                    ) {
                        throw new DOMException(HIERARCHY_REQUEST_ERR, 'Unexpected node type ' + node.nodeType + ' for parent node type ' + parent.nodeType)
                    }
                }

                /**
                 * @private
                 * Step 6 of the checks before inserting and before replacing a child are different.
                 *
                 * @param {Document} parent the parent node to insert `node` into
                 * @param {Node} node the node to insert
                 * @param {Node | undefined} child the node that should become the `nextSibling` of `node`
                 * @returns {Node}
                 * @throws DOMException for several node combinations that would create a DOM that is not well-formed.
                 * @throws DOMException if `child` is provided but is not a child of `parent`.
                 * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
                 * @see https://dom.spec.whatwg.org/#concept-node-replace
                 */
                function assertPreInsertionValidityInDocument(parent, node, child) {
                    var parentChildNodes = parent.childNodes || []
                    var nodeChildNodes = node.childNodes || []

                    // DocumentFragment
                    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                        var nodeChildElements = nodeChildNodes.filter(isElementNode)
                        // If node has more than one element child or has a Text node child.
                        if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
                            throw new DOMException(HIERARCHY_REQUEST_ERR, 'More than one element or text in fragment')
                        }
                        // Otherwise, if `node` has one element child and either `parent` has an element child,
                        // `child` is a doctype, or `child` is non-null and a doctype is following `child`.
                        if (nodeChildElements.length === 1 && !isElementInsertionPossible(parent, child)) {
                            throw new DOMException(HIERARCHY_REQUEST_ERR, 'Element in fragment can not be inserted before doctype')
                        }
                    }
                    // Element
                    if (isElementNode(node)) {
                        // `parent` has an element child, `child` is a doctype,
                        // or `child` is non-null and a doctype is following `child`.
                        if (!isElementInsertionPossible(parent, child)) {
                            throw new DOMException(HIERARCHY_REQUEST_ERR, 'Only one element can be added and only after doctype')
                        }
                    }
                    // DocumentType
                    if (isDocTypeNode(node)) {
                        // `parent` has a doctype child,
                        if (find(parentChildNodes, isDocTypeNode)) {
                            throw new DOMException(HIERARCHY_REQUEST_ERR, 'Only one doctype is allowed')
                        }
                        var parentElementChild = find(parentChildNodes, isElementNode)
                        // `child` is non-null and an element is preceding `child`,
                        if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
                            throw new DOMException(HIERARCHY_REQUEST_ERR, 'Doctype can only be inserted before an element')
                        }
                        // or `child` is null and `parent` has an element child.
                        if (!child && parentElementChild) {
                            throw new DOMException(HIERARCHY_REQUEST_ERR, 'Doctype can not be appended since element is present')
                        }
                    }
                }

                /**
                 * @private
                 * Step 6 of the checks before inserting and before replacing a child are different.
                 *
                 * @param {Document} parent the parent node to insert `node` into
                 * @param {Node} node the node to insert
                 * @param {Node | undefined} child the node that should become the `nextSibling` of `node`
                 * @returns {Node}
                 * @throws DOMException for several node combinations that would create a DOM that is not well-formed.
                 * @throws DOMException if `child` is provided but is not a child of `parent`.
                 * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
                 * @see https://dom.spec.whatwg.org/#concept-node-replace
                 */
                function assertPreReplacementValidityInDocument(parent, node, child) {
                    var parentChildNodes = parent.childNodes || []
                    var nodeChildNodes = node.childNodes || []

                    // DocumentFragment
                    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                        var nodeChildElements = nodeChildNodes.filter(isElementNode)
                        // If `node` has more than one element child or has a Text node child.
                        if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
                            throw new DOMException(HIERARCHY_REQUEST_ERR, 'More than one element or text in fragment')
                        }
                        // Otherwise, if `node` has one element child and either `parent` has an element child that is not `child` or a doctype is following `child`.
                        if (nodeChildElements.length === 1 && !isElementReplacementPossible(parent, child)) {
                            throw new DOMException(HIERARCHY_REQUEST_ERR, 'Element in fragment can not be inserted before doctype')
                        }
                    }
                    // Element
                    if (isElementNode(node)) {
                        // `parent` has an element child that is not `child` or a doctype is following `child`.
                        if (!isElementReplacementPossible(parent, child)) {
                            throw new DOMException(HIERARCHY_REQUEST_ERR, 'Only one element can be added and only after doctype')
                        }
                    }
                    // DocumentType
                    if (isDocTypeNode(node)) {
                        function hasDoctypeChildThatIsNotChild(node) {
                            return isDocTypeNode(node) && node !== child
                        }

                        // `parent` has a doctype child that is not `child`,
                        if (find(parentChildNodes, hasDoctypeChildThatIsNotChild)) {
                            throw new DOMException(HIERARCHY_REQUEST_ERR, 'Only one doctype is allowed')
                        }
                        var parentElementChild = find(parentChildNodes, isElementNode)
                        // or an element is preceding `child`.
                        if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
                            throw new DOMException(HIERARCHY_REQUEST_ERR, 'Doctype can only be inserted before an element')
                        }
                    }
                }

                /**
                 * @private
                 * @param {Node} parent the parent node to insert `node` into
                 * @param {Node} node the node to insert
                 * @param {Node=} child the node that should become the `nextSibling` of `node`
                 * @returns {Node}
                 * @throws DOMException for several node combinations that would create a DOM that is not well-formed.
                 * @throws DOMException if `child` is provided but is not a child of `parent`.
                 * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
                 */
                function _insertBefore(parent, node, child, _inDocumentAssertion) {
                    // To ensure pre-insertion validity of a node into a parent before a child, run these steps:
                    assertPreInsertionValidity1to5(parent, node, child)

                    // If parent is a document, and any of the statements below, switched on the interface node implements,
                    // are true, then throw a "HierarchyRequestError" DOMException.
                    if (parent.nodeType === Node.DOCUMENT_NODE) {
                        ;(_inDocumentAssertion || assertPreInsertionValidityInDocument)(parent, node, child)
                    }

                    var cp = node.parentNode
                    if (cp) {
                        cp.removeChild(node) //remove and update
                    }
                    if (node.nodeType === DOCUMENT_FRAGMENT_NODE) {
                        var newFirst = node.firstChild
                        if (newFirst == null) {
                            return node
                        }
                        var newLast = node.lastChild
                    } else {
                        newFirst = newLast = node
                    }
                    var pre = child ? child.previousSibling : parent.lastChild

                    newFirst.previousSibling = pre
                    newLast.nextSibling = child

                    if (pre) {
                        pre.nextSibling = newFirst
                    } else {
                        parent.firstChild = newFirst
                    }
                    if (child == null) {
                        parent.lastChild = newLast
                    } else {
                        child.previousSibling = newLast
                    }
                    do {
                        newFirst.parentNode = parent
                    } while (newFirst !== newLast && (newFirst = newFirst.nextSibling))
                    _onUpdateChild(parent.ownerDocument || parent, parent)
                    //console.log(parent.lastChild.nextSibling == null)
                    if (node.nodeType == DOCUMENT_FRAGMENT_NODE) {
                        node.firstChild = node.lastChild = null
                    }
                    return node
                }

                /**
                 * Appends `newChild` to `parentNode`.
                 * If `newChild` is already connected to a `parentNode` it is first removed from it.
                 *
                 * @see https://github.com/xmldom/xmldom/issues/135
                 * @see https://github.com/xmldom/xmldom/issues/145
                 * @param {Node} parentNode
                 * @param {Node} newChild
                 * @returns {Node}
                 * @private
                 */
                function _appendSingleChild(parentNode, newChild) {
                    if (newChild.parentNode) {
                        newChild.parentNode.removeChild(newChild)
                    }
                    newChild.parentNode = parentNode
                    newChild.previousSibling = parentNode.lastChild
                    newChild.nextSibling = null
                    if (newChild.previousSibling) {
                        newChild.previousSibling.nextSibling = newChild
                    } else {
                        parentNode.firstChild = newChild
                    }
                    parentNode.lastChild = newChild
                    _onUpdateChild(parentNode.ownerDocument, parentNode, newChild)
                    return newChild
                }

                Document.prototype = {
                    //implementation : null,
                    nodeName: '#document',
                    nodeType: DOCUMENT_NODE,
                    /**
                     * The DocumentType node of the document.
                     *
                     * @readonly
                     * @type DocumentType
                     */
                    doctype: null,
                    documentElement: null,
                    _inc: 1,

                    insertBefore: function (newChild, refChild) {
                        //raises
                        if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
                            var child = newChild.firstChild
                            while (child) {
                                var next = child.nextSibling
                                this.insertBefore(child, refChild)
                                child = next
                            }
                            return newChild
                        }
                        _insertBefore(this, newChild, refChild)
                        newChild.ownerDocument = this
                        if (this.documentElement === null && newChild.nodeType === ELEMENT_NODE) {
                            this.documentElement = newChild
                        }

                        return newChild
                    },
                    removeChild: function (oldChild) {
                        if (this.documentElement == oldChild) {
                            this.documentElement = null
                        }
                        return _removeChild(this, oldChild)
                    },
                    replaceChild: function (newChild, oldChild) {
                        //raises
                        _insertBefore(this, newChild, oldChild, assertPreReplacementValidityInDocument)
                        newChild.ownerDocument = this
                        if (oldChild) {
                            this.removeChild(oldChild)
                        }
                        if (isElementNode(newChild)) {
                            this.documentElement = newChild
                        }
                    },
                    // Introduced in DOM Level 2:
                    importNode: function (importedNode, deep) {
                        return importNode(this, importedNode, deep)
                    },
                    // Introduced in DOM Level 2:
                    getElementById: function (id) {
                        var rtv = null
                        _visitNode(this.documentElement, function (node) {
                            if (node.nodeType == ELEMENT_NODE) {
                                if (node.getAttribute('id') == id) {
                                    rtv = node
                                    return true
                                }
                            }
                        })
                        return rtv
                    },

                    /**
                     * The `getElementsByClassName` method of `Document` interface returns an array-like object
                     * of all child elements which have **all** of the given class name(s).
                     *
                     * Returns an empty list if `classeNames` is an empty string or only contains HTML white space characters.
                     *
                     *
                     * Warning: This is a live LiveNodeList.
                     * Changes in the DOM will reflect in the array as the changes occur.
                     * If an element selected by this array no longer qualifies for the selector,
                     * it will automatically be removed. Be aware of this for iteration purposes.
                     *
                     * @param {string} classNames is a string representing the class name(s) to match; multiple class names are separated by (ASCII-)whitespace
                     *
                     * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
                     * @see https://dom.spec.whatwg.org/#concept-getelementsbyclassname
                     */
                    getElementsByClassName: function (classNames) {
                        var classNamesSet = toOrderedSet(classNames)
                        return new LiveNodeList(this, function (base) {
                            var ls = []
                            if (classNamesSet.length > 0) {
                                _visitNode(base.documentElement, function (node) {
                                    if (node !== base && node.nodeType === ELEMENT_NODE) {
                                        var nodeClassNames = node.getAttribute('class')
                                        // can be null if the attribute does not exist
                                        if (nodeClassNames) {
                                            // before splitting and iterating just compare them for the most common case
                                            var matches = classNames === nodeClassNames
                                            if (!matches) {
                                                var nodeClassNamesSet = toOrderedSet(nodeClassNames)
                                                matches = classNamesSet.every(arrayIncludes(nodeClassNamesSet))
                                            }
                                            if (matches) {
                                                ls.push(node)
                                            }
                                        }
                                    }
                                })
                            }
                            return ls
                        })
                    },

                    //document factory method:
                    createElement: function (tagName) {
                        var node = new Element()
                        node.ownerDocument = this
                        node.nodeName = tagName
                        node.tagName = tagName
                        node.localName = tagName
                        node.childNodes = new NodeList()
                        var attrs = (node.attributes = new NamedNodeMap())
                        attrs._ownerElement = node
                        return node
                    },
                    createDocumentFragment: function () {
                        var node = new DocumentFragment()
                        node.ownerDocument = this
                        node.childNodes = new NodeList()
                        return node
                    },
                    createTextNode: function (data) {
                        var node = new Text()
                        node.ownerDocument = this
                        node.appendData(data)
                        return node
                    },
                    createComment: function (data) {
                        var node = new Comment()
                        node.ownerDocument = this
                        node.appendData(data)
                        return node
                    },
                    createCDATASection: function (data) {
                        var node = new CDATASection()
                        node.ownerDocument = this
                        node.appendData(data)
                        return node
                    },
                    createProcessingInstruction: function (target, data) {
                        var node = new ProcessingInstruction()
                        node.ownerDocument = this
                        node.tagName = node.nodeName = node.target = target
                        node.nodeValue = node.data = data
                        return node
                    },
                    createAttribute: function (name) {
                        var node = new Attr()
                        node.ownerDocument = this
                        node.name = name
                        node.nodeName = name
                        node.localName = name
                        node.specified = true
                        return node
                    },
                    createEntityReference: function (name) {
                        var node = new EntityReference()
                        node.ownerDocument = this
                        node.nodeName = name
                        return node
                    },
                    // Introduced in DOM Level 2:
                    createElementNS: function (namespaceURI, qualifiedName) {
                        var node = new Element()
                        var pl = qualifiedName.split(':')
                        var attrs = (node.attributes = new NamedNodeMap())
                        node.childNodes = new NodeList()
                        node.ownerDocument = this
                        node.nodeName = qualifiedName
                        node.tagName = qualifiedName
                        node.namespaceURI = namespaceURI
                        if (pl.length == 2) {
                            node.prefix = pl[0]
                            node.localName = pl[1]
                        } else {
                            //el.prefix = null;
                            node.localName = qualifiedName
                        }
                        attrs._ownerElement = node
                        return node
                    },
                    // Introduced in DOM Level 2:
                    createAttributeNS: function (namespaceURI, qualifiedName) {
                        var node = new Attr()
                        var pl = qualifiedName.split(':')
                        node.ownerDocument = this
                        node.nodeName = qualifiedName
                        node.name = qualifiedName
                        node.namespaceURI = namespaceURI
                        node.specified = true
                        if (pl.length == 2) {
                            node.prefix = pl[0]
                            node.localName = pl[1]
                        } else {
                            //el.prefix = null;
                            node.localName = qualifiedName
                        }
                        return node
                    }
                }
                _extends(Document, Node)

                function Element() {
                    this._nsMap = {}
                }
                Element.prototype = {
                    nodeType: ELEMENT_NODE,
                    hasAttribute: function (name) {
                        return this.getAttributeNode(name) != null
                    },
                    getAttribute: function (name) {
                        var attr = this.getAttributeNode(name)
                        return (attr && attr.value) || ''
                    },
                    getAttributeNode: function (name) {
                        return this.attributes.getNamedItem(name)
                    },
                    setAttribute: function (name, value) {
                        var attr = this.ownerDocument.createAttribute(name)
                        attr.value = attr.nodeValue = '' + value
                        this.setAttributeNode(attr)
                    },
                    removeAttribute: function (name) {
                        var attr = this.getAttributeNode(name)
                        attr && this.removeAttributeNode(attr)
                    },

                    //four real opeartion method
                    appendChild: function (newChild) {
                        if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
                            return this.insertBefore(newChild, null)
                        } else {
                            return _appendSingleChild(this, newChild)
                        }
                    },
                    setAttributeNode: function (newAttr) {
                        return this.attributes.setNamedItem(newAttr)
                    },
                    setAttributeNodeNS: function (newAttr) {
                        return this.attributes.setNamedItemNS(newAttr)
                    },
                    removeAttributeNode: function (oldAttr) {
                        //console.log(this == oldAttr.ownerElement)
                        return this.attributes.removeNamedItem(oldAttr.nodeName)
                    },
                    //get real attribute name,and remove it by removeAttributeNode
                    removeAttributeNS: function (namespaceURI, localName) {
                        var old = this.getAttributeNodeNS(namespaceURI, localName)
                        old && this.removeAttributeNode(old)
                    },

                    hasAttributeNS: function (namespaceURI, localName) {
                        return this.getAttributeNodeNS(namespaceURI, localName) != null
                    },
                    getAttributeNS: function (namespaceURI, localName) {
                        var attr = this.getAttributeNodeNS(namespaceURI, localName)
                        return (attr && attr.value) || ''
                    },
                    setAttributeNS: function (namespaceURI, qualifiedName, value) {
                        var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName)
                        attr.value = attr.nodeValue = '' + value
                        this.setAttributeNode(attr)
                    },
                    getAttributeNodeNS: function (namespaceURI, localName) {
                        return this.attributes.getNamedItemNS(namespaceURI, localName)
                    },

                    getElementsByTagName: function (tagName) {
                        return new LiveNodeList(this, function (base) {
                            var ls = []
                            _visitNode(base, function (node) {
                                if (node !== base && node.nodeType == ELEMENT_NODE && (tagName === '*' || node.tagName == tagName)) {
                                    ls.push(node)
                                }
                            })
                            return ls
                        })
                    },
                    getElementsByTagNameNS: function (namespaceURI, localName) {
                        return new LiveNodeList(this, function (base) {
                            var ls = []
                            _visitNode(base, function (node) {
                                if (
                                    node !== base &&
                                    node.nodeType === ELEMENT_NODE &&
                                    (namespaceURI === '*' || node.namespaceURI === namespaceURI) &&
                                    (localName === '*' || node.localName == localName)
                                ) {
                                    ls.push(node)
                                }
                            })
                            return ls
                        })
                    }
                }
                Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName
                Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS

                _extends(Element, Node)

                function Attr() {}
                Attr.prototype.nodeType = ATTRIBUTE_NODE
                _extends(Attr, Node)

                function CharacterData() {}
                CharacterData.prototype = {
                    data: '',
                    substringData: function (offset, count) {
                        return this.data.substring(offset, offset + count)
                    },
                    appendData: function (text) {
                        text = this.data + text
                        this.nodeValue = this.data = text
                        this.length = text.length
                    },
                    insertData: function (offset, text) {
                        this.replaceData(offset, 0, text)
                    },
                    appendChild: function (newChild) {
                        throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR])
                    },
                    deleteData: function (offset, count) {
                        this.replaceData(offset, count, '')
                    },
                    replaceData: function (offset, count, text) {
                        var start = this.data.substring(0, offset)
                        var end = this.data.substring(offset + count)
                        text = start + text + end
                        this.nodeValue = this.data = text
                        this.length = text.length
                    }
                }
                _extends(CharacterData, Node)

                function Text() {}
                Text.prototype = {
                    nodeName: '#text',
                    nodeType: TEXT_NODE,
                    splitText: function (offset) {
                        var text = this.data
                        var newText = text.substring(offset)
                        text = text.substring(0, offset)
                        this.data = this.nodeValue = text
                        this.length = text.length
                        var newNode = this.ownerDocument.createTextNode(newText)
                        if (this.parentNode) {
                            this.parentNode.insertBefore(newNode, this.nextSibling)
                        }
                        return newNode
                    }
                }
                _extends(Text, CharacterData)

                function Comment() {}
                Comment.prototype = {
                    nodeName: '#comment',
                    nodeType: COMMENT_NODE
                }
                _extends(Comment, CharacterData)

                function CDATASection() {}
                CDATASection.prototype = {
                    nodeName: '#cdata-section',
                    nodeType: CDATA_SECTION_NODE
                }
                _extends(CDATASection, CharacterData)

                function DocumentType() {}
                DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE
                _extends(DocumentType, Node)

                function Notation() {}
                Notation.prototype.nodeType = NOTATION_NODE
                _extends(Notation, Node)

                function Entity() {}
                Entity.prototype.nodeType = ENTITY_NODE
                _extends(Entity, Node)

                function EntityReference() {}
                EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE
                _extends(EntityReference, Node)

                function DocumentFragment() {}
                DocumentFragment.prototype.nodeName = '#document-fragment'
                DocumentFragment.prototype.nodeType = DOCUMENT_FRAGMENT_NODE
                _extends(DocumentFragment, Node)

                function ProcessingInstruction() {}

                ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE
                _extends(ProcessingInstruction, Node)

                function XMLSerializer() {}

                XMLSerializer.prototype.serializeToString = function (node, isHtml, nodeFilter) {
                    return nodeSerializeToString.call(node, isHtml, nodeFilter)
                }
                Node.prototype.toString = nodeSerializeToString

                function nodeSerializeToString(isHtml, nodeFilter) {
                    var buf = []
                    var refNode = (this.nodeType == 9 && this.documentElement) || this
                    var prefix = refNode.prefix
                    var uri = refNode.namespaceURI

                    if (uri && prefix == null) {
                        //console.log(prefix)
                        var prefix = refNode.lookupPrefix(uri)
                        if (prefix == null) {
                            //isHTML = true;
                            var visibleNamespaces = [
                                { namespace: uri, prefix: null }
                                //{namespace:uri,prefix:''}
                            ]
                        }
                    }
                    serializeToString(this, buf, isHtml, nodeFilter, visibleNamespaces)
                    //console.log('###',this.nodeType,uri,prefix,buf.join(''))
                    return buf.join('')
                }

                function needNamespaceDefine(node, isHTML, visibleNamespaces) {
                    var prefix = node.prefix || ''
                    var uri = node.namespaceURI
                    // According to [Namespaces in XML 1.0](https://www.w3.org/TR/REC-xml-names/#ns-using) ,
                    // and more specifically https://www.w3.org/TR/REC-xml-names/#nsc-NoPrefixUndecl :
                    // > In a namespace declaration for a prefix [...], the attribute value MUST NOT be empty.
                    // in a similar manner [Namespaces in XML 1.1](https://www.w3.org/TR/xml-names11/#ns-using)
                    // and more specifically https://www.w3.org/TR/xml-names11/#nsc-NSDeclared :
                    // > [...] Furthermore, the attribute value [...] must not be an empty string.
                    // so serializing empty namespace value like xmlns:ds="" would produce an invalid XML document.
                    if (!uri) {
                        return false
                    }
                    if ((prefix === 'xml' && uri === NAMESPACE.XML) || uri === NAMESPACE.XMLNS) {
                        return false
                    }

                    var i = visibleNamespaces.length
                    while (i--) {
                        var ns = visibleNamespaces[i]
                        // get namespace prefix
                        if (ns.prefix === prefix) {
                            return ns.namespace !== uri
                        }
                    }
                    return true
                }

                /**
                 * Well-formed constraint: No < in Attribute Values
                 * > The replacement text of any entity referred to directly or indirectly
                 * > in an attribute value must not contain a <.
                 * @see https://www.w3.org/TR/xml11/#CleanAttrVals
                 * @see https://www.w3.org/TR/xml11/#NT-AttValue
                 *
                 * Literal whitespace other than space that appear in attribute values
                 * are serialized as their entity references, so they will be preserved.
                 * (In contrast to whitespace literals in the input which are normalized to spaces)
                 * @see https://www.w3.org/TR/xml11/#AVNormalize
                 * @see https://w3c.github.io/DOM-Parsing/#serializing-an-element-s-attributes
                 */
                function addSerializedAttribute(buf, qualifiedName, value) {
                    buf.push(' ', qualifiedName, '="', value.replace(/[<>&"\t\n\r]/g, _xmlEncoder), '"')
                }

                function serializeToString(node, buf, isHTML, nodeFilter, visibleNamespaces) {
                    if (!visibleNamespaces) {
                        visibleNamespaces = []
                    }

                    if (nodeFilter) {
                        node = nodeFilter(node)
                        if (node) {
                            if (typeof node == 'string') {
                                buf.push(node)
                                return
                            }
                        } else {
                            return
                        }
                        //buf.sort.apply(attrs, attributeSorter);
                    }

                    switch (node.nodeType) {
                        case ELEMENT_NODE:
                            var attrs = node.attributes
                            var len = attrs.length
                            var child = node.firstChild
                            var nodeName = node.tagName

                            isHTML = NAMESPACE.isHTML(node.namespaceURI) || isHTML

                            var prefixedNodeName = nodeName
                            if (!isHTML && !node.prefix && node.namespaceURI) {
                                var defaultNS
                                // lookup current default ns from `xmlns` attribute
                                for (var ai = 0; ai < attrs.length; ai++) {
                                    if (attrs.item(ai).name === 'xmlns') {
                                        defaultNS = attrs.item(ai).value
                                        break
                                    }
                                }
                                if (!defaultNS) {
                                    // lookup current default ns in visibleNamespaces
                                    for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
                                        var namespace = visibleNamespaces[nsi]
                                        if (namespace.prefix === '' && namespace.namespace === node.namespaceURI) {
                                            defaultNS = namespace.namespace
                                            break
                                        }
                                    }
                                }
                                if (defaultNS !== node.namespaceURI) {
                                    for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
                                        var namespace = visibleNamespaces[nsi]
                                        if (namespace.namespace === node.namespaceURI) {
                                            if (namespace.prefix) {
                                                prefixedNodeName = namespace.prefix + ':' + nodeName
                                            }
                                            break
                                        }
                                    }
                                }
                            }

                            buf.push('<', prefixedNodeName)

                            for (var i = 0; i < len; i++) {
                                // add namespaces for attributes
                                var attr = attrs.item(i)
                                if (attr.prefix == 'xmlns') {
                                    visibleNamespaces.push({ prefix: attr.localName, namespace: attr.value })
                                } else if (attr.nodeName == 'xmlns') {
                                    visibleNamespaces.push({ prefix: '', namespace: attr.value })
                                }
                            }

                            for (var i = 0; i < len; i++) {
                                var attr = attrs.item(i)
                                if (needNamespaceDefine(attr, isHTML, visibleNamespaces)) {
                                    var prefix = attr.prefix || ''
                                    var uri = attr.namespaceURI
                                    addSerializedAttribute(buf, prefix ? 'xmlns:' + prefix : 'xmlns', uri)
                                    visibleNamespaces.push({ prefix: prefix, namespace: uri })
                                }
                                serializeToString(attr, buf, isHTML, nodeFilter, visibleNamespaces)
                            }

                            // add namespace for current node
                            if (nodeName === prefixedNodeName && needNamespaceDefine(node, isHTML, visibleNamespaces)) {
                                var prefix = node.prefix || ''
                                var uri = node.namespaceURI
                                addSerializedAttribute(buf, prefix ? 'xmlns:' + prefix : 'xmlns', uri)
                                visibleNamespaces.push({ prefix: prefix, namespace: uri })
                            }

                            if (child || (isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName))) {
                                buf.push('>')
                                //if is cdata child node
                                if (isHTML && /^script$/i.test(nodeName)) {
                                    while (child) {
                                        if (child.data) {
                                            buf.push(child.data)
                                        } else {
                                            serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice())
                                        }
                                        child = child.nextSibling
                                    }
                                } else {
                                    while (child) {
                                        serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice())
                                        child = child.nextSibling
                                    }
                                }
                                buf.push('</', prefixedNodeName, '>')
                            } else {
                                buf.push('/>')
                            }
                            // remove added visible namespaces
                            //visibleNamespaces.length = startVisibleNamespaces;
                            return
                        case DOCUMENT_NODE:
                        case DOCUMENT_FRAGMENT_NODE:
                            var child = node.firstChild
                            while (child) {
                                serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice())
                                child = child.nextSibling
                            }
                            return
                        case ATTRIBUTE_NODE:
                            return addSerializedAttribute(buf, node.name, node.value)
                        case TEXT_NODE:
                            /**
                             * The ampersand character (&) and the left angle bracket (<) must not appear in their literal form,
                             * except when used as markup delimiters, or within a comment, a processing instruction, or a CDATA section.
                             * If they are needed elsewhere, they must be escaped using either numeric character references or the strings
                             * `&amp;` and `&lt;` respectively.
                             * The right angle bracket (>) may be represented using the string " &gt; ", and must, for compatibility,
                             * be escaped using either `&gt;` or a character reference when it appears in the string `]]>` in content,
                             * when that string is not marking the end of a CDATA section.
                             *
                             * In the content of elements, character data is any string of characters
                             * which does not contain the start-delimiter of any markup
                             * and does not include the CDATA-section-close delimiter, `]]>`.
                             *
                             * @see https://www.w3.org/TR/xml/#NT-CharData
                             * @see https://w3c.github.io/DOM-Parsing/#xml-serializing-a-text-node
                             */
                            return buf.push(node.data.replace(/[<&>]/g, _xmlEncoder))
                        case CDATA_SECTION_NODE:
                            return buf.push('<![CDATA[', node.data, ']]>')
                        case COMMENT_NODE:
                            return buf.push('<!--', node.data, '-->')
                        case DOCUMENT_TYPE_NODE:
                            var pubid = node.publicId
                            var sysid = node.systemId
                            buf.push('<!DOCTYPE ', node.name)
                            if (pubid) {
                                buf.push(' PUBLIC ', pubid)
                                if (sysid && sysid != '.') {
                                    buf.push(' ', sysid)
                                }
                                buf.push('>')
                            } else if (sysid && sysid != '.') {
                                buf.push(' SYSTEM ', sysid, '>')
                            } else {
                                var sub = node.internalSubset
                                if (sub) {
                                    buf.push(' [', sub, ']')
                                }
                                buf.push('>')
                            }
                            return
                        case PROCESSING_INSTRUCTION_NODE:
                            return buf.push('<?', node.target, ' ', node.data, '?>')
                        case ENTITY_REFERENCE_NODE:
                            return buf.push('&', node.nodeName, ';')
                        //case ENTITY_NODE:
                        //case NOTATION_NODE:
                        default:
                            buf.push('??', node.nodeName)
                    }
                }

                function importNode(doc, node, deep) {
                    var node2
                    switch (node.nodeType) {
                        case ELEMENT_NODE:
                            node2 = node.cloneNode(false)
                            node2.ownerDocument = doc
                        //var attrs = node2.attributes;
                        //var len = attrs.length;
                        //for(var i=0;i<len;i++){
                        //node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
                        //}
                        case DOCUMENT_FRAGMENT_NODE:
                            break
                        case ATTRIBUTE_NODE:
                            deep = true
                            break
                        //case ENTITY_REFERENCE_NODE:
                        //case PROCESSING_INSTRUCTION_NODE:
                        ////case TEXT_NODE:
                        //case CDATA_SECTION_NODE:
                        //case COMMENT_NODE:
                        //	deep = false;
                        //	break;
                        //case DOCUMENT_NODE:
                        //case DOCUMENT_TYPE_NODE:
                        //cannot be imported.
                        //case ENTITY_NODE:
                        //case NOTATION_NODE：
                        //can not hit in level3
                        //default:throw e;
                    }
                    if (!node2) {
                        node2 = node.cloneNode(false) //false
                    }
                    node2.ownerDocument = doc
                    node2.parentNode = null
                    if (deep) {
                        var child = node.firstChild
                        while (child) {
                            node2.appendChild(importNode(doc, child, deep))
                            child = child.nextSibling
                        }
                    }
                    return node2
                }

                //
                //var _relationMap = {firstChild:1,lastChild:1,previousSibling:1,nextSibling:1,
                //					attributes:1,childNodes:1,parentNode:1,documentElement:1,doctype,};
                function cloneNode(doc, node, deep) {
                    var node2 = new node.constructor()
                    for (var n in node) {
                        if (Object.prototype.hasOwnProperty.call(node, n)) {
                            var v = node[n]
                            if (typeof v != 'object') {
                                if (v != node2[n]) {
                                    node2[n] = v
                                }
                            }
                        }
                    }
                    if (node.childNodes) {
                        node2.childNodes = new NodeList()
                    }
                    node2.ownerDocument = doc
                    switch (node2.nodeType) {
                        case ELEMENT_NODE:
                            var attrs = node.attributes
                            var attrs2 = (node2.attributes = new NamedNodeMap())
                            var len = attrs.length
                            attrs2._ownerElement = node2
                            for (var i = 0; i < len; i++) {
                                node2.setAttributeNode(cloneNode(doc, attrs.item(i), true))
                            }
                            break
                        case ATTRIBUTE_NODE:
                            deep = true
                    }
                    if (deep) {
                        var child = node.firstChild
                        while (child) {
                            node2.appendChild(cloneNode(doc, child, deep))
                            child = child.nextSibling
                        }
                    }
                    return node2
                }

                function __set__(object, key, value) {
                    object[key] = value
                }

                //do dynamic
                try {
                    if (Object.defineProperty) {
                        Object.defineProperty(LiveNodeList.prototype, 'length', {
                            get: function () {
                                _updateLiveList(this)
                                return this.$$length
                            }
                        })

                        Object.defineProperty(Node.prototype, 'textContent', {
                            get: function () {
                                return getTextContent(this)
                            },

                            set: function (data) {
                                switch (this.nodeType) {
                                    case ELEMENT_NODE:
                                    case DOCUMENT_FRAGMENT_NODE:
                                        while (this.firstChild) {
                                            this.removeChild(this.firstChild)
                                        }
                                        if (data || String(data)) {
                                            this.appendChild(this.ownerDocument.createTextNode(data))
                                        }
                                        break

                                    default:
                                        this.data = data
                                        this.value = data
                                        this.nodeValue = data
                                }
                            }
                        })

                        function getTextContent(node) {
                            switch (node.nodeType) {
                                case ELEMENT_NODE:
                                case DOCUMENT_FRAGMENT_NODE:
                                    var buf = []
                                    node = node.firstChild
                                    while (node) {
                                        if (node.nodeType !== 7 && node.nodeType !== 8) {
                                            buf.push(getTextContent(node))
                                        }
                                        node = node.nextSibling
                                    }
                                    return buf.join('')
                                default:
                                    return node.nodeValue
                            }
                        }

                        __set__ = function (object, key, value) {
                            //console.log(value)
                            object['$$' + key] = value
                        }
                    }
                } catch (e) {
                    //ie8
                }

                //if(typeof require == 'function'){
                exports.DocumentType = DocumentType
                exports.DOMException = DOMException
                exports.DOMImplementation = DOMImplementation
                exports.Element = Element
                exports.Node = Node
                exports.NodeList = NodeList
                exports.XMLSerializer = XMLSerializer
                //}
            },
            { './conventions': 5 }
        ],
        8: [
            function (require, module, exports) {
                'use strict'

                var freeze = require('./conventions').freeze

                /**
                 * The entities that are predefined in every XML document.
                 *
                 * @see https://www.w3.org/TR/2006/REC-xml11-20060816/#sec-predefined-ent W3C XML 1.1
                 * @see https://www.w3.org/TR/2008/REC-xml-20081126/#sec-predefined-ent W3C XML 1.0
                 * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Predefined_entities_in_XML Wikipedia
                 */
                exports.XML_ENTITIES = freeze({
                    amp: '&',
                    apos: "'",
                    gt: '>',
                    lt: '<',
                    quot: '"'
                })

                /**
                 * A map of all entities that are detected in an HTML document.
                 * They contain all entries from `XML_ENTITIES`.
                 *
                 * @see XML_ENTITIES
                 * @see DOMParser.parseFromString
                 * @see DOMImplementation.prototype.createHTMLDocument
                 * @see https://html.spec.whatwg.org/#named-character-references WHATWG HTML(5) Spec
                 * @see https://html.spec.whatwg.org/entities.json JSON
                 * @see https://www.w3.org/TR/xml-entity-names/ W3C XML Entity Names
                 * @see https://www.w3.org/TR/html4/sgml/entities.html W3C HTML4/SGML
                 * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Character_entity_references_in_HTML Wikipedia (HTML)
                 * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Entities_representing_special_characters_in_XHTML Wikpedia (XHTML)
                 */
                exports.HTML_ENTITIES = freeze({
                    Aacute: '\u00C1',
                    aacute: '\u00E1',
                    Abreve: '\u0102',
                    abreve: '\u0103',
                    ac: '\u223E',
                    acd: '\u223F',
                    acE: '\u223E\u0333',
                    Acirc: '\u00C2',
                    acirc: '\u00E2',
                    acute: '\u00B4',
                    Acy: '\u0410',
                    acy: '\u0430',
                    AElig: '\u00C6',
                    aelig: '\u00E6',
                    af: '\u2061',
                    Afr: '\uD835\uDD04',
                    afr: '\uD835\uDD1E',
                    Agrave: '\u00C0',
                    agrave: '\u00E0',
                    alefsym: '\u2135',
                    aleph: '\u2135',
                    Alpha: '\u0391',
                    alpha: '\u03B1',
                    Amacr: '\u0100',
                    amacr: '\u0101',
                    amalg: '\u2A3F',
                    AMP: '\u0026',
                    amp: '\u0026',
                    And: '\u2A53',
                    and: '\u2227',
                    andand: '\u2A55',
                    andd: '\u2A5C',
                    andslope: '\u2A58',
                    andv: '\u2A5A',
                    ang: '\u2220',
                    ange: '\u29A4',
                    angle: '\u2220',
                    angmsd: '\u2221',
                    angmsdaa: '\u29A8',
                    angmsdab: '\u29A9',
                    angmsdac: '\u29AA',
                    angmsdad: '\u29AB',
                    angmsdae: '\u29AC',
                    angmsdaf: '\u29AD',
                    angmsdag: '\u29AE',
                    angmsdah: '\u29AF',
                    angrt: '\u221F',
                    angrtvb: '\u22BE',
                    angrtvbd: '\u299D',
                    angsph: '\u2222',
                    angst: '\u00C5',
                    angzarr: '\u237C',
                    Aogon: '\u0104',
                    aogon: '\u0105',
                    Aopf: '\uD835\uDD38',
                    aopf: '\uD835\uDD52',
                    ap: '\u2248',
                    apacir: '\u2A6F',
                    apE: '\u2A70',
                    ape: '\u224A',
                    apid: '\u224B',
                    apos: '\u0027',
                    ApplyFunction: '\u2061',
                    approx: '\u2248',
                    approxeq: '\u224A',
                    Aring: '\u00C5',
                    aring: '\u00E5',
                    Ascr: '\uD835\uDC9C',
                    ascr: '\uD835\uDCB6',
                    Assign: '\u2254',
                    ast: '\u002A',
                    asymp: '\u2248',
                    asympeq: '\u224D',
                    Atilde: '\u00C3',
                    atilde: '\u00E3',
                    Auml: '\u00C4',
                    auml: '\u00E4',
                    awconint: '\u2233',
                    awint: '\u2A11',
                    backcong: '\u224C',
                    backepsilon: '\u03F6',
                    backprime: '\u2035',
                    backsim: '\u223D',
                    backsimeq: '\u22CD',
                    Backslash: '\u2216',
                    Barv: '\u2AE7',
                    barvee: '\u22BD',
                    Barwed: '\u2306',
                    barwed: '\u2305',
                    barwedge: '\u2305',
                    bbrk: '\u23B5',
                    bbrktbrk: '\u23B6',
                    bcong: '\u224C',
                    Bcy: '\u0411',
                    bcy: '\u0431',
                    bdquo: '\u201E',
                    becaus: '\u2235',
                    Because: '\u2235',
                    because: '\u2235',
                    bemptyv: '\u29B0',
                    bepsi: '\u03F6',
                    bernou: '\u212C',
                    Bernoullis: '\u212C',
                    Beta: '\u0392',
                    beta: '\u03B2',
                    beth: '\u2136',
                    between: '\u226C',
                    Bfr: '\uD835\uDD05',
                    bfr: '\uD835\uDD1F',
                    bigcap: '\u22C2',
                    bigcirc: '\u25EF',
                    bigcup: '\u22C3',
                    bigodot: '\u2A00',
                    bigoplus: '\u2A01',
                    bigotimes: '\u2A02',
                    bigsqcup: '\u2A06',
                    bigstar: '\u2605',
                    bigtriangledown: '\u25BD',
                    bigtriangleup: '\u25B3',
                    biguplus: '\u2A04',
                    bigvee: '\u22C1',
                    bigwedge: '\u22C0',
                    bkarow: '\u290D',
                    blacklozenge: '\u29EB',
                    blacksquare: '\u25AA',
                    blacktriangle: '\u25B4',
                    blacktriangledown: '\u25BE',
                    blacktriangleleft: '\u25C2',
                    blacktriangleright: '\u25B8',
                    blank: '\u2423',
                    blk12: '\u2592',
                    blk14: '\u2591',
                    blk34: '\u2593',
                    block: '\u2588',
                    bne: '\u003D\u20E5',
                    bnequiv: '\u2261\u20E5',
                    bNot: '\u2AED',
                    bnot: '\u2310',
                    Bopf: '\uD835\uDD39',
                    bopf: '\uD835\uDD53',
                    bot: '\u22A5',
                    bottom: '\u22A5',
                    bowtie: '\u22C8',
                    boxbox: '\u29C9',
                    boxDL: '\u2557',
                    boxDl: '\u2556',
                    boxdL: '\u2555',
                    boxdl: '\u2510',
                    boxDR: '\u2554',
                    boxDr: '\u2553',
                    boxdR: '\u2552',
                    boxdr: '\u250C',
                    boxH: '\u2550',
                    boxh: '\u2500',
                    boxHD: '\u2566',
                    boxHd: '\u2564',
                    boxhD: '\u2565',
                    boxhd: '\u252C',
                    boxHU: '\u2569',
                    boxHu: '\u2567',
                    boxhU: '\u2568',
                    boxhu: '\u2534',
                    boxminus: '\u229F',
                    boxplus: '\u229E',
                    boxtimes: '\u22A0',
                    boxUL: '\u255D',
                    boxUl: '\u255C',
                    boxuL: '\u255B',
                    boxul: '\u2518',
                    boxUR: '\u255A',
                    boxUr: '\u2559',
                    boxuR: '\u2558',
                    boxur: '\u2514',
                    boxV: '\u2551',
                    boxv: '\u2502',
                    boxVH: '\u256C',
                    boxVh: '\u256B',
                    boxvH: '\u256A',
                    boxvh: '\u253C',
                    boxVL: '\u2563',
                    boxVl: '\u2562',
                    boxvL: '\u2561',
                    boxvl: '\u2524',
                    boxVR: '\u2560',
                    boxVr: '\u255F',
                    boxvR: '\u255E',
                    boxvr: '\u251C',
                    bprime: '\u2035',
                    Breve: '\u02D8',
                    breve: '\u02D8',
                    brvbar: '\u00A6',
                    Bscr: '\u212C',
                    bscr: '\uD835\uDCB7',
                    bsemi: '\u204F',
                    bsim: '\u223D',
                    bsime: '\u22CD',
                    bsol: '\u005C',
                    bsolb: '\u29C5',
                    bsolhsub: '\u27C8',
                    bull: '\u2022',
                    bullet: '\u2022',
                    bump: '\u224E',
                    bumpE: '\u2AAE',
                    bumpe: '\u224F',
                    Bumpeq: '\u224E',
                    bumpeq: '\u224F',
                    Cacute: '\u0106',
                    cacute: '\u0107',
                    Cap: '\u22D2',
                    cap: '\u2229',
                    capand: '\u2A44',
                    capbrcup: '\u2A49',
                    capcap: '\u2A4B',
                    capcup: '\u2A47',
                    capdot: '\u2A40',
                    CapitalDifferentialD: '\u2145',
                    caps: '\u2229\uFE00',
                    caret: '\u2041',
                    caron: '\u02C7',
                    Cayleys: '\u212D',
                    ccaps: '\u2A4D',
                    Ccaron: '\u010C',
                    ccaron: '\u010D',
                    Ccedil: '\u00C7',
                    ccedil: '\u00E7',
                    Ccirc: '\u0108',
                    ccirc: '\u0109',
                    Cconint: '\u2230',
                    ccups: '\u2A4C',
                    ccupssm: '\u2A50',
                    Cdot: '\u010A',
                    cdot: '\u010B',
                    cedil: '\u00B8',
                    Cedilla: '\u00B8',
                    cemptyv: '\u29B2',
                    cent: '\u00A2',
                    CenterDot: '\u00B7',
                    centerdot: '\u00B7',
                    Cfr: '\u212D',
                    cfr: '\uD835\uDD20',
                    CHcy: '\u0427',
                    chcy: '\u0447',
                    check: '\u2713',
                    checkmark: '\u2713',
                    Chi: '\u03A7',
                    chi: '\u03C7',
                    cir: '\u25CB',
                    circ: '\u02C6',
                    circeq: '\u2257',
                    circlearrowleft: '\u21BA',
                    circlearrowright: '\u21BB',
                    circledast: '\u229B',
                    circledcirc: '\u229A',
                    circleddash: '\u229D',
                    CircleDot: '\u2299',
                    circledR: '\u00AE',
                    circledS: '\u24C8',
                    CircleMinus: '\u2296',
                    CirclePlus: '\u2295',
                    CircleTimes: '\u2297',
                    cirE: '\u29C3',
                    cire: '\u2257',
                    cirfnint: '\u2A10',
                    cirmid: '\u2AEF',
                    cirscir: '\u29C2',
                    ClockwiseContourIntegral: '\u2232',
                    CloseCurlyDoubleQuote: '\u201D',
                    CloseCurlyQuote: '\u2019',
                    clubs: '\u2663',
                    clubsuit: '\u2663',
                    Colon: '\u2237',
                    colon: '\u003A',
                    Colone: '\u2A74',
                    colone: '\u2254',
                    coloneq: '\u2254',
                    comma: '\u002C',
                    commat: '\u0040',
                    comp: '\u2201',
                    compfn: '\u2218',
                    complement: '\u2201',
                    complexes: '\u2102',
                    cong: '\u2245',
                    congdot: '\u2A6D',
                    Congruent: '\u2261',
                    Conint: '\u222F',
                    conint: '\u222E',
                    ContourIntegral: '\u222E',
                    Copf: '\u2102',
                    copf: '\uD835\uDD54',
                    coprod: '\u2210',
                    Coproduct: '\u2210',
                    COPY: '\u00A9',
                    copy: '\u00A9',
                    copysr: '\u2117',
                    CounterClockwiseContourIntegral: '\u2233',
                    crarr: '\u21B5',
                    Cross: '\u2A2F',
                    cross: '\u2717',
                    Cscr: '\uD835\uDC9E',
                    cscr: '\uD835\uDCB8',
                    csub: '\u2ACF',
                    csube: '\u2AD1',
                    csup: '\u2AD0',
                    csupe: '\u2AD2',
                    ctdot: '\u22EF',
                    cudarrl: '\u2938',
                    cudarrr: '\u2935',
                    cuepr: '\u22DE',
                    cuesc: '\u22DF',
                    cularr: '\u21B6',
                    cularrp: '\u293D',
                    Cup: '\u22D3',
                    cup: '\u222A',
                    cupbrcap: '\u2A48',
                    CupCap: '\u224D',
                    cupcap: '\u2A46',
                    cupcup: '\u2A4A',
                    cupdot: '\u228D',
                    cupor: '\u2A45',
                    cups: '\u222A\uFE00',
                    curarr: '\u21B7',
                    curarrm: '\u293C',
                    curlyeqprec: '\u22DE',
                    curlyeqsucc: '\u22DF',
                    curlyvee: '\u22CE',
                    curlywedge: '\u22CF',
                    curren: '\u00A4',
                    curvearrowleft: '\u21B6',
                    curvearrowright: '\u21B7',
                    cuvee: '\u22CE',
                    cuwed: '\u22CF',
                    cwconint: '\u2232',
                    cwint: '\u2231',
                    cylcty: '\u232D',
                    Dagger: '\u2021',
                    dagger: '\u2020',
                    daleth: '\u2138',
                    Darr: '\u21A1',
                    dArr: '\u21D3',
                    darr: '\u2193',
                    dash: '\u2010',
                    Dashv: '\u2AE4',
                    dashv: '\u22A3',
                    dbkarow: '\u290F',
                    dblac: '\u02DD',
                    Dcaron: '\u010E',
                    dcaron: '\u010F',
                    Dcy: '\u0414',
                    dcy: '\u0434',
                    DD: '\u2145',
                    dd: '\u2146',
                    ddagger: '\u2021',
                    ddarr: '\u21CA',
                    DDotrahd: '\u2911',
                    ddotseq: '\u2A77',
                    deg: '\u00B0',
                    Del: '\u2207',
                    Delta: '\u0394',
                    delta: '\u03B4',
                    demptyv: '\u29B1',
                    dfisht: '\u297F',
                    Dfr: '\uD835\uDD07',
                    dfr: '\uD835\uDD21',
                    dHar: '\u2965',
                    dharl: '\u21C3',
                    dharr: '\u21C2',
                    DiacriticalAcute: '\u00B4',
                    DiacriticalDot: '\u02D9',
                    DiacriticalDoubleAcute: '\u02DD',
                    DiacriticalGrave: '\u0060',
                    DiacriticalTilde: '\u02DC',
                    diam: '\u22C4',
                    Diamond: '\u22C4',
                    diamond: '\u22C4',
                    diamondsuit: '\u2666',
                    diams: '\u2666',
                    die: '\u00A8',
                    DifferentialD: '\u2146',
                    digamma: '\u03DD',
                    disin: '\u22F2',
                    div: '\u00F7',
                    divide: '\u00F7',
                    divideontimes: '\u22C7',
                    divonx: '\u22C7',
                    DJcy: '\u0402',
                    djcy: '\u0452',
                    dlcorn: '\u231E',
                    dlcrop: '\u230D',
                    dollar: '\u0024',
                    Dopf: '\uD835\uDD3B',
                    dopf: '\uD835\uDD55',
                    Dot: '\u00A8',
                    dot: '\u02D9',
                    DotDot: '\u20DC',
                    doteq: '\u2250',
                    doteqdot: '\u2251',
                    DotEqual: '\u2250',
                    dotminus: '\u2238',
                    dotplus: '\u2214',
                    dotsquare: '\u22A1',
                    doublebarwedge: '\u2306',
                    DoubleContourIntegral: '\u222F',
                    DoubleDot: '\u00A8',
                    DoubleDownArrow: '\u21D3',
                    DoubleLeftArrow: '\u21D0',
                    DoubleLeftRightArrow: '\u21D4',
                    DoubleLeftTee: '\u2AE4',
                    DoubleLongLeftArrow: '\u27F8',
                    DoubleLongLeftRightArrow: '\u27FA',
                    DoubleLongRightArrow: '\u27F9',
                    DoubleRightArrow: '\u21D2',
                    DoubleRightTee: '\u22A8',
                    DoubleUpArrow: '\u21D1',
                    DoubleUpDownArrow: '\u21D5',
                    DoubleVerticalBar: '\u2225',
                    DownArrow: '\u2193',
                    Downarrow: '\u21D3',
                    downarrow: '\u2193',
                    DownArrowBar: '\u2913',
                    DownArrowUpArrow: '\u21F5',
                    DownBreve: '\u0311',
                    downdownarrows: '\u21CA',
                    downharpoonleft: '\u21C3',
                    downharpoonright: '\u21C2',
                    DownLeftRightVector: '\u2950',
                    DownLeftTeeVector: '\u295E',
                    DownLeftVector: '\u21BD',
                    DownLeftVectorBar: '\u2956',
                    DownRightTeeVector: '\u295F',
                    DownRightVector: '\u21C1',
                    DownRightVectorBar: '\u2957',
                    DownTee: '\u22A4',
                    DownTeeArrow: '\u21A7',
                    drbkarow: '\u2910',
                    drcorn: '\u231F',
                    drcrop: '\u230C',
                    Dscr: '\uD835\uDC9F',
                    dscr: '\uD835\uDCB9',
                    DScy: '\u0405',
                    dscy: '\u0455',
                    dsol: '\u29F6',
                    Dstrok: '\u0110',
                    dstrok: '\u0111',
                    dtdot: '\u22F1',
                    dtri: '\u25BF',
                    dtrif: '\u25BE',
                    duarr: '\u21F5',
                    duhar: '\u296F',
                    dwangle: '\u29A6',
                    DZcy: '\u040F',
                    dzcy: '\u045F',
                    dzigrarr: '\u27FF',
                    Eacute: '\u00C9',
                    eacute: '\u00E9',
                    easter: '\u2A6E',
                    Ecaron: '\u011A',
                    ecaron: '\u011B',
                    ecir: '\u2256',
                    Ecirc: '\u00CA',
                    ecirc: '\u00EA',
                    ecolon: '\u2255',
                    Ecy: '\u042D',
                    ecy: '\u044D',
                    eDDot: '\u2A77',
                    Edot: '\u0116',
                    eDot: '\u2251',
                    edot: '\u0117',
                    ee: '\u2147',
                    efDot: '\u2252',
                    Efr: '\uD835\uDD08',
                    efr: '\uD835\uDD22',
                    eg: '\u2A9A',
                    Egrave: '\u00C8',
                    egrave: '\u00E8',
                    egs: '\u2A96',
                    egsdot: '\u2A98',
                    el: '\u2A99',
                    Element: '\u2208',
                    elinters: '\u23E7',
                    ell: '\u2113',
                    els: '\u2A95',
                    elsdot: '\u2A97',
                    Emacr: '\u0112',
                    emacr: '\u0113',
                    empty: '\u2205',
                    emptyset: '\u2205',
                    EmptySmallSquare: '\u25FB',
                    emptyv: '\u2205',
                    EmptyVerySmallSquare: '\u25AB',
                    emsp: '\u2003',
                    emsp13: '\u2004',
                    emsp14: '\u2005',
                    ENG: '\u014A',
                    eng: '\u014B',
                    ensp: '\u2002',
                    Eogon: '\u0118',
                    eogon: '\u0119',
                    Eopf: '\uD835\uDD3C',
                    eopf: '\uD835\uDD56',
                    epar: '\u22D5',
                    eparsl: '\u29E3',
                    eplus: '\u2A71',
                    epsi: '\u03B5',
                    Epsilon: '\u0395',
                    epsilon: '\u03B5',
                    epsiv: '\u03F5',
                    eqcirc: '\u2256',
                    eqcolon: '\u2255',
                    eqsim: '\u2242',
                    eqslantgtr: '\u2A96',
                    eqslantless: '\u2A95',
                    Equal: '\u2A75',
                    equals: '\u003D',
                    EqualTilde: '\u2242',
                    equest: '\u225F',
                    Equilibrium: '\u21CC',
                    equiv: '\u2261',
                    equivDD: '\u2A78',
                    eqvparsl: '\u29E5',
                    erarr: '\u2971',
                    erDot: '\u2253',
                    Escr: '\u2130',
                    escr: '\u212F',
                    esdot: '\u2250',
                    Esim: '\u2A73',
                    esim: '\u2242',
                    Eta: '\u0397',
                    eta: '\u03B7',
                    ETH: '\u00D0',
                    eth: '\u00F0',
                    Euml: '\u00CB',
                    euml: '\u00EB',
                    euro: '\u20AC',
                    excl: '\u0021',
                    exist: '\u2203',
                    Exists: '\u2203',
                    expectation: '\u2130',
                    ExponentialE: '\u2147',
                    exponentiale: '\u2147',
                    fallingdotseq: '\u2252',
                    Fcy: '\u0424',
                    fcy: '\u0444',
                    female: '\u2640',
                    ffilig: '\uFB03',
                    fflig: '\uFB00',
                    ffllig: '\uFB04',
                    Ffr: '\uD835\uDD09',
                    ffr: '\uD835\uDD23',
                    filig: '\uFB01',
                    FilledSmallSquare: '\u25FC',
                    FilledVerySmallSquare: '\u25AA',
                    fjlig: '\u0066\u006A',
                    flat: '\u266D',
                    fllig: '\uFB02',
                    fltns: '\u25B1',
                    fnof: '\u0192',
                    Fopf: '\uD835\uDD3D',
                    fopf: '\uD835\uDD57',
                    ForAll: '\u2200',
                    forall: '\u2200',
                    fork: '\u22D4',
                    forkv: '\u2AD9',
                    Fouriertrf: '\u2131',
                    fpartint: '\u2A0D',
                    frac12: '\u00BD',
                    frac13: '\u2153',
                    frac14: '\u00BC',
                    frac15: '\u2155',
                    frac16: '\u2159',
                    frac18: '\u215B',
                    frac23: '\u2154',
                    frac25: '\u2156',
                    frac34: '\u00BE',
                    frac35: '\u2157',
                    frac38: '\u215C',
                    frac45: '\u2158',
                    frac56: '\u215A',
                    frac58: '\u215D',
                    frac78: '\u215E',
                    frasl: '\u2044',
                    frown: '\u2322',
                    Fscr: '\u2131',
                    fscr: '\uD835\uDCBB',
                    gacute: '\u01F5',
                    Gamma: '\u0393',
                    gamma: '\u03B3',
                    Gammad: '\u03DC',
                    gammad: '\u03DD',
                    gap: '\u2A86',
                    Gbreve: '\u011E',
                    gbreve: '\u011F',
                    Gcedil: '\u0122',
                    Gcirc: '\u011C',
                    gcirc: '\u011D',
                    Gcy: '\u0413',
                    gcy: '\u0433',
                    Gdot: '\u0120',
                    gdot: '\u0121',
                    gE: '\u2267',
                    ge: '\u2265',
                    gEl: '\u2A8C',
                    gel: '\u22DB',
                    geq: '\u2265',
                    geqq: '\u2267',
                    geqslant: '\u2A7E',
                    ges: '\u2A7E',
                    gescc: '\u2AA9',
                    gesdot: '\u2A80',
                    gesdoto: '\u2A82',
                    gesdotol: '\u2A84',
                    gesl: '\u22DB\uFE00',
                    gesles: '\u2A94',
                    Gfr: '\uD835\uDD0A',
                    gfr: '\uD835\uDD24',
                    Gg: '\u22D9',
                    gg: '\u226B',
                    ggg: '\u22D9',
                    gimel: '\u2137',
                    GJcy: '\u0403',
                    gjcy: '\u0453',
                    gl: '\u2277',
                    gla: '\u2AA5',
                    glE: '\u2A92',
                    glj: '\u2AA4',
                    gnap: '\u2A8A',
                    gnapprox: '\u2A8A',
                    gnE: '\u2269',
                    gne: '\u2A88',
                    gneq: '\u2A88',
                    gneqq: '\u2269',
                    gnsim: '\u22E7',
                    Gopf: '\uD835\uDD3E',
                    gopf: '\uD835\uDD58',
                    grave: '\u0060',
                    GreaterEqual: '\u2265',
                    GreaterEqualLess: '\u22DB',
                    GreaterFullEqual: '\u2267',
                    GreaterGreater: '\u2AA2',
                    GreaterLess: '\u2277',
                    GreaterSlantEqual: '\u2A7E',
                    GreaterTilde: '\u2273',
                    Gscr: '\uD835\uDCA2',
                    gscr: '\u210A',
                    gsim: '\u2273',
                    gsime: '\u2A8E',
                    gsiml: '\u2A90',
                    Gt: '\u226B',
                    GT: '\u003E',
                    gt: '\u003E',
                    gtcc: '\u2AA7',
                    gtcir: '\u2A7A',
                    gtdot: '\u22D7',
                    gtlPar: '\u2995',
                    gtquest: '\u2A7C',
                    gtrapprox: '\u2A86',
                    gtrarr: '\u2978',
                    gtrdot: '\u22D7',
                    gtreqless: '\u22DB',
                    gtreqqless: '\u2A8C',
                    gtrless: '\u2277',
                    gtrsim: '\u2273',
                    gvertneqq: '\u2269\uFE00',
                    gvnE: '\u2269\uFE00',
                    Hacek: '\u02C7',
                    hairsp: '\u200A',
                    half: '\u00BD',
                    hamilt: '\u210B',
                    HARDcy: '\u042A',
                    hardcy: '\u044A',
                    hArr: '\u21D4',
                    harr: '\u2194',
                    harrcir: '\u2948',
                    harrw: '\u21AD',
                    Hat: '\u005E',
                    hbar: '\u210F',
                    Hcirc: '\u0124',
                    hcirc: '\u0125',
                    hearts: '\u2665',
                    heartsuit: '\u2665',
                    hellip: '\u2026',
                    hercon: '\u22B9',
                    Hfr: '\u210C',
                    hfr: '\uD835\uDD25',
                    HilbertSpace: '\u210B',
                    hksearow: '\u2925',
                    hkswarow: '\u2926',
                    hoarr: '\u21FF',
                    homtht: '\u223B',
                    hookleftarrow: '\u21A9',
                    hookrightarrow: '\u21AA',
                    Hopf: '\u210D',
                    hopf: '\uD835\uDD59',
                    horbar: '\u2015',
                    HorizontalLine: '\u2500',
                    Hscr: '\u210B',
                    hscr: '\uD835\uDCBD',
                    hslash: '\u210F',
                    Hstrok: '\u0126',
                    hstrok: '\u0127',
                    HumpDownHump: '\u224E',
                    HumpEqual: '\u224F',
                    hybull: '\u2043',
                    hyphen: '\u2010',
                    Iacute: '\u00CD',
                    iacute: '\u00ED',
                    ic: '\u2063',
                    Icirc: '\u00CE',
                    icirc: '\u00EE',
                    Icy: '\u0418',
                    icy: '\u0438',
                    Idot: '\u0130',
                    IEcy: '\u0415',
                    iecy: '\u0435',
                    iexcl: '\u00A1',
                    iff: '\u21D4',
                    Ifr: '\u2111',
                    ifr: '\uD835\uDD26',
                    Igrave: '\u00CC',
                    igrave: '\u00EC',
                    ii: '\u2148',
                    iiiint: '\u2A0C',
                    iiint: '\u222D',
                    iinfin: '\u29DC',
                    iiota: '\u2129',
                    IJlig: '\u0132',
                    ijlig: '\u0133',
                    Im: '\u2111',
                    Imacr: '\u012A',
                    imacr: '\u012B',
                    image: '\u2111',
                    ImaginaryI: '\u2148',
                    imagline: '\u2110',
                    imagpart: '\u2111',
                    imath: '\u0131',
                    imof: '\u22B7',
                    imped: '\u01B5',
                    Implies: '\u21D2',
                    in: '\u2208',
                    incare: '\u2105',
                    infin: '\u221E',
                    infintie: '\u29DD',
                    inodot: '\u0131',
                    Int: '\u222C',
                    int: '\u222B',
                    intcal: '\u22BA',
                    integers: '\u2124',
                    Integral: '\u222B',
                    intercal: '\u22BA',
                    Intersection: '\u22C2',
                    intlarhk: '\u2A17',
                    intprod: '\u2A3C',
                    InvisibleComma: '\u2063',
                    InvisibleTimes: '\u2062',
                    IOcy: '\u0401',
                    iocy: '\u0451',
                    Iogon: '\u012E',
                    iogon: '\u012F',
                    Iopf: '\uD835\uDD40',
                    iopf: '\uD835\uDD5A',
                    Iota: '\u0399',
                    iota: '\u03B9',
                    iprod: '\u2A3C',
                    iquest: '\u00BF',
                    Iscr: '\u2110',
                    iscr: '\uD835\uDCBE',
                    isin: '\u2208',
                    isindot: '\u22F5',
                    isinE: '\u22F9',
                    isins: '\u22F4',
                    isinsv: '\u22F3',
                    isinv: '\u2208',
                    it: '\u2062',
                    Itilde: '\u0128',
                    itilde: '\u0129',
                    Iukcy: '\u0406',
                    iukcy: '\u0456',
                    Iuml: '\u00CF',
                    iuml: '\u00EF',
                    Jcirc: '\u0134',
                    jcirc: '\u0135',
                    Jcy: '\u0419',
                    jcy: '\u0439',
                    Jfr: '\uD835\uDD0D',
                    jfr: '\uD835\uDD27',
                    jmath: '\u0237',
                    Jopf: '\uD835\uDD41',
                    jopf: '\uD835\uDD5B',
                    Jscr: '\uD835\uDCA5',
                    jscr: '\uD835\uDCBF',
                    Jsercy: '\u0408',
                    jsercy: '\u0458',
                    Jukcy: '\u0404',
                    jukcy: '\u0454',
                    Kappa: '\u039A',
                    kappa: '\u03BA',
                    kappav: '\u03F0',
                    Kcedil: '\u0136',
                    kcedil: '\u0137',
                    Kcy: '\u041A',
                    kcy: '\u043A',
                    Kfr: '\uD835\uDD0E',
                    kfr: '\uD835\uDD28',
                    kgreen: '\u0138',
                    KHcy: '\u0425',
                    khcy: '\u0445',
                    KJcy: '\u040C',
                    kjcy: '\u045C',
                    Kopf: '\uD835\uDD42',
                    kopf: '\uD835\uDD5C',
                    Kscr: '\uD835\uDCA6',
                    kscr: '\uD835\uDCC0',
                    lAarr: '\u21DA',
                    Lacute: '\u0139',
                    lacute: '\u013A',
                    laemptyv: '\u29B4',
                    lagran: '\u2112',
                    Lambda: '\u039B',
                    lambda: '\u03BB',
                    Lang: '\u27EA',
                    lang: '\u27E8',
                    langd: '\u2991',
                    langle: '\u27E8',
                    lap: '\u2A85',
                    Laplacetrf: '\u2112',
                    laquo: '\u00AB',
                    Larr: '\u219E',
                    lArr: '\u21D0',
                    larr: '\u2190',
                    larrb: '\u21E4',
                    larrbfs: '\u291F',
                    larrfs: '\u291D',
                    larrhk: '\u21A9',
                    larrlp: '\u21AB',
                    larrpl: '\u2939',
                    larrsim: '\u2973',
                    larrtl: '\u21A2',
                    lat: '\u2AAB',
                    lAtail: '\u291B',
                    latail: '\u2919',
                    late: '\u2AAD',
                    lates: '\u2AAD\uFE00',
                    lBarr: '\u290E',
                    lbarr: '\u290C',
                    lbbrk: '\u2772',
                    lbrace: '\u007B',
                    lbrack: '\u005B',
                    lbrke: '\u298B',
                    lbrksld: '\u298F',
                    lbrkslu: '\u298D',
                    Lcaron: '\u013D',
                    lcaron: '\u013E',
                    Lcedil: '\u013B',
                    lcedil: '\u013C',
                    lceil: '\u2308',
                    lcub: '\u007B',
                    Lcy: '\u041B',
                    lcy: '\u043B',
                    ldca: '\u2936',
                    ldquo: '\u201C',
                    ldquor: '\u201E',
                    ldrdhar: '\u2967',
                    ldrushar: '\u294B',
                    ldsh: '\u21B2',
                    lE: '\u2266',
                    le: '\u2264',
                    LeftAngleBracket: '\u27E8',
                    LeftArrow: '\u2190',
                    Leftarrow: '\u21D0',
                    leftarrow: '\u2190',
                    LeftArrowBar: '\u21E4',
                    LeftArrowRightArrow: '\u21C6',
                    leftarrowtail: '\u21A2',
                    LeftCeiling: '\u2308',
                    LeftDoubleBracket: '\u27E6',
                    LeftDownTeeVector: '\u2961',
                    LeftDownVector: '\u21C3',
                    LeftDownVectorBar: '\u2959',
                    LeftFloor: '\u230A',
                    leftharpoondown: '\u21BD',
                    leftharpoonup: '\u21BC',
                    leftleftarrows: '\u21C7',
                    LeftRightArrow: '\u2194',
                    Leftrightarrow: '\u21D4',
                    leftrightarrow: '\u2194',
                    leftrightarrows: '\u21C6',
                    leftrightharpoons: '\u21CB',
                    leftrightsquigarrow: '\u21AD',
                    LeftRightVector: '\u294E',
                    LeftTee: '\u22A3',
                    LeftTeeArrow: '\u21A4',
                    LeftTeeVector: '\u295A',
                    leftthreetimes: '\u22CB',
                    LeftTriangle: '\u22B2',
                    LeftTriangleBar: '\u29CF',
                    LeftTriangleEqual: '\u22B4',
                    LeftUpDownVector: '\u2951',
                    LeftUpTeeVector: '\u2960',
                    LeftUpVector: '\u21BF',
                    LeftUpVectorBar: '\u2958',
                    LeftVector: '\u21BC',
                    LeftVectorBar: '\u2952',
                    lEg: '\u2A8B',
                    leg: '\u22DA',
                    leq: '\u2264',
                    leqq: '\u2266',
                    leqslant: '\u2A7D',
                    les: '\u2A7D',
                    lescc: '\u2AA8',
                    lesdot: '\u2A7F',
                    lesdoto: '\u2A81',
                    lesdotor: '\u2A83',
                    lesg: '\u22DA\uFE00',
                    lesges: '\u2A93',
                    lessapprox: '\u2A85',
                    lessdot: '\u22D6',
                    lesseqgtr: '\u22DA',
                    lesseqqgtr: '\u2A8B',
                    LessEqualGreater: '\u22DA',
                    LessFullEqual: '\u2266',
                    LessGreater: '\u2276',
                    lessgtr: '\u2276',
                    LessLess: '\u2AA1',
                    lesssim: '\u2272',
                    LessSlantEqual: '\u2A7D',
                    LessTilde: '\u2272',
                    lfisht: '\u297C',
                    lfloor: '\u230A',
                    Lfr: '\uD835\uDD0F',
                    lfr: '\uD835\uDD29',
                    lg: '\u2276',
                    lgE: '\u2A91',
                    lHar: '\u2962',
                    lhard: '\u21BD',
                    lharu: '\u21BC',
                    lharul: '\u296A',
                    lhblk: '\u2584',
                    LJcy: '\u0409',
                    ljcy: '\u0459',
                    Ll: '\u22D8',
                    ll: '\u226A',
                    llarr: '\u21C7',
                    llcorner: '\u231E',
                    Lleftarrow: '\u21DA',
                    llhard: '\u296B',
                    lltri: '\u25FA',
                    Lmidot: '\u013F',
                    lmidot: '\u0140',
                    lmoust: '\u23B0',
                    lmoustache: '\u23B0',
                    lnap: '\u2A89',
                    lnapprox: '\u2A89',
                    lnE: '\u2268',
                    lne: '\u2A87',
                    lneq: '\u2A87',
                    lneqq: '\u2268',
                    lnsim: '\u22E6',
                    loang: '\u27EC',
                    loarr: '\u21FD',
                    lobrk: '\u27E6',
                    LongLeftArrow: '\u27F5',
                    Longleftarrow: '\u27F8',
                    longleftarrow: '\u27F5',
                    LongLeftRightArrow: '\u27F7',
                    Longleftrightarrow: '\u27FA',
                    longleftrightarrow: '\u27F7',
                    longmapsto: '\u27FC',
                    LongRightArrow: '\u27F6',
                    Longrightarrow: '\u27F9',
                    longrightarrow: '\u27F6',
                    looparrowleft: '\u21AB',
                    looparrowright: '\u21AC',
                    lopar: '\u2985',
                    Lopf: '\uD835\uDD43',
                    lopf: '\uD835\uDD5D',
                    loplus: '\u2A2D',
                    lotimes: '\u2A34',
                    lowast: '\u2217',
                    lowbar: '\u005F',
                    LowerLeftArrow: '\u2199',
                    LowerRightArrow: '\u2198',
                    loz: '\u25CA',
                    lozenge: '\u25CA',
                    lozf: '\u29EB',
                    lpar: '\u0028',
                    lparlt: '\u2993',
                    lrarr: '\u21C6',
                    lrcorner: '\u231F',
                    lrhar: '\u21CB',
                    lrhard: '\u296D',
                    lrm: '\u200E',
                    lrtri: '\u22BF',
                    lsaquo: '\u2039',
                    Lscr: '\u2112',
                    lscr: '\uD835\uDCC1',
                    Lsh: '\u21B0',
                    lsh: '\u21B0',
                    lsim: '\u2272',
                    lsime: '\u2A8D',
                    lsimg: '\u2A8F',
                    lsqb: '\u005B',
                    lsquo: '\u2018',
                    lsquor: '\u201A',
                    Lstrok: '\u0141',
                    lstrok: '\u0142',
                    Lt: '\u226A',
                    LT: '\u003C',
                    lt: '\u003C',
                    ltcc: '\u2AA6',
                    ltcir: '\u2A79',
                    ltdot: '\u22D6',
                    lthree: '\u22CB',
                    ltimes: '\u22C9',
                    ltlarr: '\u2976',
                    ltquest: '\u2A7B',
                    ltri: '\u25C3',
                    ltrie: '\u22B4',
                    ltrif: '\u25C2',
                    ltrPar: '\u2996',
                    lurdshar: '\u294A',
                    luruhar: '\u2966',
                    lvertneqq: '\u2268\uFE00',
                    lvnE: '\u2268\uFE00',
                    macr: '\u00AF',
                    male: '\u2642',
                    malt: '\u2720',
                    maltese: '\u2720',
                    Map: '\u2905',
                    map: '\u21A6',
                    mapsto: '\u21A6',
                    mapstodown: '\u21A7',
                    mapstoleft: '\u21A4',
                    mapstoup: '\u21A5',
                    marker: '\u25AE',
                    mcomma: '\u2A29',
                    Mcy: '\u041C',
                    mcy: '\u043C',
                    mdash: '\u2014',
                    mDDot: '\u223A',
                    measuredangle: '\u2221',
                    MediumSpace: '\u205F',
                    Mellintrf: '\u2133',
                    Mfr: '\uD835\uDD10',
                    mfr: '\uD835\uDD2A',
                    mho: '\u2127',
                    micro: '\u00B5',
                    mid: '\u2223',
                    midast: '\u002A',
                    midcir: '\u2AF0',
                    middot: '\u00B7',
                    minus: '\u2212',
                    minusb: '\u229F',
                    minusd: '\u2238',
                    minusdu: '\u2A2A',
                    MinusPlus: '\u2213',
                    mlcp: '\u2ADB',
                    mldr: '\u2026',
                    mnplus: '\u2213',
                    models: '\u22A7',
                    Mopf: '\uD835\uDD44',
                    mopf: '\uD835\uDD5E',
                    mp: '\u2213',
                    Mscr: '\u2133',
                    mscr: '\uD835\uDCC2',
                    mstpos: '\u223E',
                    Mu: '\u039C',
                    mu: '\u03BC',
                    multimap: '\u22B8',
                    mumap: '\u22B8',
                    nabla: '\u2207',
                    Nacute: '\u0143',
                    nacute: '\u0144',
                    nang: '\u2220\u20D2',
                    nap: '\u2249',
                    napE: '\u2A70\u0338',
                    napid: '\u224B\u0338',
                    napos: '\u0149',
                    napprox: '\u2249',
                    natur: '\u266E',
                    natural: '\u266E',
                    naturals: '\u2115',
                    nbsp: '\u00A0',
                    nbump: '\u224E\u0338',
                    nbumpe: '\u224F\u0338',
                    ncap: '\u2A43',
                    Ncaron: '\u0147',
                    ncaron: '\u0148',
                    Ncedil: '\u0145',
                    ncedil: '\u0146',
                    ncong: '\u2247',
                    ncongdot: '\u2A6D\u0338',
                    ncup: '\u2A42',
                    Ncy: '\u041D',
                    ncy: '\u043D',
                    ndash: '\u2013',
                    ne: '\u2260',
                    nearhk: '\u2924',
                    neArr: '\u21D7',
                    nearr: '\u2197',
                    nearrow: '\u2197',
                    nedot: '\u2250\u0338',
                    NegativeMediumSpace: '\u200B',
                    NegativeThickSpace: '\u200B',
                    NegativeThinSpace: '\u200B',
                    NegativeVeryThinSpace: '\u200B',
                    nequiv: '\u2262',
                    nesear: '\u2928',
                    nesim: '\u2242\u0338',
                    NestedGreaterGreater: '\u226B',
                    NestedLessLess: '\u226A',
                    NewLine: '\u000A',
                    nexist: '\u2204',
                    nexists: '\u2204',
                    Nfr: '\uD835\uDD11',
                    nfr: '\uD835\uDD2B',
                    ngE: '\u2267\u0338',
                    nge: '\u2271',
                    ngeq: '\u2271',
                    ngeqq: '\u2267\u0338',
                    ngeqslant: '\u2A7E\u0338',
                    nges: '\u2A7E\u0338',
                    nGg: '\u22D9\u0338',
                    ngsim: '\u2275',
                    nGt: '\u226B\u20D2',
                    ngt: '\u226F',
                    ngtr: '\u226F',
                    nGtv: '\u226B\u0338',
                    nhArr: '\u21CE',
                    nharr: '\u21AE',
                    nhpar: '\u2AF2',
                    ni: '\u220B',
                    nis: '\u22FC',
                    nisd: '\u22FA',
                    niv: '\u220B',
                    NJcy: '\u040A',
                    njcy: '\u045A',
                    nlArr: '\u21CD',
                    nlarr: '\u219A',
                    nldr: '\u2025',
                    nlE: '\u2266\u0338',
                    nle: '\u2270',
                    nLeftarrow: '\u21CD',
                    nleftarrow: '\u219A',
                    nLeftrightarrow: '\u21CE',
                    nleftrightarrow: '\u21AE',
                    nleq: '\u2270',
                    nleqq: '\u2266\u0338',
                    nleqslant: '\u2A7D\u0338',
                    nles: '\u2A7D\u0338',
                    nless: '\u226E',
                    nLl: '\u22D8\u0338',
                    nlsim: '\u2274',
                    nLt: '\u226A\u20D2',
                    nlt: '\u226E',
                    nltri: '\u22EA',
                    nltrie: '\u22EC',
                    nLtv: '\u226A\u0338',
                    nmid: '\u2224',
                    NoBreak: '\u2060',
                    NonBreakingSpace: '\u00A0',
                    Nopf: '\u2115',
                    nopf: '\uD835\uDD5F',
                    Not: '\u2AEC',
                    not: '\u00AC',
                    NotCongruent: '\u2262',
                    NotCupCap: '\u226D',
                    NotDoubleVerticalBar: '\u2226',
                    NotElement: '\u2209',
                    NotEqual: '\u2260',
                    NotEqualTilde: '\u2242\u0338',
                    NotExists: '\u2204',
                    NotGreater: '\u226F',
                    NotGreaterEqual: '\u2271',
                    NotGreaterFullEqual: '\u2267\u0338',
                    NotGreaterGreater: '\u226B\u0338',
                    NotGreaterLess: '\u2279',
                    NotGreaterSlantEqual: '\u2A7E\u0338',
                    NotGreaterTilde: '\u2275',
                    NotHumpDownHump: '\u224E\u0338',
                    NotHumpEqual: '\u224F\u0338',
                    notin: '\u2209',
                    notindot: '\u22F5\u0338',
                    notinE: '\u22F9\u0338',
                    notinva: '\u2209',
                    notinvb: '\u22F7',
                    notinvc: '\u22F6',
                    NotLeftTriangle: '\u22EA',
                    NotLeftTriangleBar: '\u29CF\u0338',
                    NotLeftTriangleEqual: '\u22EC',
                    NotLess: '\u226E',
                    NotLessEqual: '\u2270',
                    NotLessGreater: '\u2278',
                    NotLessLess: '\u226A\u0338',
                    NotLessSlantEqual: '\u2A7D\u0338',
                    NotLessTilde: '\u2274',
                    NotNestedGreaterGreater: '\u2AA2\u0338',
                    NotNestedLessLess: '\u2AA1\u0338',
                    notni: '\u220C',
                    notniva: '\u220C',
                    notnivb: '\u22FE',
                    notnivc: '\u22FD',
                    NotPrecedes: '\u2280',
                    NotPrecedesEqual: '\u2AAF\u0338',
                    NotPrecedesSlantEqual: '\u22E0',
                    NotReverseElement: '\u220C',
                    NotRightTriangle: '\u22EB',
                    NotRightTriangleBar: '\u29D0\u0338',
                    NotRightTriangleEqual: '\u22ED',
                    NotSquareSubset: '\u228F\u0338',
                    NotSquareSubsetEqual: '\u22E2',
                    NotSquareSuperset: '\u2290\u0338',
                    NotSquareSupersetEqual: '\u22E3',
                    NotSubset: '\u2282\u20D2',
                    NotSubsetEqual: '\u2288',
                    NotSucceeds: '\u2281',
                    NotSucceedsEqual: '\u2AB0\u0338',
                    NotSucceedsSlantEqual: '\u22E1',
                    NotSucceedsTilde: '\u227F\u0338',
                    NotSuperset: '\u2283\u20D2',
                    NotSupersetEqual: '\u2289',
                    NotTilde: '\u2241',
                    NotTildeEqual: '\u2244',
                    NotTildeFullEqual: '\u2247',
                    NotTildeTilde: '\u2249',
                    NotVerticalBar: '\u2224',
                    npar: '\u2226',
                    nparallel: '\u2226',
                    nparsl: '\u2AFD\u20E5',
                    npart: '\u2202\u0338',
                    npolint: '\u2A14',
                    npr: '\u2280',
                    nprcue: '\u22E0',
                    npre: '\u2AAF\u0338',
                    nprec: '\u2280',
                    npreceq: '\u2AAF\u0338',
                    nrArr: '\u21CF',
                    nrarr: '\u219B',
                    nrarrc: '\u2933\u0338',
                    nrarrw: '\u219D\u0338',
                    nRightarrow: '\u21CF',
                    nrightarrow: '\u219B',
                    nrtri: '\u22EB',
                    nrtrie: '\u22ED',
                    nsc: '\u2281',
                    nsccue: '\u22E1',
                    nsce: '\u2AB0\u0338',
                    Nscr: '\uD835\uDCA9',
                    nscr: '\uD835\uDCC3',
                    nshortmid: '\u2224',
                    nshortparallel: '\u2226',
                    nsim: '\u2241',
                    nsime: '\u2244',
                    nsimeq: '\u2244',
                    nsmid: '\u2224',
                    nspar: '\u2226',
                    nsqsube: '\u22E2',
                    nsqsupe: '\u22E3',
                    nsub: '\u2284',
                    nsubE: '\u2AC5\u0338',
                    nsube: '\u2288',
                    nsubset: '\u2282\u20D2',
                    nsubseteq: '\u2288',
                    nsubseteqq: '\u2AC5\u0338',
                    nsucc: '\u2281',
                    nsucceq: '\u2AB0\u0338',
                    nsup: '\u2285',
                    nsupE: '\u2AC6\u0338',
                    nsupe: '\u2289',
                    nsupset: '\u2283\u20D2',
                    nsupseteq: '\u2289',
                    nsupseteqq: '\u2AC6\u0338',
                    ntgl: '\u2279',
                    Ntilde: '\u00D1',
                    ntilde: '\u00F1',
                    ntlg: '\u2278',
                    ntriangleleft: '\u22EA',
                    ntrianglelefteq: '\u22EC',
                    ntriangleright: '\u22EB',
                    ntrianglerighteq: '\u22ED',
                    Nu: '\u039D',
                    nu: '\u03BD',
                    num: '\u0023',
                    numero: '\u2116',
                    numsp: '\u2007',
                    nvap: '\u224D\u20D2',
                    nVDash: '\u22AF',
                    nVdash: '\u22AE',
                    nvDash: '\u22AD',
                    nvdash: '\u22AC',
                    nvge: '\u2265\u20D2',
                    nvgt: '\u003E\u20D2',
                    nvHarr: '\u2904',
                    nvinfin: '\u29DE',
                    nvlArr: '\u2902',
                    nvle: '\u2264\u20D2',
                    nvlt: '\u003C\u20D2',
                    nvltrie: '\u22B4\u20D2',
                    nvrArr: '\u2903',
                    nvrtrie: '\u22B5\u20D2',
                    nvsim: '\u223C\u20D2',
                    nwarhk: '\u2923',
                    nwArr: '\u21D6',
                    nwarr: '\u2196',
                    nwarrow: '\u2196',
                    nwnear: '\u2927',
                    Oacute: '\u00D3',
                    oacute: '\u00F3',
                    oast: '\u229B',
                    ocir: '\u229A',
                    Ocirc: '\u00D4',
                    ocirc: '\u00F4',
                    Ocy: '\u041E',
                    ocy: '\u043E',
                    odash: '\u229D',
                    Odblac: '\u0150',
                    odblac: '\u0151',
                    odiv: '\u2A38',
                    odot: '\u2299',
                    odsold: '\u29BC',
                    OElig: '\u0152',
                    oelig: '\u0153',
                    ofcir: '\u29BF',
                    Ofr: '\uD835\uDD12',
                    ofr: '\uD835\uDD2C',
                    ogon: '\u02DB',
                    Ograve: '\u00D2',
                    ograve: '\u00F2',
                    ogt: '\u29C1',
                    ohbar: '\u29B5',
                    ohm: '\u03A9',
                    oint: '\u222E',
                    olarr: '\u21BA',
                    olcir: '\u29BE',
                    olcross: '\u29BB',
                    oline: '\u203E',
                    olt: '\u29C0',
                    Omacr: '\u014C',
                    omacr: '\u014D',
                    Omega: '\u03A9',
                    omega: '\u03C9',
                    Omicron: '\u039F',
                    omicron: '\u03BF',
                    omid: '\u29B6',
                    ominus: '\u2296',
                    Oopf: '\uD835\uDD46',
                    oopf: '\uD835\uDD60',
                    opar: '\u29B7',
                    OpenCurlyDoubleQuote: '\u201C',
                    OpenCurlyQuote: '\u2018',
                    operp: '\u29B9',
                    oplus: '\u2295',
                    Or: '\u2A54',
                    or: '\u2228',
                    orarr: '\u21BB',
                    ord: '\u2A5D',
                    order: '\u2134',
                    orderof: '\u2134',
                    ordf: '\u00AA',
                    ordm: '\u00BA',
                    origof: '\u22B6',
                    oror: '\u2A56',
                    orslope: '\u2A57',
                    orv: '\u2A5B',
                    oS: '\u24C8',
                    Oscr: '\uD835\uDCAA',
                    oscr: '\u2134',
                    Oslash: '\u00D8',
                    oslash: '\u00F8',
                    osol: '\u2298',
                    Otilde: '\u00D5',
                    otilde: '\u00F5',
                    Otimes: '\u2A37',
                    otimes: '\u2297',
                    otimesas: '\u2A36',
                    Ouml: '\u00D6',
                    ouml: '\u00F6',
                    ovbar: '\u233D',
                    OverBar: '\u203E',
                    OverBrace: '\u23DE',
                    OverBracket: '\u23B4',
                    OverParenthesis: '\u23DC',
                    par: '\u2225',
                    para: '\u00B6',
                    parallel: '\u2225',
                    parsim: '\u2AF3',
                    parsl: '\u2AFD',
                    part: '\u2202',
                    PartialD: '\u2202',
                    Pcy: '\u041F',
                    pcy: '\u043F',
                    percnt: '\u0025',
                    period: '\u002E',
                    permil: '\u2030',
                    perp: '\u22A5',
                    pertenk: '\u2031',
                    Pfr: '\uD835\uDD13',
                    pfr: '\uD835\uDD2D',
                    Phi: '\u03A6',
                    phi: '\u03C6',
                    phiv: '\u03D5',
                    phmmat: '\u2133',
                    phone: '\u260E',
                    Pi: '\u03A0',
                    pi: '\u03C0',
                    pitchfork: '\u22D4',
                    piv: '\u03D6',
                    planck: '\u210F',
                    planckh: '\u210E',
                    plankv: '\u210F',
                    plus: '\u002B',
                    plusacir: '\u2A23',
                    plusb: '\u229E',
                    pluscir: '\u2A22',
                    plusdo: '\u2214',
                    plusdu: '\u2A25',
                    pluse: '\u2A72',
                    PlusMinus: '\u00B1',
                    plusmn: '\u00B1',
                    plussim: '\u2A26',
                    plustwo: '\u2A27',
                    pm: '\u00B1',
                    Poincareplane: '\u210C',
                    pointint: '\u2A15',
                    Popf: '\u2119',
                    popf: '\uD835\uDD61',
                    pound: '\u00A3',
                    Pr: '\u2ABB',
                    pr: '\u227A',
                    prap: '\u2AB7',
                    prcue: '\u227C',
                    prE: '\u2AB3',
                    pre: '\u2AAF',
                    prec: '\u227A',
                    precapprox: '\u2AB7',
                    preccurlyeq: '\u227C',
                    Precedes: '\u227A',
                    PrecedesEqual: '\u2AAF',
                    PrecedesSlantEqual: '\u227C',
                    PrecedesTilde: '\u227E',
                    preceq: '\u2AAF',
                    precnapprox: '\u2AB9',
                    precneqq: '\u2AB5',
                    precnsim: '\u22E8',
                    precsim: '\u227E',
                    Prime: '\u2033',
                    prime: '\u2032',
                    primes: '\u2119',
                    prnap: '\u2AB9',
                    prnE: '\u2AB5',
                    prnsim: '\u22E8',
                    prod: '\u220F',
                    Product: '\u220F',
                    profalar: '\u232E',
                    profline: '\u2312',
                    profsurf: '\u2313',
                    prop: '\u221D',
                    Proportion: '\u2237',
                    Proportional: '\u221D',
                    propto: '\u221D',
                    prsim: '\u227E',
                    prurel: '\u22B0',
                    Pscr: '\uD835\uDCAB',
                    pscr: '\uD835\uDCC5',
                    Psi: '\u03A8',
                    psi: '\u03C8',
                    puncsp: '\u2008',
                    Qfr: '\uD835\uDD14',
                    qfr: '\uD835\uDD2E',
                    qint: '\u2A0C',
                    Qopf: '\u211A',
                    qopf: '\uD835\uDD62',
                    qprime: '\u2057',
                    Qscr: '\uD835\uDCAC',
                    qscr: '\uD835\uDCC6',
                    quaternions: '\u210D',
                    quatint: '\u2A16',
                    quest: '\u003F',
                    questeq: '\u225F',
                    QUOT: '\u0022',
                    quot: '\u0022',
                    rAarr: '\u21DB',
                    race: '\u223D\u0331',
                    Racute: '\u0154',
                    racute: '\u0155',
                    radic: '\u221A',
                    raemptyv: '\u29B3',
                    Rang: '\u27EB',
                    rang: '\u27E9',
                    rangd: '\u2992',
                    range: '\u29A5',
                    rangle: '\u27E9',
                    raquo: '\u00BB',
                    Rarr: '\u21A0',
                    rArr: '\u21D2',
                    rarr: '\u2192',
                    rarrap: '\u2975',
                    rarrb: '\u21E5',
                    rarrbfs: '\u2920',
                    rarrc: '\u2933',
                    rarrfs: '\u291E',
                    rarrhk: '\u21AA',
                    rarrlp: '\u21AC',
                    rarrpl: '\u2945',
                    rarrsim: '\u2974',
                    Rarrtl: '\u2916',
                    rarrtl: '\u21A3',
                    rarrw: '\u219D',
                    rAtail: '\u291C',
                    ratail: '\u291A',
                    ratio: '\u2236',
                    rationals: '\u211A',
                    RBarr: '\u2910',
                    rBarr: '\u290F',
                    rbarr: '\u290D',
                    rbbrk: '\u2773',
                    rbrace: '\u007D',
                    rbrack: '\u005D',
                    rbrke: '\u298C',
                    rbrksld: '\u298E',
                    rbrkslu: '\u2990',
                    Rcaron: '\u0158',
                    rcaron: '\u0159',
                    Rcedil: '\u0156',
                    rcedil: '\u0157',
                    rceil: '\u2309',
                    rcub: '\u007D',
                    Rcy: '\u0420',
                    rcy: '\u0440',
                    rdca: '\u2937',
                    rdldhar: '\u2969',
                    rdquo: '\u201D',
                    rdquor: '\u201D',
                    rdsh: '\u21B3',
                    Re: '\u211C',
                    real: '\u211C',
                    realine: '\u211B',
                    realpart: '\u211C',
                    reals: '\u211D',
                    rect: '\u25AD',
                    REG: '\u00AE',
                    reg: '\u00AE',
                    ReverseElement: '\u220B',
                    ReverseEquilibrium: '\u21CB',
                    ReverseUpEquilibrium: '\u296F',
                    rfisht: '\u297D',
                    rfloor: '\u230B',
                    Rfr: '\u211C',
                    rfr: '\uD835\uDD2F',
                    rHar: '\u2964',
                    rhard: '\u21C1',
                    rharu: '\u21C0',
                    rharul: '\u296C',
                    Rho: '\u03A1',
                    rho: '\u03C1',
                    rhov: '\u03F1',
                    RightAngleBracket: '\u27E9',
                    RightArrow: '\u2192',
                    Rightarrow: '\u21D2',
                    rightarrow: '\u2192',
                    RightArrowBar: '\u21E5',
                    RightArrowLeftArrow: '\u21C4',
                    rightarrowtail: '\u21A3',
                    RightCeiling: '\u2309',
                    RightDoubleBracket: '\u27E7',
                    RightDownTeeVector: '\u295D',
                    RightDownVector: '\u21C2',
                    RightDownVectorBar: '\u2955',
                    RightFloor: '\u230B',
                    rightharpoondown: '\u21C1',
                    rightharpoonup: '\u21C0',
                    rightleftarrows: '\u21C4',
                    rightleftharpoons: '\u21CC',
                    rightrightarrows: '\u21C9',
                    rightsquigarrow: '\u219D',
                    RightTee: '\u22A2',
                    RightTeeArrow: '\u21A6',
                    RightTeeVector: '\u295B',
                    rightthreetimes: '\u22CC',
                    RightTriangle: '\u22B3',
                    RightTriangleBar: '\u29D0',
                    RightTriangleEqual: '\u22B5',
                    RightUpDownVector: '\u294F',
                    RightUpTeeVector: '\u295C',
                    RightUpVector: '\u21BE',
                    RightUpVectorBar: '\u2954',
                    RightVector: '\u21C0',
                    RightVectorBar: '\u2953',
                    ring: '\u02DA',
                    risingdotseq: '\u2253',
                    rlarr: '\u21C4',
                    rlhar: '\u21CC',
                    rlm: '\u200F',
                    rmoust: '\u23B1',
                    rmoustache: '\u23B1',
                    rnmid: '\u2AEE',
                    roang: '\u27ED',
                    roarr: '\u21FE',
                    robrk: '\u27E7',
                    ropar: '\u2986',
                    Ropf: '\u211D',
                    ropf: '\uD835\uDD63',
                    roplus: '\u2A2E',
                    rotimes: '\u2A35',
                    RoundImplies: '\u2970',
                    rpar: '\u0029',
                    rpargt: '\u2994',
                    rppolint: '\u2A12',
                    rrarr: '\u21C9',
                    Rrightarrow: '\u21DB',
                    rsaquo: '\u203A',
                    Rscr: '\u211B',
                    rscr: '\uD835\uDCC7',
                    Rsh: '\u21B1',
                    rsh: '\u21B1',
                    rsqb: '\u005D',
                    rsquo: '\u2019',
                    rsquor: '\u2019',
                    rthree: '\u22CC',
                    rtimes: '\u22CA',
                    rtri: '\u25B9',
                    rtrie: '\u22B5',
                    rtrif: '\u25B8',
                    rtriltri: '\u29CE',
                    RuleDelayed: '\u29F4',
                    ruluhar: '\u2968',
                    rx: '\u211E',
                    Sacute: '\u015A',
                    sacute: '\u015B',
                    sbquo: '\u201A',
                    Sc: '\u2ABC',
                    sc: '\u227B',
                    scap: '\u2AB8',
                    Scaron: '\u0160',
                    scaron: '\u0161',
                    sccue: '\u227D',
                    scE: '\u2AB4',
                    sce: '\u2AB0',
                    Scedil: '\u015E',
                    scedil: '\u015F',
                    Scirc: '\u015C',
                    scirc: '\u015D',
                    scnap: '\u2ABA',
                    scnE: '\u2AB6',
                    scnsim: '\u22E9',
                    scpolint: '\u2A13',
                    scsim: '\u227F',
                    Scy: '\u0421',
                    scy: '\u0441',
                    sdot: '\u22C5',
                    sdotb: '\u22A1',
                    sdote: '\u2A66',
                    searhk: '\u2925',
                    seArr: '\u21D8',
                    searr: '\u2198',
                    searrow: '\u2198',
                    sect: '\u00A7',
                    semi: '\u003B',
                    seswar: '\u2929',
                    setminus: '\u2216',
                    setmn: '\u2216',
                    sext: '\u2736',
                    Sfr: '\uD835\uDD16',
                    sfr: '\uD835\uDD30',
                    sfrown: '\u2322',
                    sharp: '\u266F',
                    SHCHcy: '\u0429',
                    shchcy: '\u0449',
                    SHcy: '\u0428',
                    shcy: '\u0448',
                    ShortDownArrow: '\u2193',
                    ShortLeftArrow: '\u2190',
                    shortmid: '\u2223',
                    shortparallel: '\u2225',
                    ShortRightArrow: '\u2192',
                    ShortUpArrow: '\u2191',
                    shy: '\u00AD',
                    Sigma: '\u03A3',
                    sigma: '\u03C3',
                    sigmaf: '\u03C2',
                    sigmav: '\u03C2',
                    sim: '\u223C',
                    simdot: '\u2A6A',
                    sime: '\u2243',
                    simeq: '\u2243',
                    simg: '\u2A9E',
                    simgE: '\u2AA0',
                    siml: '\u2A9D',
                    simlE: '\u2A9F',
                    simne: '\u2246',
                    simplus: '\u2A24',
                    simrarr: '\u2972',
                    slarr: '\u2190',
                    SmallCircle: '\u2218',
                    smallsetminus: '\u2216',
                    smashp: '\u2A33',
                    smeparsl: '\u29E4',
                    smid: '\u2223',
                    smile: '\u2323',
                    smt: '\u2AAA',
                    smte: '\u2AAC',
                    smtes: '\u2AAC\uFE00',
                    SOFTcy: '\u042C',
                    softcy: '\u044C',
                    sol: '\u002F',
                    solb: '\u29C4',
                    solbar: '\u233F',
                    Sopf: '\uD835\uDD4A',
                    sopf: '\uD835\uDD64',
                    spades: '\u2660',
                    spadesuit: '\u2660',
                    spar: '\u2225',
                    sqcap: '\u2293',
                    sqcaps: '\u2293\uFE00',
                    sqcup: '\u2294',
                    sqcups: '\u2294\uFE00',
                    Sqrt: '\u221A',
                    sqsub: '\u228F',
                    sqsube: '\u2291',
                    sqsubset: '\u228F',
                    sqsubseteq: '\u2291',
                    sqsup: '\u2290',
                    sqsupe: '\u2292',
                    sqsupset: '\u2290',
                    sqsupseteq: '\u2292',
                    squ: '\u25A1',
                    Square: '\u25A1',
                    square: '\u25A1',
                    SquareIntersection: '\u2293',
                    SquareSubset: '\u228F',
                    SquareSubsetEqual: '\u2291',
                    SquareSuperset: '\u2290',
                    SquareSupersetEqual: '\u2292',
                    SquareUnion: '\u2294',
                    squarf: '\u25AA',
                    squf: '\u25AA',
                    srarr: '\u2192',
                    Sscr: '\uD835\uDCAE',
                    sscr: '\uD835\uDCC8',
                    ssetmn: '\u2216',
                    ssmile: '\u2323',
                    sstarf: '\u22C6',
                    Star: '\u22C6',
                    star: '\u2606',
                    starf: '\u2605',
                    straightepsilon: '\u03F5',
                    straightphi: '\u03D5',
                    strns: '\u00AF',
                    Sub: '\u22D0',
                    sub: '\u2282',
                    subdot: '\u2ABD',
                    subE: '\u2AC5',
                    sube: '\u2286',
                    subedot: '\u2AC3',
                    submult: '\u2AC1',
                    subnE: '\u2ACB',
                    subne: '\u228A',
                    subplus: '\u2ABF',
                    subrarr: '\u2979',
                    Subset: '\u22D0',
                    subset: '\u2282',
                    subseteq: '\u2286',
                    subseteqq: '\u2AC5',
                    SubsetEqual: '\u2286',
                    subsetneq: '\u228A',
                    subsetneqq: '\u2ACB',
                    subsim: '\u2AC7',
                    subsub: '\u2AD5',
                    subsup: '\u2AD3',
                    succ: '\u227B',
                    succapprox: '\u2AB8',
                    succcurlyeq: '\u227D',
                    Succeeds: '\u227B',
                    SucceedsEqual: '\u2AB0',
                    SucceedsSlantEqual: '\u227D',
                    SucceedsTilde: '\u227F',
                    succeq: '\u2AB0',
                    succnapprox: '\u2ABA',
                    succneqq: '\u2AB6',
                    succnsim: '\u22E9',
                    succsim: '\u227F',
                    SuchThat: '\u220B',
                    Sum: '\u2211',
                    sum: '\u2211',
                    sung: '\u266A',
                    Sup: '\u22D1',
                    sup: '\u2283',
                    sup1: '\u00B9',
                    sup2: '\u00B2',
                    sup3: '\u00B3',
                    supdot: '\u2ABE',
                    supdsub: '\u2AD8',
                    supE: '\u2AC6',
                    supe: '\u2287',
                    supedot: '\u2AC4',
                    Superset: '\u2283',
                    SupersetEqual: '\u2287',
                    suphsol: '\u27C9',
                    suphsub: '\u2AD7',
                    suplarr: '\u297B',
                    supmult: '\u2AC2',
                    supnE: '\u2ACC',
                    supne: '\u228B',
                    supplus: '\u2AC0',
                    Supset: '\u22D1',
                    supset: '\u2283',
                    supseteq: '\u2287',
                    supseteqq: '\u2AC6',
                    supsetneq: '\u228B',
                    supsetneqq: '\u2ACC',
                    supsim: '\u2AC8',
                    supsub: '\u2AD4',
                    supsup: '\u2AD6',
                    swarhk: '\u2926',
                    swArr: '\u21D9',
                    swarr: '\u2199',
                    swarrow: '\u2199',
                    swnwar: '\u292A',
                    szlig: '\u00DF',
                    Tab: '\u0009',
                    target: '\u2316',
                    Tau: '\u03A4',
                    tau: '\u03C4',
                    tbrk: '\u23B4',
                    Tcaron: '\u0164',
                    tcaron: '\u0165',
                    Tcedil: '\u0162',
                    tcedil: '\u0163',
                    Tcy: '\u0422',
                    tcy: '\u0442',
                    tdot: '\u20DB',
                    telrec: '\u2315',
                    Tfr: '\uD835\uDD17',
                    tfr: '\uD835\uDD31',
                    there4: '\u2234',
                    Therefore: '\u2234',
                    therefore: '\u2234',
                    Theta: '\u0398',
                    theta: '\u03B8',
                    thetasym: '\u03D1',
                    thetav: '\u03D1',
                    thickapprox: '\u2248',
                    thicksim: '\u223C',
                    ThickSpace: '\u205F\u200A',
                    thinsp: '\u2009',
                    ThinSpace: '\u2009',
                    thkap: '\u2248',
                    thksim: '\u223C',
                    THORN: '\u00DE',
                    thorn: '\u00FE',
                    Tilde: '\u223C',
                    tilde: '\u02DC',
                    TildeEqual: '\u2243',
                    TildeFullEqual: '\u2245',
                    TildeTilde: '\u2248',
                    times: '\u00D7',
                    timesb: '\u22A0',
                    timesbar: '\u2A31',
                    timesd: '\u2A30',
                    tint: '\u222D',
                    toea: '\u2928',
                    top: '\u22A4',
                    topbot: '\u2336',
                    topcir: '\u2AF1',
                    Topf: '\uD835\uDD4B',
                    topf: '\uD835\uDD65',
                    topfork: '\u2ADA',
                    tosa: '\u2929',
                    tprime: '\u2034',
                    TRADE: '\u2122',
                    trade: '\u2122',
                    triangle: '\u25B5',
                    triangledown: '\u25BF',
                    triangleleft: '\u25C3',
                    trianglelefteq: '\u22B4',
                    triangleq: '\u225C',
                    triangleright: '\u25B9',
                    trianglerighteq: '\u22B5',
                    tridot: '\u25EC',
                    trie: '\u225C',
                    triminus: '\u2A3A',
                    TripleDot: '\u20DB',
                    triplus: '\u2A39',
                    trisb: '\u29CD',
                    tritime: '\u2A3B',
                    trpezium: '\u23E2',
                    Tscr: '\uD835\uDCAF',
                    tscr: '\uD835\uDCC9',
                    TScy: '\u0426',
                    tscy: '\u0446',
                    TSHcy: '\u040B',
                    tshcy: '\u045B',
                    Tstrok: '\u0166',
                    tstrok: '\u0167',
                    twixt: '\u226C',
                    twoheadleftarrow: '\u219E',
                    twoheadrightarrow: '\u21A0',
                    Uacute: '\u00DA',
                    uacute: '\u00FA',
                    Uarr: '\u219F',
                    uArr: '\u21D1',
                    uarr: '\u2191',
                    Uarrocir: '\u2949',
                    Ubrcy: '\u040E',
                    ubrcy: '\u045E',
                    Ubreve: '\u016C',
                    ubreve: '\u016D',
                    Ucirc: '\u00DB',
                    ucirc: '\u00FB',
                    Ucy: '\u0423',
                    ucy: '\u0443',
                    udarr: '\u21C5',
                    Udblac: '\u0170',
                    udblac: '\u0171',
                    udhar: '\u296E',
                    ufisht: '\u297E',
                    Ufr: '\uD835\uDD18',
                    ufr: '\uD835\uDD32',
                    Ugrave: '\u00D9',
                    ugrave: '\u00F9',
                    uHar: '\u2963',
                    uharl: '\u21BF',
                    uharr: '\u21BE',
                    uhblk: '\u2580',
                    ulcorn: '\u231C',
                    ulcorner: '\u231C',
                    ulcrop: '\u230F',
                    ultri: '\u25F8',
                    Umacr: '\u016A',
                    umacr: '\u016B',
                    uml: '\u00A8',
                    UnderBar: '\u005F',
                    UnderBrace: '\u23DF',
                    UnderBracket: '\u23B5',
                    UnderParenthesis: '\u23DD',
                    Union: '\u22C3',
                    UnionPlus: '\u228E',
                    Uogon: '\u0172',
                    uogon: '\u0173',
                    Uopf: '\uD835\uDD4C',
                    uopf: '\uD835\uDD66',
                    UpArrow: '\u2191',
                    Uparrow: '\u21D1',
                    uparrow: '\u2191',
                    UpArrowBar: '\u2912',
                    UpArrowDownArrow: '\u21C5',
                    UpDownArrow: '\u2195',
                    Updownarrow: '\u21D5',
                    updownarrow: '\u2195',
                    UpEquilibrium: '\u296E',
                    upharpoonleft: '\u21BF',
                    upharpoonright: '\u21BE',
                    uplus: '\u228E',
                    UpperLeftArrow: '\u2196',
                    UpperRightArrow: '\u2197',
                    Upsi: '\u03D2',
                    upsi: '\u03C5',
                    upsih: '\u03D2',
                    Upsilon: '\u03A5',
                    upsilon: '\u03C5',
                    UpTee: '\u22A5',
                    UpTeeArrow: '\u21A5',
                    upuparrows: '\u21C8',
                    urcorn: '\u231D',
                    urcorner: '\u231D',
                    urcrop: '\u230E',
                    Uring: '\u016E',
                    uring: '\u016F',
                    urtri: '\u25F9',
                    Uscr: '\uD835\uDCB0',
                    uscr: '\uD835\uDCCA',
                    utdot: '\u22F0',
                    Utilde: '\u0168',
                    utilde: '\u0169',
                    utri: '\u25B5',
                    utrif: '\u25B4',
                    uuarr: '\u21C8',
                    Uuml: '\u00DC',
                    uuml: '\u00FC',
                    uwangle: '\u29A7',
                    vangrt: '\u299C',
                    varepsilon: '\u03F5',
                    varkappa: '\u03F0',
                    varnothing: '\u2205',
                    varphi: '\u03D5',
                    varpi: '\u03D6',
                    varpropto: '\u221D',
                    vArr: '\u21D5',
                    varr: '\u2195',
                    varrho: '\u03F1',
                    varsigma: '\u03C2',
                    varsubsetneq: '\u228A\uFE00',
                    varsubsetneqq: '\u2ACB\uFE00',
                    varsupsetneq: '\u228B\uFE00',
                    varsupsetneqq: '\u2ACC\uFE00',
                    vartheta: '\u03D1',
                    vartriangleleft: '\u22B2',
                    vartriangleright: '\u22B3',
                    Vbar: '\u2AEB',
                    vBar: '\u2AE8',
                    vBarv: '\u2AE9',
                    Vcy: '\u0412',
                    vcy: '\u0432',
                    VDash: '\u22AB',
                    Vdash: '\u22A9',
                    vDash: '\u22A8',
                    vdash: '\u22A2',
                    Vdashl: '\u2AE6',
                    Vee: '\u22C1',
                    vee: '\u2228',
                    veebar: '\u22BB',
                    veeeq: '\u225A',
                    vellip: '\u22EE',
                    Verbar: '\u2016',
                    verbar: '\u007C',
                    Vert: '\u2016',
                    vert: '\u007C',
                    VerticalBar: '\u2223',
                    VerticalLine: '\u007C',
                    VerticalSeparator: '\u2758',
                    VerticalTilde: '\u2240',
                    VeryThinSpace: '\u200A',
                    Vfr: '\uD835\uDD19',
                    vfr: '\uD835\uDD33',
                    vltri: '\u22B2',
                    vnsub: '\u2282\u20D2',
                    vnsup: '\u2283\u20D2',
                    Vopf: '\uD835\uDD4D',
                    vopf: '\uD835\uDD67',
                    vprop: '\u221D',
                    vrtri: '\u22B3',
                    Vscr: '\uD835\uDCB1',
                    vscr: '\uD835\uDCCB',
                    vsubnE: '\u2ACB\uFE00',
                    vsubne: '\u228A\uFE00',
                    vsupnE: '\u2ACC\uFE00',
                    vsupne: '\u228B\uFE00',
                    Vvdash: '\u22AA',
                    vzigzag: '\u299A',
                    Wcirc: '\u0174',
                    wcirc: '\u0175',
                    wedbar: '\u2A5F',
                    Wedge: '\u22C0',
                    wedge: '\u2227',
                    wedgeq: '\u2259',
                    weierp: '\u2118',
                    Wfr: '\uD835\uDD1A',
                    wfr: '\uD835\uDD34',
                    Wopf: '\uD835\uDD4E',
                    wopf: '\uD835\uDD68',
                    wp: '\u2118',
                    wr: '\u2240',
                    wreath: '\u2240',
                    Wscr: '\uD835\uDCB2',
                    wscr: '\uD835\uDCCC',
                    xcap: '\u22C2',
                    xcirc: '\u25EF',
                    xcup: '\u22C3',
                    xdtri: '\u25BD',
                    Xfr: '\uD835\uDD1B',
                    xfr: '\uD835\uDD35',
                    xhArr: '\u27FA',
                    xharr: '\u27F7',
                    Xi: '\u039E',
                    xi: '\u03BE',
                    xlArr: '\u27F8',
                    xlarr: '\u27F5',
                    xmap: '\u27FC',
                    xnis: '\u22FB',
                    xodot: '\u2A00',
                    Xopf: '\uD835\uDD4F',
                    xopf: '\uD835\uDD69',
                    xoplus: '\u2A01',
                    xotime: '\u2A02',
                    xrArr: '\u27F9',
                    xrarr: '\u27F6',
                    Xscr: '\uD835\uDCB3',
                    xscr: '\uD835\uDCCD',
                    xsqcup: '\u2A06',
                    xuplus: '\u2A04',
                    xutri: '\u25B3',
                    xvee: '\u22C1',
                    xwedge: '\u22C0',
                    Yacute: '\u00DD',
                    yacute: '\u00FD',
                    YAcy: '\u042F',
                    yacy: '\u044F',
                    Ycirc: '\u0176',
                    ycirc: '\u0177',
                    Ycy: '\u042B',
                    ycy: '\u044B',
                    yen: '\u00A5',
                    Yfr: '\uD835\uDD1C',
                    yfr: '\uD835\uDD36',
                    YIcy: '\u0407',
                    yicy: '\u0457',
                    Yopf: '\uD835\uDD50',
                    yopf: '\uD835\uDD6A',
                    Yscr: '\uD835\uDCB4',
                    yscr: '\uD835\uDCCE',
                    YUcy: '\u042E',
                    yucy: '\u044E',
                    Yuml: '\u0178',
                    yuml: '\u00FF',
                    Zacute: '\u0179',
                    zacute: '\u017A',
                    Zcaron: '\u017D',
                    zcaron: '\u017E',
                    Zcy: '\u0417',
                    zcy: '\u0437',
                    Zdot: '\u017B',
                    zdot: '\u017C',
                    zeetrf: '\u2128',
                    ZeroWidthSpace: '\u200B',
                    Zeta: '\u0396',
                    zeta: '\u03B6',
                    Zfr: '\u2128',
                    zfr: '\uD835\uDD37',
                    ZHcy: '\u0416',
                    zhcy: '\u0436',
                    zigrarr: '\u21DD',
                    Zopf: '\u2124',
                    zopf: '\uD835\uDD6B',
                    Zscr: '\uD835\uDCB5',
                    zscr: '\uD835\uDCCF',
                    zwj: '\u200D',
                    zwnj: '\u200C'
                })

                /**
                 * @deprecated use `HTML_ENTITIES` instead
                 * @see HTML_ENTITIES
                 */
                exports.entityMap = exports.HTML_ENTITIES
            },
            { './conventions': 5 }
        ],
        9: [
            function (require, module, exports) {
                var dom = require('./dom')
                exports.DOMImplementation = dom.DOMImplementation
                exports.XMLSerializer = dom.XMLSerializer
                exports.DOMParser = require('./dom-parser').DOMParser
            },
            { './dom': 7, './dom-parser': 6 }
        ],
        10: [
            function (require, module, exports) {
                var NAMESPACE = require('./conventions').NAMESPACE
                var nameStartChar =
                    /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/ //\u10000-\uEFFFF
                var nameChar = new RegExp('[\\-\\.0-9' + nameStartChar.source.slice(1, -1) + '\\u00B7\\u0300-\\u036F\\u203F-\\u2040]')
                var tagNamePattern = new RegExp('^' + nameStartChar.source + nameChar.source + '*(?::' + nameStartChar.source + nameChar.source + '*)?$')
                var S_TAG = 0 //tag name offerring
                var S_ATTR = 1 //attr name offerring
                var S_ATTR_SPACE = 2 //attr name end and space offer
                var S_EQ = 3 //=space?
                var S_ATTR_NOQUOT_VALUE = 4 //attr value(no quot value only)
                var S_ATTR_END = 5 //attr value end and no space(quot end)
                var S_TAG_SPACE = 6 //(attr value end || tag end ) && (space offer)
                var S_TAG_CLOSE = 7 //closed el<el />
                function ParseError(message, locator) {
                    this.message = message
                    this.locator = locator
                    if (Error.captureStackTrace) Error.captureStackTrace(this, ParseError)
                }
                ParseError.prototype = new Error()
                ParseError.prototype.name = ParseError.name
                function XMLReader() {}
                XMLReader.prototype = {
                    parse: function (source, defaultNSMap, entityMap) {
                        var domBuilder = this.domBuilder
                        domBuilder.startDocument()
                        _copy(defaultNSMap, (defaultNSMap = {}))
                        parse(source, defaultNSMap, entityMap, domBuilder, this.errorHandler)
                        domBuilder.endDocument()
                    }
                }
                function parse(source, defaultNSMapCopy, entityMap, domBuilder, errorHandler) {
                    function fixedFromCharCode(code) {
                        if (code > 0xffff) {
                            code -= 0x10000
                            var surrogate1 = 0xd800 + (code >> 10),
                                surrogate2 = 0xdc00 + (code & 0x3ff)
                            return String.fromCharCode(surrogate1, surrogate2)
                        } else {
                            return String.fromCharCode(code)
                        }
                    }
                    function entityReplacer(a) {
                        var k = a.slice(1, -1)
                        if (Object.hasOwnProperty.call(entityMap, k)) {
                            return entityMap[k]
                        } else if (k.charAt(0) === '#') {
                            return fixedFromCharCode(parseInt(k.substr(1).replace('x', '0x')))
                        } else {
                            errorHandler.error('entity not found:' + a)
                            return a
                        }
                    }
                    function appendText(end) {
                        //has some bugs
                        if (end > start) {
                            var xt = source.substring(start, end).replace(/&#?\w+;/g, entityReplacer)
                            locator && position(start)
                            domBuilder.characters(xt, 0, end - start)
                            start = end
                        }
                    }
                    function position(p, m) {
                        while (p >= lineEnd && (m = linePattern.exec(source))) {
                            lineStart = m.index
                            lineEnd = lineStart + m[0].length
                            locator.lineNumber++
                            //console.log('line++:',locator,startPos,endPos)
                        }
                        locator.columnNumber = p - lineStart + 1
                    }
                    var lineStart = 0
                    var lineEnd = 0
                    var linePattern = /.*(?:\r\n?|\n)|.*$/g
                    var locator = domBuilder.locator
                    var parseStack = [{ currentNSMap: defaultNSMapCopy }]
                    var closeMap = {}
                    var start = 0
                    while (true) {
                        try {
                            var tagStart = source.indexOf('<', start)
                            if (tagStart < 0) {
                                if (!source.substr(start).match(/^\s*$/)) {
                                    var doc = domBuilder.doc
                                    var text = doc.createTextNode(source.substr(start))
                                    doc.appendChild(text)
                                    domBuilder.currentElement = text
                                }
                                return
                            }
                            if (tagStart > start) {
                                appendText(tagStart)
                            }
                            switch (source.charAt(tagStart + 1)) {
                                case '/':
                                    var end = source.indexOf('>', tagStart + 3)
                                    var tagName = source.substring(tagStart + 2, end).replace(/[ \t\n\r]+$/g, '')
                                    var config = parseStack.pop()
                                    if (end < 0) {
                                        tagName = source.substring(tagStart + 2).replace(/[\s<].*/, '')
                                        errorHandler.error('end tag name: ' + tagName + ' is not complete:' + config.tagName)
                                        end = tagStart + 1 + tagName.length
                                    } else if (tagName.match(/\s</)) {
                                        tagName = tagName.replace(/[\s<].*/, '')
                                        errorHandler.error('end tag name: ' + tagName + ' maybe not complete')
                                        end = tagStart + 1 + tagName.length
                                    }
                                    var localNSMap = config.localNSMap
                                    var endMatch = config.tagName == tagName
                                    var endIgnoreCaseMach = endMatch || (config.tagName && config.tagName.toLowerCase() == tagName.toLowerCase())
                                    if (endIgnoreCaseMach) {
                                        domBuilder.endElement(config.uri, config.localName, tagName)
                                        if (localNSMap) {
                                            for (var prefix in localNSMap) {
                                                if (Object.prototype.hasOwnProperty.call(localNSMap, prefix)) {
                                                    domBuilder.endPrefixMapping(prefix)
                                                }
                                            }
                                        }
                                        if (!endMatch) {
                                            errorHandler.fatalError('end tag name: ' + tagName + ' is not match the current start tagName:' + config.tagName) // No known test case
                                        }
                                    } else {
                                        parseStack.push(config)
                                    }

                                    end++
                                    break
                                // end elment
                                case '?': // <?...?>
                                    locator && position(tagStart)
                                    end = parseInstruction(source, tagStart, domBuilder)
                                    break
                                case '!': // <!doctype,<![CDATA,<!--
                                    locator && position(tagStart)
                                    end = parseDCC(source, tagStart, domBuilder, errorHandler)
                                    break
                                default:
                                    locator && position(tagStart)
                                    var el = new ElementAttributes()
                                    var currentNSMap = parseStack[parseStack.length - 1].currentNSMap
                                    //elStartEnd
                                    var end = parseElementStartPart(source, tagStart, el, currentNSMap, entityReplacer, errorHandler)
                                    var len = el.length

                                    if (!el.closed && fixSelfClosed(source, end, el.tagName, closeMap)) {
                                        el.closed = true
                                        if (!entityMap.nbsp) {
                                            errorHandler.warning('unclosed xml attribute')
                                        }
                                    }
                                    if (locator && len) {
                                        var locator2 = copyLocator(locator, {})
                                        //try{//attribute position fixed
                                        for (var i = 0; i < len; i++) {
                                            var a = el[i]
                                            position(a.offset)
                                            a.locator = copyLocator(locator, {})
                                        }
                                        domBuilder.locator = locator2
                                        if (appendElement(el, domBuilder, currentNSMap)) {
                                            parseStack.push(el)
                                        }
                                        domBuilder.locator = locator
                                    } else {
                                        if (appendElement(el, domBuilder, currentNSMap)) {
                                            parseStack.push(el)
                                        }
                                    }

                                    if (NAMESPACE.isHTML(el.uri) && !el.closed) {
                                        end = parseHtmlSpecialContent(source, end, el.tagName, entityReplacer, domBuilder)
                                    } else {
                                        end++
                                    }
                            }
                        } catch (e) {
                            if (e instanceof ParseError) {
                                throw e
                            }
                            errorHandler.error('element parse error: ' + e)
                            end = -1
                        }
                        if (end > start) {
                            start = end
                        } else {
                            //TODO: 这里有可能sax回退，有位置错误风险
                            appendText(Math.max(tagStart, start) + 1)
                        }
                    }
                }

                function copyLocator(f, t) {
                    t.lineNumber = f.lineNumber
                    t.columnNumber = f.columnNumber
                    return t
                }

                /**
                 * @see #appendElement(source,elStartEnd,el,selfClosed,entityReplacer,domBuilder,parseStack);
                 * @return end of the elementStartPart(end of elementEndPart for selfClosed el)
                 */
                function parseElementStartPart(source, start, el, currentNSMap, entityReplacer, errorHandler) {
                    /**
                     * @param {string} qname
                     * @param {string} value
                     * @param {number} startIndex
                     */
                    function addAttribute(qname, value, startIndex) {
                        if (el.attributeNames.hasOwnProperty(qname)) {
                            errorHandler.fatalError('Attribute ' + qname + ' redefined')
                        }
                        el.addValue(
                            qname,
                            // @see https://www.w3.org/TR/xml/#AVNormalize
                            // since the xmldom sax parser does not "interpret" DTD the following is not implemented:
                            // - recursive replacement of (DTD) entity references
                            // - trimming and collapsing multiple spaces into a single one for attributes that are not of type CDATA
                            value.replace(/[\t\n\r]/g, ' ').replace(/&#?\w+;/g, entityReplacer),
                            startIndex
                        )
                    }

                    var attrName
                    var value
                    var p = ++start
                    var s = S_TAG //status
                    while (true) {
                        var c = source.charAt(p)
                        switch (c) {
                            case '=':
                                if (s === S_ATTR) {
                                    //attrName
                                    attrName = source.slice(start, p)
                                    s = S_EQ
                                } else if (s === S_ATTR_SPACE) {
                                    s = S_EQ
                                } else {
                                    //fatalError: equal must after attrName or space after attrName
                                    throw new Error('attribute equal must after attrName') // No known test case
                                }
                                break
                            case "'":
                            case '"':
                                if (
                                    s === S_EQ ||
                                    s === S_ATTR //|| s == S_ATTR_SPACE
                                ) {
                                    //equal
                                    if (s === S_ATTR) {
                                        errorHandler.warning('attribute value must after "="')
                                        attrName = source.slice(start, p)
                                    }
                                    start = p + 1
                                    p = source.indexOf(c, start)
                                    if (p > 0) {
                                        value = source.slice(start, p)
                                        addAttribute(attrName, value, start - 1)
                                        s = S_ATTR_END
                                    } else {
                                        //fatalError: no end quot match
                                        throw new Error("attribute value no end '" + c + "' match")
                                    }
                                } else if (s == S_ATTR_NOQUOT_VALUE) {
                                    value = source.slice(start, p)
                                    addAttribute(attrName, value, start)
                                    errorHandler.warning('attribute "' + attrName + '" missed start quot(' + c + ')!!')
                                    start = p + 1
                                    s = S_ATTR_END
                                } else {
                                    //fatalError: no equal before
                                    throw new Error('attribute value must after "="') // No known test case
                                }
                                break
                            case '/':
                                switch (s) {
                                    case S_TAG:
                                        el.setTagName(source.slice(start, p))
                                    case S_ATTR_END:
                                    case S_TAG_SPACE:
                                    case S_TAG_CLOSE:
                                        s = S_TAG_CLOSE
                                        el.closed = true
                                    case S_ATTR_NOQUOT_VALUE:
                                    case S_ATTR:
                                        break
                                    case S_ATTR_SPACE:
                                        el.closed = true
                                        break
                                    //case S_EQ:
                                    default:
                                        throw new Error("attribute invalid close char('/')") // No known test case
                                }
                                break
                            case '': //end document
                                errorHandler.error('unexpected end of input')
                                if (s == S_TAG) {
                                    el.setTagName(source.slice(start, p))
                                }
                                return p
                            case '>':
                                switch (s) {
                                    case S_TAG:
                                        el.setTagName(source.slice(start, p))
                                    case S_ATTR_END:
                                    case S_TAG_SPACE:
                                    case S_TAG_CLOSE:
                                        break //normal
                                    case S_ATTR_NOQUOT_VALUE: //Compatible state
                                    case S_ATTR:
                                        value = source.slice(start, p)
                                        if (value.slice(-1) === '/') {
                                            el.closed = true
                                            value = value.slice(0, -1)
                                        }
                                    case S_ATTR_SPACE:
                                        if (s === S_ATTR_SPACE) {
                                            value = attrName
                                        }
                                        if (s == S_ATTR_NOQUOT_VALUE) {
                                            errorHandler.warning('attribute "' + value + '" missed quot(")!')
                                            addAttribute(attrName, value, start)
                                        } else {
                                            if (!NAMESPACE.isHTML(currentNSMap['']) || !value.match(/^(?:disabled|checked|selected)$/i)) {
                                                errorHandler.warning('attribute "' + value + '" missed value!! "' + value + '" instead!!')
                                            }
                                            addAttribute(value, value, start)
                                        }
                                        break
                                    case S_EQ:
                                        throw new Error('attribute value missed!!')
                                }
                                //			console.log(tagName,tagNamePattern,tagNamePattern.test(tagName))
                                return p
                            /*xml space '\x20' | #x9 | #xD | #xA; */
                            case '\u0080':
                                c = ' '
                            default:
                                if (c <= ' ') {
                                    //space
                                    switch (s) {
                                        case S_TAG:
                                            el.setTagName(source.slice(start, p)) //tagName
                                            s = S_TAG_SPACE
                                            break
                                        case S_ATTR:
                                            attrName = source.slice(start, p)
                                            s = S_ATTR_SPACE
                                            break
                                        case S_ATTR_NOQUOT_VALUE:
                                            var value = source.slice(start, p)
                                            errorHandler.warning('attribute "' + value + '" missed quot(")!!')
                                            addAttribute(attrName, value, start)
                                        case S_ATTR_END:
                                            s = S_TAG_SPACE
                                            break
                                        //case S_TAG_SPACE:
                                        //case S_EQ:
                                        //case S_ATTR_SPACE:
                                        //	void();break;
                                        //case S_TAG_CLOSE:
                                        //ignore warning
                                    }
                                } else {
                                    //not space
                                    //S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
                                    //S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
                                    switch (s) {
                                        //case S_TAG:void();break;
                                        //case S_ATTR:void();break;
                                        //case S_ATTR_NOQUOT_VALUE:void();break;
                                        case S_ATTR_SPACE:
                                            var tagName = el.tagName
                                            if (!NAMESPACE.isHTML(currentNSMap['']) || !attrName.match(/^(?:disabled|checked|selected)$/i)) {
                                                errorHandler.warning('attribute "' + attrName + '" missed value!! "' + attrName + '" instead2!!')
                                            }
                                            addAttribute(attrName, attrName, start)
                                            start = p
                                            s = S_ATTR
                                            break
                                        case S_ATTR_END:
                                            errorHandler.warning('attribute space is required"' + attrName + '"!!')
                                        case S_TAG_SPACE:
                                            s = S_ATTR
                                            start = p
                                            break
                                        case S_EQ:
                                            s = S_ATTR_NOQUOT_VALUE
                                            start = p
                                            break
                                        case S_TAG_CLOSE:
                                            throw new Error("elements closed character '/' and '>' must be connected to")
                                    }
                                }
                        } //end outer switch
                        //console.log('p++',p)
                        p++
                    }
                }

                /**
                 * @return true if has new namespace define
                 */
                function appendElement(el, domBuilder, currentNSMap) {
                    var tagName = el.tagName
                    var localNSMap = null
                    //var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
                    var i = el.length
                    while (i--) {
                        var a = el[i]
                        var qName = a.qName
                        var value = a.value
                        var nsp = qName.indexOf(':')
                        if (nsp > 0) {
                            var prefix = (a.prefix = qName.slice(0, nsp))
                            var localName = qName.slice(nsp + 1)
                            var nsPrefix = prefix === 'xmlns' && localName
                        } else {
                            localName = qName
                            prefix = null
                            nsPrefix = qName === 'xmlns' && ''
                        }
                        //can not set prefix,because prefix !== ''
                        a.localName = localName
                        //prefix == null for no ns prefix attribute
                        if (nsPrefix !== false) {
                            //hack!!
                            if (localNSMap == null) {
                                localNSMap = {}
                                //console.log(currentNSMap,0)
                                _copy(currentNSMap, (currentNSMap = {}))
                                //console.log(currentNSMap,1)
                            }
                            currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value
                            a.uri = NAMESPACE.XMLNS
                            domBuilder.startPrefixMapping(nsPrefix, value)
                        }
                    }
                    var i = el.length
                    while (i--) {
                        a = el[i]
                        var prefix = a.prefix
                        if (prefix) {
                            //no prefix attribute has no namespace
                            if (prefix === 'xml') {
                                a.uri = NAMESPACE.XML
                            }
                            if (prefix !== 'xmlns') {
                                a.uri = currentNSMap[prefix || '']

                                //{console.log('###'+a.qName,domBuilder.locator.systemId+'',currentNSMap,a.uri)}
                            }
                        }
                    }
                    var nsp = tagName.indexOf(':')
                    if (nsp > 0) {
                        prefix = el.prefix = tagName.slice(0, nsp)
                        localName = el.localName = tagName.slice(nsp + 1)
                    } else {
                        prefix = null //important!!
                        localName = el.localName = tagName
                    }
                    //no prefix element has default namespace
                    var ns = (el.uri = currentNSMap[prefix || ''])
                    domBuilder.startElement(ns, localName, tagName, el)
                    //endPrefixMapping and startPrefixMapping have not any help for dom builder
                    //localNSMap = null
                    if (el.closed) {
                        domBuilder.endElement(ns, localName, tagName)
                        if (localNSMap) {
                            for (prefix in localNSMap) {
                                if (Object.prototype.hasOwnProperty.call(localNSMap, prefix)) {
                                    domBuilder.endPrefixMapping(prefix)
                                }
                            }
                        }
                    } else {
                        el.currentNSMap = currentNSMap
                        el.localNSMap = localNSMap
                        //parseStack.push(el);
                        return true
                    }
                }

                function parseHtmlSpecialContent(source, elStartEnd, tagName, entityReplacer, domBuilder) {
                    if (/^(?:script|textarea)$/i.test(tagName)) {
                        var elEndStart = source.indexOf('</' + tagName + '>', elStartEnd)
                        var text = source.substring(elStartEnd + 1, elEndStart)
                        if (/[&<]/.test(text)) {
                            if (/^script$/i.test(tagName)) {
                                //if(!/\]\]>/.test(text)){
                                //lexHandler.startCDATA();
                                domBuilder.characters(text, 0, text.length)
                                //lexHandler.endCDATA();
                                return elEndStart
                                //}
                            } //}else{//text area
                            text = text.replace(/&#?\w+;/g, entityReplacer)
                            domBuilder.characters(text, 0, text.length)
                            return elEndStart
                            //}
                        }
                    }
                    return elStartEnd + 1
                }

                function fixSelfClosed(source, elStartEnd, tagName, closeMap) {
                    //if(tagName in closeMap){
                    var pos = closeMap[tagName]
                    if (pos == null) {
                        //console.log(tagName)
                        pos = source.lastIndexOf('</' + tagName + '>')
                        if (pos < elStartEnd) {
                            //忘记闭合
                            pos = source.lastIndexOf('</' + tagName)
                        }
                        closeMap[tagName] = pos
                    }
                    return pos < elStartEnd
                    //}
                }

                function _copy(source, target) {
                    for (var n in source) {
                        if (Object.prototype.hasOwnProperty.call(source, n)) {
                            target[n] = source[n]
                        }
                    }
                }

                function parseDCC(source, start, domBuilder, errorHandler) {
                    //sure start with '<!'
                    var next = source.charAt(start + 2)
                    switch (next) {
                        case '-':
                            if (source.charAt(start + 3) === '-') {
                                var end = source.indexOf('-->', start + 4)
                                //append comment source.substring(4,end)//<!--
                                if (end > start) {
                                    domBuilder.comment(source, start + 4, end - start - 4)
                                    return end + 3
                                } else {
                                    errorHandler.error('Unclosed comment')
                                    return -1
                                }
                            } else {
                                //error
                                return -1
                            }
                        default:
                            if (source.substr(start + 3, 6) == 'CDATA[') {
                                var end = source.indexOf(']]>', start + 9)
                                domBuilder.startCDATA()
                                domBuilder.characters(source, start + 9, end - start - 9)
                                domBuilder.endCDATA()
                                return end + 3
                            }
                            //<!DOCTYPE
                            //startDTD(java.lang.String name, java.lang.String publicId, java.lang.String systemId)
                            var matchs = split(source, start)
                            var len = matchs.length
                            if (len > 1 && /!doctype/i.test(matchs[0][0])) {
                                var name = matchs[1][0]
                                var pubid = false
                                var sysid = false
                                if (len > 3) {
                                    if (/^public$/i.test(matchs[2][0])) {
                                        pubid = matchs[3][0]
                                        sysid = len > 4 && matchs[4][0]
                                    } else if (/^system$/i.test(matchs[2][0])) {
                                        sysid = matchs[3][0]
                                    }
                                }
                                var lastMatch = matchs[len - 1]
                                domBuilder.startDTD(name, pubid, sysid)
                                domBuilder.endDTD()

                                return lastMatch.index + lastMatch[0].length
                            }
                    }
                    return -1
                }

                function parseInstruction(source, start, domBuilder) {
                    var end = source.indexOf('?>', start)
                    if (end) {
                        var match = source.substring(start, end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/)
                        if (match) {
                            var len = match[0].length
                            domBuilder.processingInstruction(match[1], match[2])
                            return end + 2
                        } else {
                            //error
                            return -1
                        }
                    }
                    return -1
                }

                function ElementAttributes() {
                    this.attributeNames = {}
                }

                ElementAttributes.prototype = {
                    setTagName: function (tagName) {
                        if (!tagNamePattern.test(tagName)) {
                            throw new Error('invalid tagName:' + tagName)
                        }
                        this.tagName = tagName
                    },
                    addValue: function (qName, value, offset) {
                        if (!tagNamePattern.test(qName)) {
                            throw new Error('invalid attribute:' + qName)
                        }
                        this.attributeNames[qName] = this.length
                        this[this.length++] = { qName: qName, value: value, offset: offset }
                    },
                    length: 0,
                    getLocalName: function (i) {
                        return this[i].localName
                    },
                    getLocator: function (i) {
                        return this[i].locator
                    },
                    getQName: function (i) {
                        return this[i].qName
                    },
                    getURI: function (i) {
                        return this[i].uri
                    },
                    getValue: function (i) {
                        return this[i].value
                    }
                    //	,getIndex:function(uri, localName)){
                    //		if(localName){
                    //
                    //		}else{
                    //			var qName = uri
                    //		}
                    //	},
                    //	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
                    //	getType:function(uri,localName){}
                    //	getType:function(i){},
                }

                function split(source, start) {
                    var match
                    var buf = []
                    var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g
                    reg.lastIndex = start
                    reg.exec(source) //skip <
                    while ((match = reg.exec(source))) {
                        buf.push(match)
                        if (match[1]) return buf
                    }
                }

                exports.XMLReader = XMLReader
                exports.ParseError = ParseError
            },
            { './conventions': 5 }
        ]
    }
    return r(utils, {}, [9])
}