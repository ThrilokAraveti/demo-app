import mongoose from "mongoose";

const StoreHoursSchema = new mongoose.Schema(
  {
    isOpen: {
      type: Boolean,
      default: true,
    },
    openTime: {
      type: String,
      default: "10:00",
    },
    closeTime: {
      type: String,
      default: "22:00",
    },
    breakStartTime: {
      type: String,
      default: "14:00",
    },
    breakEndTime: {
      type: String,
      default: "16:00",
    },
    hasBreak: {
      type: Boolean,
      default: false,
    },
    daysOpen: {
      type: [String],
      default: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.StoreHours ||
  mongoose.model("StoreHours", StoreHoursSchema);
