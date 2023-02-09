const express = require("express");
const Joi = require("joi");

const roomIdSchema = Joi.object({
  roomId: Joi.string().required(),
});

const roomIdAndUserIdSchema = Joi.object({
  roomId: Joi.string().required(),
  participantId: Joi.string().required(),
});

module.exports = {
  getRoomValidator: (req, res, next) => {
    const data = { roomId: req.params.roomId };

    const { error, value } = roomIdSchema.validate(data, { abortEarly: false });

    if (error) {
      console.log(error);
      return res.status(400).send(error.details[0].message);
    }

    next();
  },

  closeRoomValidator: (req, res, next) => {
    const data = { roomId: req.body.roomId };

    const { error, value } = roomIdSchema.validate(data, { abortEarly: false });

    if (error) {
      console.log(error);
      return res.status(400).send(error.details[0].message);
    }

    next();
  },

  getParticipantValidator: (req, res, next) => {
    const data = {
      roomId: req.params.roomId,
      participantId: req.params.participantId,
    };

    const { error, value } = roomIdAndUserIdSchema.validate(data, {
      abortEarly: false,
    });

    if (error) {
      console.log(error);
      return res.status(400).send(error.details[0].message);
    }

    next();
  },

  participantLeaveValidator: (req, res, next) => {
    const data = {
      roomId: req.body.roomId,
      participantId: req.body.participantId,
    };

    const { error, value } = roomIdAndUserIdSchema.validate(data, {
      abortEarly: false,
    });

    if (error) {
      console.log(error);
      return res.status(400).send(error.details[0].message);
    }

    next();
  },
};
