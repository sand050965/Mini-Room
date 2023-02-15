require("dotenv").config();
const express = require("express");
const mailService = require("../services/mailService");

module.exports = {
  sendInviteeEmail: async (req, res) => {
    try {
      const mailData = {
        senderName: req.body.senderName,
        recipientEmail: req.body.recipientEmail,
        roomLink: req.body.roomLink,
      };
      await mailService.sendEmail(mailData);
      res.status(200).json({ ok: true });
    } catch (e) {
      if (process.env.NODE_ENV !== "development") {
        console.log(e);
      }
      res
        .status(500)
        .json({ error: true, message: "Sorry, something went wrong!" });
    }
  },
};