export function createErrorResponse(message: string, status = 400) {
  return new Response(message, { status, statusText: message })
}
