import otpGenerator from "otp-generator";

let otpStore = {}; // temporary storage

let verifiedUsers = {}; // NEW
export { verifiedUsers };
// SEND OTP
export const sendOtp = async (req, res) => {
  const { phone } = req.body;

  const otp = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });

  otpStore[phone] = otp;

  console.log("OTP:", otp); // console me dikhega

  res.json({ message: "OTP sent" });
};


// VERIFY OTP
export const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (otpStore[phone] === otp) {
    delete otpStore[phone];

    verifiedUsers[phone] = true; // mark verified

    res.json({ message: "OTP verified" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
};