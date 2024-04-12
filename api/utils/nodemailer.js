import nodemailer from "nodemailer";

const sendEmail = async (newUser, token) => {
  const url = `http://localhost:3000/api/auth/confirmation/${token}`;
  const output = `
		<p>Verify your email address for Estate Platform</p>
		<h3>Your sign up details are: </h3>
		<ul>
		<li>Username: ${newUser.username} </li>
		<li>Email: ${newUser.email} </li>
		</ul>
		<h3>Click on the following link to confirm your email:</h3>
		<p><a href="${url}">${url}</a></p>
		`;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_ACC,
      pass: process.env.GMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"Estates Platform" <hadi.main.acc@gmail.com>',
    to: `${newUser.email}`,
    subject: "Estates Platform: Confirm your Email",
    text: "Hello world?",
    html: output,
  });
  console.log(info);
  console.log("Message sent: %s", info.messageId);
  return `"Message sent: %s", ${info.messageId}`;
};

export default sendEmail;
