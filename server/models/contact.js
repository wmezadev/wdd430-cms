const mongoose = require('mongoose');

const contactSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, default: null },
    phone: { type: String, required: true, default: null },
    imageUrl: { type: String, default: null },
    group: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }]
});

module.exports = mongoose.model('Contact', contactSchema);
