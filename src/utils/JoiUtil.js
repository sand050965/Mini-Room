/** @format */

const Joi = require("joi");

module.exports = {
	roomIdSchema: Joi.object({
		roomId: Joi.string().required(),
	}),

	roomParticipantSchema: Joi.object({
		roomId: Joi.string().required(),
		participantId: Joi.string().required(),
	}),

	searchParticipantSchema: Joi.object({
		roomId: Joi.string().required(),
		participantName: Joi.string().max(20).required(),
	}),

	readyToJoinSchema: Joi.object({
		roomId: Joi.string().required(),
		participantId: Joi.string().required(),
		participantName: Joi.string().max(20).required(),
		avatarImgUrl: Joi.string().uri().required(),
		isMuted: Joi.boolean().required(),
		isStoppedVideo: Joi.boolean().required(),
	}),

	getUserSchema: Joi.object({
		email: Joi.string().required().email(),
	}),

	signupSchema: Joi.object({
		email: Joi.string().required().email(),
		password: Joi.string().min(6).max(30).required(),
		username: Joi.string().max(20).required(),
		avatarImgUrl: Joi.string().uri().required(),
	}),

	loginSchema: Joi.object({
		email: Joi.string().required().email(),
		password: Joi.string().min(6).max(30).required(),
	}),

	changeUserInfoSchema: Joi.object({
		email: Joi.string().required().email(),
		username: Joi.string().max(20).required(),
		avatarImgUrl: Joi.string().uri().required(),
	}),

	deleteAvatarSchema: Joi.object({
		avatarImgUrl: Joi.string().uri().required(),
	}),

	sendEmailSchema: Joi.object({
		senderName: Joi.string().required(),
		recipientEmailArray: Joi.array()
			.items(Joi.string().required().email())
			.required(),
		roomId: Joi.string().required(),
	}),
};
