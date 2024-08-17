// file: ~/next-auth.d.ts
import type { DefaultSession } from 'next-auth'
import type { Employee } from '~/interfaces/Employee'

declare module 'next-auth' {
  /* Returned by `useAuth`, `getSession` and `getServerSession` */
  interface Session extends DefaultSession {
    user : Employee
  }
}