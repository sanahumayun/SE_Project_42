const mongoose = require('mongoose');
const { Schema } = mongoose;

const badgeSchema = new Schema({
  name:        { type: String, required: true },    
  course:      { type: Schema.Types.ObjectId,        
                 ref: 'Course', required: true },
  threshold:   { type: Number, required: true, default : 70 },    
  iconUrl:     String,                          
  awardedTo:   [{ type: Schema.Types.ObjectId, ref: 'User' }], // student IDs
  awardedAt:   [{ type: Date }]                     // matching award timestamps
}, { timestamps: true });

module.exports = mongoose.model('Badge', badgeSchema);