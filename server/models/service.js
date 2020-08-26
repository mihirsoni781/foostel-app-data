const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const serviceSchema = new Schema({
    s_ownerId: String,
    s_name: String,
    s_type: String,
    s_coords: Object,
    s_loc: Object,
    s_add: String,
    s_data: Object,
    s_currency: "",
    s_currency_symbol: "",
    dc:String,
    owner_contact: String,
    photos:[]
})
module.exports = mongoose.model('service', serviceSchema, 'services');  