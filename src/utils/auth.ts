import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
    // Hash Password
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
}

export const checkPassword = async (enteredPassword: string, storedHash: string) => {
    return await bcrypt.compare(enteredPassword, storedHash);
}