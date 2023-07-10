import Box from "../models/boxBee.js";
import Place from "../models/placeBee.js";

export const createBox = async (req, res, next) => {
    const newBox = new Box(req.body);
    try {
      const savedBox = await newBox.save();
  
      // Count boxes with the same placeId
      const placeId = savedBox.placeId;
      const totalBox = await Box.countDocuments({ placeId: placeId });
  
      // Update totalBox in the corresponding Place schema
      await Place.updateOne({ _id: placeId }, { totalBox : totalBox });
  
      res.status(200).json(savedBox);
    } catch (err) {
      res.status(500).send({
        message: "Error creating Box",
        err,
      });
    }
  };
  

export const getBox = async (req, res, next) =>{
    const place = req.params.id
    try{
        //console.log("place id"+place);
        const boxes = await Box.find({ placeId: place });
        //console.log(boxes.length);
        res.status(200).json(boxes);
    }catch(err){
        res.status(500).send({
            message: "Error get Box",
            err,
        });
    }
}

export const getABox = async (req, res, next) => {
    const boxId = req.params.id;
    try {
      //console.log("boxId: " + boxId);
      const box = await Box.findOne({ _id: boxId });
      if (!box) {
        // If no box is found with the given boxId
        return res.status(404).json({ message: "Box not found" });
      }
      res.status(200).json(box);
    } catch (err) {
      res.status(500).send({
        message: "Error getting box",
        err,
      });
    }
  };

export const deleteBox = async (req, res, next) =>{
    try{
        //console.log("Are you sure you want to delete")
        await Box.findByIdAndDelete(req.params.id);
        res.status(200).json("Box sudah dihapus");
    }catch(err){
        res.status(500).send({
            message: "Error delete Box",
            err,
        });
    }
}