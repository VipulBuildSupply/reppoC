export class Category {
    
    code?: string;
    id?: number;
    imageUrl?: string;
    name?: string;
    categoryIdList?: SubCategories[];
    isSelected?: boolean;
    categoryId?: number;
    categoryName?: string;

    /*constructor({
        code = '',
        id = 0,
        imageUrl = '',
        name = '',
        categoryIdList = []
    }){
        this.code = code;
        this.id = id;
        this.imageUrl = imageUrl;
        this.name = name;
        this.categoryIdList = categoryIdList;
    }*/
}

class SubCategories extends Category{
    
    pid?: number;

    /*constructor(data){
        super(data);
        this.categoryIdList = [];
        this.pid = 0;
    }*/
}

export class SelectedCategoryIds{
    categoryId: number;
    categoryName: string;
    id: number;
    pid: number;
    name?: string;
    isSelected?: boolean;
}