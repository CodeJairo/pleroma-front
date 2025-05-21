export interface INaturalPersonEntity {
  name: string;
  documentType: DocumentType;
  documentNumber: string;
  expeditionAddress: string;
  birthDate: string;
  genre: Genre;
  address: string;
  phone: string;
  phone2?: string | null;
  email: string;
  bank: string;
  anotherBank?: string | null;
  bankAccountNumber: string;
  accountType: BankAccountType;
}

type Genre = 'M' | 'F';
type BankAccountType = 'AHORRO' | 'CORRIENTE';
type DocumentType = 'CC' | 'CE' | 'PAS';
