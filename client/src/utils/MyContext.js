import { createContext, useState } from "react";
import { roleSetter } from "./roleSetter";

const MyContext = createContext();

export default MyContext;

export const MyContextProvider = ({ children }) => {
    const [headerTitle, setHeaderTitle] = useState("");

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            return {
                user_id: "",
                user_name: "",
                r_data: "",
            };
        } else {
            const parsedUser = JSON.parse(storedUser);

            const role = roleSetter(parsedUser);

            const savedState = { ...parsedUser, r_data: role };

            return savedState;
        }
    });

    const updateTitle = (newValue) => {
        setHeaderTitle(newValue);
    };

    const updateUser = (newUser) => {
        const { user_name, role_id, user_id } = newUser;

        let range;
        let role;

        switch (role_id) {
            case "1":
                range = [575, 967];
                role = "admin";
                break;
            case "2":
                range = [158, 498];
                role = "receptionist";
                break;
            case "3":
                range = [1045, 1548];
                role = "doctor";
                break;
            default:
                range = [0, 90];
        }

        // Generate a random number within the specified range
        const randomNum =
            Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];

        const userData = {
            user_id: user_id,
            user_name: user_name,
            r_data: randomNum,
        };

        setUser({ ...userData, r_data: role });
        localStorage.setItem("user", JSON.stringify(userData));
    };

    return (
        <MyContext.Provider
            value={{
                user,
                headerTitle,
                updateUser,
                updateTitle,
            }}>
            {children}
        </MyContext.Provider>
    );
};
