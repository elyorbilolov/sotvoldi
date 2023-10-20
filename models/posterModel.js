const { Schema, model } = require("mongoose");

const posterSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      min: 50,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    visits: {
      type: Number,
      default: 1,
    },
    category: {
      type: String,
      required: true,
      enum: ["realty", "transport", "electronics", "jobs"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

posterSchema.statics = {
  searchPartial: function (q) {
    return this.find({
      $or: [
        { title: new RegExp(q, "gi") },
        { description: new RegExp(q, "gi") },
      ],
    });
  },
};

module.exports = model("Poster", posterSchema);
