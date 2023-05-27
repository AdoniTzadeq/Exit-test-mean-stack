const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://learn:345learn7gbf@questions.ejkmam3.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const otpSchema = new mongoose.Schema({
  email: String,
  otp: String
});
const OTP = mongoose.model('OTP', otpSchema);

// Generate and send OTP
app.post('/send-otp', (req, res) => {
  const email = req.body.email;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP to MongoDB
  const newOTP = new OTP({ email, otp });
  newOTP.save();

  // Send OTP to the email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'neenamathew217@gmail.com',
        pass: 'tzqoqretqttqgtlz'
    }
  });

  const mailOptions = {
    from: 'neenamathew217@gmail.com',
    to: 'neenakulathinkal@gmail.com',
    subject: 'OTP Verification',
    text: `Your OTP is: ${otp}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Failed to send OTP');
    } else {
      res.status(200).send('OTP sent successfully');
    }
  });
});

// Verify OTP
app.post('/verify-otp', (req, res) => {
  const otp = req.body.otp;

  // Find OTP in MongoDB
  OTP.findOne({ otp }, (err, foundOTP) => {
    if (err) {
      console.log(err);
      res.status(500).send('Failed to verify OTP');
    } else if (foundOTP) {
      res.status(200).send('OTP verified successfully');
    } else {
      res.status(404).send('Invalid OTP');
    }
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
