import Place from "../models/placeBee.js";

export const createPlace = async (req, res, next) =>{
    const newPlace = new Place(req.body)
    try{
        const savedPlace = await newPlace.save();
        res.status(200).json(savedPlace);
    }catch(err){
        res.status(500).send({
            message: "Error create place",
            err,
        });
    }
}

export const getPlace = async (req, res, next) =>{
    const owner = req.params.id
    try{
        const place = await Place.find({ owner: owner });
        res.status(200).json(place);
    }catch(err){
        res.status(500).send({
            message: "Error get place",
            err,
        });
    }
}

export const deletePlace = async (req, res, next) =>{
    try{
        await Place.findByIdAndDelete(req.params.id);
        res.status(200).json("Place sudah dihapus");
    }catch(err){
        res.status(500).send({
            message: "Error delete place",
            err,
        });
    }
}