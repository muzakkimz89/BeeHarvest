import mongoose from 'mongoose';

const harvestSchema = new mongoose.Schema({
    total: {
      type: Number,
      required: true
    },
    timestamp: {
        type: Number,
        required: true
    },
    boxId: {
      type: String,
      required: true
    },
    owner: {
      type: String,
      required: true
    },

  });
  
export default mongoose.model("Harvest", harvestSchema)