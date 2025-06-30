
import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
    setResponseHeaders(event, {
        'Access-Control-Allow-Origin': '*', // Or specific origin
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      })
      return ''
})