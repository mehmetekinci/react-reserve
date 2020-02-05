import jwt from 'jsonwebtoken';
import Rating from '../../models/Rating';
import Product from '../../models/Product';
import connectDb from '../../utils/connectDb';
import mongoose from 'mongoose';

connectDb();

export default async (req, res) => {
  switch (req.method) {
    case 'POST':
      await handlePostRequest(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
  }
};

async function handlePostRequest(req, res) {
  const { productId, rating, userId } = req.body;
  if (!('authorization' in req.headers)) {
    return res.status(401).send('No authorization token');
  }

  try {
    let productRating;

    productRating = await Rating.findOneAndUpdate(
      {
        product: productId,
        user: userId,
      },
      { $set: { star: rating } },
      { new: true },
    );

    if (!productRating) {
      productRating = await new Rating({
        user: userId,
        product: productId,
        star: rating,
      }).save();
    }
    const { ratings } = await Product.findOneAndUpdate(
      { _id: productId },
      { $addToSet: { ratings: productRating._id } },
      { new: true },
    ).populate({
      path: 'ratings',
      model: Rating,
    });
    return res.status(200).json(ratings);
  } catch (error) {
    console.error(error);
  }
}
