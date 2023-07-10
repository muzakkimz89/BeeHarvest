import Harvest from "../models/harvest.js";
import Box from "../models/boxBee.js";

export const createHarvest = async (req, res, next) =>{
    const newHarvest = new Harvest(req.body)
    //newHarvest.timestamp = new Date()
    //console.log(newHarvest);
    try{
        const savedHarvest = await newHarvest.save();

        const boxId = newHarvest.boxId;
        const timestamp = newHarvest.timestamp;
        await Box.updateOne(
            { _id: boxId },
            { lastUpdate: timestamp }
        );

        // Count volumes with the same boxId
        const totalVolume = await Harvest.aggregate([
        {
            $match: { boxId }
        },
        {
            $group: {
            _id: null,
            totalVolume: { $sum: "$total" }
            }
        }
        ]);

        if (totalVolume.length > 0) {
        // Update totalVolume in the corresponding Box schema
            await Box.updateOne(
                { _id: boxId },
                { totalHarvestAll: totalVolume[0].totalVolume }
            );
        }
        res.status(200).json(savedHarvest);
    }catch(err){
        res.status(500).send({
            message: "Error create Harvest",
            err,
        });
    }
}

export const getHarvest = async (req, res, next) =>{
    const boxId = req.params.id
    try{
        //console.log("boxid"+boxId);
        const boxes = await Harvest.find({ boxId: boxId });
        res.status(200).json(boxes);
    }catch(err){
        res.status(500).send({
            message: "Error get harvest",
            err,
        });
    }
}

export const getLastHarvests = async (req, res, next) => {
    //console.log("lastharvests")
    try {
      const lastHarvests = await Harvest.aggregate([
        {
          $group: {
            _id: "$boxId",
            lastHarvest: { $last: "$$ROOT" } // Select the last document for each group
          }
        },
        {
          $replaceRoot: { newRoot: "$lastHarvest" } // Replace the root document with the selected last harvest document
        }
      ]);
  
      res.status(200).json(lastHarvests);
    } catch (err) {
      res.status(500).send({
        message: "Error fetching last harvests",
        err
      });
    }
  };

export const deleteHarvest = async (req, res, next) => {
    const harvestId = req.params.id;

    try {
        const boxes = await Harvest.findById(harvestId);
        const boxId = boxes.boxId
      const deletedHarvest = await Harvest.findByIdAndDelete(harvestId);
        //console.log("delete Boxid" + boxId);
  
      // Count volumes with the same boxId
      const totalVolume = await Harvest.aggregate([
        {
          $match: { boxId }
        },
        {
          $group: {
            _id: null,
            totalVolume: { $sum: "$total" }
          }
        }
      ]);
  
      const newTotalVolume = totalVolume.length > 0 ? totalVolume[0].totalVolume : 0;
  
      // Update totalVolume in the corresponding Box schema
      await Box.updateOne(
        { _id: boxId },
        { totalHarvestAll: newTotalVolume }
      );
  
      res.status(200).json("Harvest has been deleted");
    } catch (err) {
      res.status(500).send({
        message: "Error deleting Harvest",
        err,
      });
    }
  };
  