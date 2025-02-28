import cron from 'node-cron';
import User from '../../DB/models/user.model.js';


const cleanupOTP = cron.schedule('0 */6 * * *', async () => {
    try {
        const currentTime = new Date();
        const result = await User.updateMany(
            { 
                otpExpiry: { $lt: currentTime }
            },
            {
                $unset: { otp: 1, otpExpiry: 1 }
            }
        );
    } catch (error) {
        console.error('OTP cleanup failed:', error);
    }
});

export default cleanupOTP;