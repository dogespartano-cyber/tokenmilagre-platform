/**
 * Web API Polyfills for Node.js/Jest environment
 * 
 * This file provides polyfills required by undici and MSW in the Jest environment.
 * It should be loaded as a setupFile (not setupFilesAfterEnv) to ensure 
 * polyfills are available before any imports.
 */

const { TextEncoder, TextDecoder } = require('util')
const { ReadableStream, WritableStream, TransformStream } = require('stream/web')
const { MessageChannel, MessagePort } = require('worker_threads')

// Text encoding polyfills
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Web Streams API polyfills (required by undici)
global.ReadableStream = ReadableStream
global.WritableStream = WritableStream
global.TransformStream = TransformStream

// MessageChannel/Port polyfills (required by undici)
global.MessageChannel = MessageChannel
global.MessagePort = MessagePort

// Fetch API polyfills using node-fetch (CJS compatible)
const nodeFetch = require('node-fetch')
global.fetch = nodeFetch.default || nodeFetch
global.Headers = nodeFetch.Headers
global.Request = nodeFetch.Request
global.Response = nodeFetch.Response
