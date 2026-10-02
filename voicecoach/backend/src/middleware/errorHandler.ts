import type { NextFunction, Request, Response } from 'express'

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` })
}

export const errorHandler = (error: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', error.message)
  res.status(500).json({ success: false, message: 'Internal server error', error: error.message })
}
