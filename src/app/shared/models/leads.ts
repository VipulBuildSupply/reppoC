export class Filters {
    locations: LocationsLists;
    categories: CategoriesLists;
}

export class LocationsLists{
    id: number;
    name: string;
    stateId: number;
    code: string;
    stateCode: string;
}

export class CategoriesLists{
    id: number;
    name: string;
    code: string;
    imageUrl: string;
    iconImageUrl: string;
    fullName: string;
    categoryList?: any[];
}