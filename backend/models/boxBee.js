import mongoose from 'mongoose';

const boxSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    placeId: {
      type: String,
      required: true
    },
    owner: {
      type: String,
      required: true
    },
    desc: {
      type: String
    },
    totalHarvestAll: {
      type: Number
    },
    lastUpdate: {
      type: Number
    },
  });
  
export default mongoose.model("Box", boxSchema)