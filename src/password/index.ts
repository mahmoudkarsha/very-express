const bcrypt = require('bcryptjs');

class PasswordService {
    public static async hashAnsSalt(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword: string = await bcrypt.hash(password, salt);
        return hashedPassword;
    }

    public static async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}

export { PasswordService };
