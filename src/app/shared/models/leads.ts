export class Filters {
    locations?: LocationsLists[];
    categories?: CategoriesLists[];
}

export class FilterList {
    id: number;
    name: string;
    code: string;
    type?: string;
    selected?: boolean;
}

export class LocationsLists extends FilterList{
    stateCode: string;
    stateId: number;
}

export class CategoriesLists extends FilterList{
    imageUrl: string;
    iconImageUrl: string;
    fullName: string;
    categoryList?: any[];
}

export interface UpdatedData{
    data:LocationsLists[] | CategoriesLists[];
     type:string
  }