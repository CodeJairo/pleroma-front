export interface IContractor {
  id: string;
  contractor: string;
  contractorDocument: string;
  expeditionAddress: string;
  birthDate: string;
  genre: Genre;
}

type Genre = 'M' | 'F';
