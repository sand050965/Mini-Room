const multer = require("multer");

module.exports = {
	uploadAvatarImg: multer({
		limit: {
			fileSize: 1024 * 1024 * 5,
		},
		fileFilter(req, file, cb) {
			if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
				cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
			} else {
				cb(null, true);
			}
		},
	}),

	uploadFile: multer({
		fileFilter(req, file, cb) {
			if (!file) {
				cb(new Error("No file uploaded"), false);
			} else {
				cb(null, true);
			}
		},
	}),

	uploadErrorHandler: (error, req, res, next) => {
		if (error instanceof multer.MulterError) {
			switch (error.code) {
				case "LIMIT_FILE_SIZE":
					return res
						.status(400)
						.json({ error: true, message: "File is too large!" });
				case "LIMIT_UNEXPECTED_FILE":
					return res.status(400).json({
						error: true,
						message: "Only accept these file types: [jpg, jpeg, png]!",
					});
			}
		} else {
			return res.status(400).json({
				error: true,
				message: "No file uploaded!",
			});
		}
	},
};
