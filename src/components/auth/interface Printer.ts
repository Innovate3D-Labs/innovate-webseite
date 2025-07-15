interface Printer {
  id: string;
  serialNumber: string;
  model: string;
  firmware: string;
  status: 'online' | 'offline' | 'printing' | 'error';
  ownerId: string;
  sharedUsers: string[];
  settings: PrinterSettings;
}