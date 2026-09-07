const sendToken = (user) => {
	const token = user.getJwtToken();
	const options = {
		expires: new Date(
			Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
		sameSite: "None",
		secure: true,
	};
	return { token, options };
};

export default sendToken;
