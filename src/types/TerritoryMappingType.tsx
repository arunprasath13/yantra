// types/EntityTypes.ts
export interface TerritoryMappingType {
    _id: string;
    code: string; 
    name: string; 
    executive: string; 
    territoryManager: string; 
    createdBy: string; 
    createdOn: string; 
    fromDate: string;
    toDate: string;
    status: boolean; 
    state: string;
    country: string;
    district:string;
}
