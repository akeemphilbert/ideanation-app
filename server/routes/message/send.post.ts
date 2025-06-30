import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log(body)
  return {
    message: 'Hello, world!'
  }
})