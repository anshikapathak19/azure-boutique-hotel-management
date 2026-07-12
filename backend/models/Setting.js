import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  globalBookingFee: {
    type: Number,
    default: 15,
  },
  taxRatePercent: {
    type: Number,
    default: 12,
  },
  allowInstantBookings: {
    type: Boolean,
    default: true,
  },
  enableEmailAlerts: {
    type: Boolean,
    default: true,
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Setting = mongoose.model('Setting', SettingSchema);
export default Setting;
