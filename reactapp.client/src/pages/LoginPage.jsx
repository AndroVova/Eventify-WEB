import { fetchToken, fetchUser } from "../clients/auth.client";

import { Login } from "../components/auth/Login/Login";
import { login } from "../reducers/auth.reducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

//import Center from "../components/layout/Center/Center";


export const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <form onSubmit={e => handleSubmit(e, dispatch, navigate)}>
            <Login />
        </form>
    );
}

async function handleSubmit(e, dispatch, navigate) {
    e.preventDefault();
    const userForm = new FormData(e.target);

    const email = userForm.get('email');
    const password = userForm.get('password');

    const loginData = {
        email: email,
        password: password
    };

     const token = await fetchToken(loginData)
    // const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ2b3ZhQGdtYWlsLmNvbSIsInJvbGVzIjpbIlVTRVIiXSwiZXhwIjoxNzE0MDg4MTA0fQ.3MvLs2v_o5Ae8_PL2wdhnuu3AD9N4xXXmTN1yFHdElMTWkU2jm6k9v31HGtUdNLlSqm7sKnOXWfvOiP2MFl_CA";

    if (token === undefined) {
        alert("Incorrect e-mail address and (or) password.");
        return;
    }

    // const user = await fetchUser(token, loginData)
    const user = {
        ...loginData,
        image: "/static/media/1.42848f1e65ff889f9e2f.png",
    };
    
    dispatch(login(user, token));
    navigate('/map', { replace: true });
}
