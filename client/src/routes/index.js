import { createBrowserRouter } from "react-router-dom";
import App from "../App"
import RegisterPage from "../pages/RegisterPage";
import CheckEmailPage from "../pages/CheckEmailPage";
import CheckPasswordPage from "../pages/CheckPasswordPage";
import Home from "../pages/Home";
import MessagePage from "../Mycomponents/MessagePage";
import Forgotpassword from "../pages/Forgotpassword";



const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "register",
                element: <RegisterPage />
            },
            {
                path: "email",
                element: <CheckEmailPage />
            },
            {
                path: "password",
                element: <CheckPasswordPage />
            },
            {
                path: "forgot-password",
                element: <Forgotpassword />
            },
            {
                path: "",
                element: <Home />,
                children: [
                    {
                        path: ":userId",
                        element: <MessagePage />
                    }
                ]
            }

        ]

    }
])
export default router