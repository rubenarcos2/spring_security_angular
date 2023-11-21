import { Role } from './role';
import { Permission } from './permission';

export interface User {
  id?: number;
  name?: string;
  email?: string;
  created_at?: Date;
  updated_at?: Date;
  email_verified_at?: Date;
  roles?: Role[];
  permissions?: Permission[];
}
