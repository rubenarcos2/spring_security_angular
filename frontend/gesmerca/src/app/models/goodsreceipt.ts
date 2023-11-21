import { Time } from '@angular/common';

export interface GoodsReceipt {
  id?: number;
  idsupplier?: number;
  supplierName?: string;
  iduser?: number;
  userName?: string;
  date?: Date;
  time?: Time;
  docnum?: string;
  isDeleting?: boolean;
}
