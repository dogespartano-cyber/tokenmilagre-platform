import 'next-auth';

// Define Role type locally to avoid import from Prisma stub
type Role = 'ADMIN' | 'EDITOR' | 'VIEWER';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: Role;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role: Role;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
  }
}
