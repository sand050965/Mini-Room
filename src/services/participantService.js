const Participant = require("../models/Participant");

module.exports = {
  getParticipantById: (dataId) => {
    return Participant.findById(dataId);
  },

  getAllParticipants: (roomId) => {
    return Participant.find({ roomId: roomId });
  },

  getParticipant: (data) => {
    return Participant.findOne({ roomId: data.roomId, userId: data.userId });
  },

  insertParticipant: async (data) => {
    const participant = new Participant({
      roomId: data.roomId,
      userId: data.userId,
      userName: data.userName,
      isMuted: data.isMuted,
      isStoppedVideo: data.isStoppedVideo,
      isReadyState: data.isReadyState,
    });
    return await participant.save();
  },

  deleteParticipant: async (data) => {
    await Participant.findOneAndRemove({
      roomId: data.roomId,
      userId: data.userId,
    });
  },

  deleteAllParticipants: async (data) => {
    await Participant.deleteOne({
      roomId: data.roomId,
    });
  },
};