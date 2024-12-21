import { AppDataSource} from "../database/data-source";
import { User } from "../entities/User"

const userRepository = AppDataSource.getRepository(User)

export const createUser = async (userData: Partial<User>) => {
    const user = userRepository.create(userData)
    await userRepository.save(user)
    return user
}

export const findUserByEmail = async (email: string) => {
    return await userRepository.findOne({ where: { email } })
}