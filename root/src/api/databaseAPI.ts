import { userModel } from "../schema/cryptoSchema.js";
import User from "../interfaces/database-interface";

class DatabaseAPI {
    async createUser(userName: string) {
        const user = new userModel({
            userName,
            cryptos: [],
        } as User);

        const userExist = await userModel
            .exists({ userName })
            .then((res: boolean) => {
                if (!res) user.save();
                return res;
            });

        return userExist;
    }

    async getUser(userName: string) {
        const user = (await userModel.findOne({
            userName,
        })) as User;

        return user;
    }

    async updateUserData(userName: string, cryptos: string[]) {
        const user = await userModel.findOneAndUpdate({ userName }, { cryptos });
        return user;
    }
}

export { DatabaseAPI };
