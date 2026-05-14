import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    restaurant: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    items: {
      type: [OrderItemSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
      default: "pending",
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    etaMinutes: {
      type: Number,
      min: 0,
      max: 180,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
