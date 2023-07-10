import Place from "../models/placeBee.js";
import jwt from 'jsonwebtoken';

export const createPlace = async (req, res, next) => {
  const newPlace = new Place(req.body)
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_JWT);
  const userId=decodedToken.userId;
  // const { userId, userEmail } = decodedToken;
  if (userId === req.body.owner) {
    try {
      const savedPlace = await newPlace.save();
      res.status(200).json(savedPlace);
    } catch (err) {
      res.status(500).send({
        message: "Error create place",
        err,
      });
    }
  } else {
    res.status(401).send({ message: 'Unauthorized' });
  }

}

export const getPlace = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader) {
    const token = authorizationHeader.split(' ')[1];
    try {
      const decodedToken = jwt.verify(token, process.env.TOKEN_JWT);
      console.log(decodedToken);
      const { userId, userEmail } = decodedToken;
      // console.log('User ID:', userId);
      // console.log('User Email:', userEmail);

      const owner = req.params.id;
      if (userId !== owner) {
        return res.status(401).send({ message: 'not owner' });
      }
      const place = await Place.find({ owner: userId });
      res.status(200).json(place);
    } catch (err) {
      res.status(500).send({ message: 'Error get place', err });
    }
  } else {
    res.status(401).send({ message: 'Unauthorized' });
  }
};


export const deletePlace = async (req, res, next) => {
  try {
    await Place.findByIdAndDelete(req.params.id);
    res.status(200).json("Place sudah dihapus");
  } catch (err) {
    res.status(500).send({
      message: "Error delete place",
      err,
    });
  }
}