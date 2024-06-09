import { hash } from "bcryptjs";

export const hashPassword = async (password: string) => {
    const password_hash = await hash(password, 6);

    return password_hash;
}