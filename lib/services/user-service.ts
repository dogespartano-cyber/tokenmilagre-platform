/** @deprecated Use @/lib/domains/users/services/user.service */
export * from '@/lib/domains/users/services/user.service';
export { userService as default } from '@/lib/domains/users/services/user.service';
// Re-export types and schemas that were previously bundled
export * from '@/lib/domains/users/types';
// Schemas should be imported from @/lib/schemas/user-schemas
// export * from '@/lib/domains/users/schemas/user.schema';
