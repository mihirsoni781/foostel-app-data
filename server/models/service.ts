
export class Service {
    s_ownerId:String;
    s_name: String;
    s_type: String;
    s_coords:Object;
    s_loc: Object;
    s_add: String;
    s_data: Object;
    s_currency:"";
    s_currency_symbol:null;
    dc: String;
    owner_contact: String;


    constructor(type:String){
        this.s_type=type;
    }
}
