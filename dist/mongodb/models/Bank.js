"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bankSchema = new mongoose_1.Schema({
    items: {
        type: [
            {
                name: { type: String },
                stock: { type: Number },
                flavour_text: { type: String },
                cost: { type: Number },
                image: { type: String }
            }
        ]
    }
});
const Bank = mongoose_1.models.Bank || (0, mongoose_1.model)("Bank", bankSchema);
exports.default = Bank;
