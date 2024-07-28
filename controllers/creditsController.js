import Users from "../models/usersModel.js";

export const getCreditsController = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).send({ message: "Email is not defined!" });
        }

        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(400).send({ message: "User not found in DB" });
        }

        if (!user.isVerified) {
            return res.status(401).send({ message: "User is not verified" });
        }

        // If user is verified and found
        return res.status(200).send({
            message: "User found successfully",
            credits: user.credits,
            userName: user.userName
        });

    } catch (error) {
        console.error("Error in getCreditsController:", error);
        return res.status(500).send({ message: "Error while finding user", error });
    }
};
