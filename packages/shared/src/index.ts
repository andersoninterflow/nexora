export type Role = 'USER' | 'ADMIN'

export type PublicUser = {
  id: string
  email: string
  name?: string | null
  role: Role
  createdAt?: string
}
