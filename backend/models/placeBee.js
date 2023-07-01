import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    owner: {
      type: String,
      required: true
    },
    totalBox: {
      type: String
    }
  });
  
  export default mongoose.model("Place", placeSchema)