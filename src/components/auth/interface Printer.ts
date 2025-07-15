interface PrinterSettings {
  temperature: {
    hotend: number;
    bed: number;
  };
  speeds: {
    print: number;
    travel: number;
  };
  filament: {
    type: string;
    diameter: number;
  };
}

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

export type { Printer, PrinterSettings };