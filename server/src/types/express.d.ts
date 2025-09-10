// Add this type declaration file
// filepath: c:\backed2025\tsBackend\server\src\types\express.d.ts
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        username?: string;
      }
    }
  }
}

export {};