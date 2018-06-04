export class SavedCity{
    name: string;
    id: string;
    sys : {country : string;};

    constructor(name: string, id: string) {
        this.name = name;
        this.id = id;
    }
}
//This object is for displaying and linking to the searched cities. It is used too for storing favourite cities.