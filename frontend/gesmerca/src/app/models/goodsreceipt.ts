import { Time } from '@angular/common';

export interface GoodsReceipt {
  id?: number;
  idSupplier?: number;
  supplierName?: string;
  idUser?: number;
  userName?: string;
  date?: Date;
  time?: Time;
  docnum?: string;
  isDeleting?: boolean;
}
