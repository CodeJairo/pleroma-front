export interface IJuridicalPersonEntity {
  businessName: string;
  businessDocumentNumber: string;
  name: string;
  documentType: string;
  documentNumber: string;
  expeditionAddress: string;
  birthDate: string;
  genre: Genre;
  address: string;
  phone: string;
  phone2?: string | null;
  email: string;
  bank: string 
  anotherBank?: string | null;
  accountType: BankAccountType;
  bankAccountNumber: string;
}

type Genre = 'M' | 'F';
type BankAccountType = 'AHORRO' | 'CORRIENTE';
