// file: ~/next-auth.d.ts
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /* Returned by `useAuth`, `getSession` and `getServerSession` */
  interface Session extends DefaultSession {
    user: {
        id: number
        firstName: string
        lastName: string
        birthDate: Date
        employeeId: string
        salary: number
        role: string
        manager: string
        joiningDate: Date
        leaveDays: number
        linkedIn: string
        orgId: string
        email: string
        password: string
        hierarchyId: string
        bio: string
    }
  }
}