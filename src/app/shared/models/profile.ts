export class ProfileSideBarMenus{
    name: string;
    link: string;
}

export class BusinessType{
    code: string;
    displayName: string;
}

export class Turnovers extends BusinessType{
    childList: any[];
    id: number;
    name: string;
    pid: number;
}