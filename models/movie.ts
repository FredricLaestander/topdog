import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: String,
    plot: String,
    runtime: Number,
    year: Number,
  },
  { collection: "movies" }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
