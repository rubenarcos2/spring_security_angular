export interface Supplier {
  id?: number;
  cif_nif?: string;
  name?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  web?: string;
  notes?: Text;
  isDeleting?: boolean;
}
