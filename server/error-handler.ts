export default (error: any) => {
    console.error('[Custom Error Handler]', error?.stack || error)
  }