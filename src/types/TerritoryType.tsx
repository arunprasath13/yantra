// types/EntityTypes.ts
export interface TerritoryType {
    _id: string;
    code: string; 
    name: string; 
    district: string; 
    territoryManager: string; 
    longitude: string; 
    latitude: string; 
    createdBy: string; 
    createdOn: string; 
    status: boolean; 
    state:string,
    country:string
  }