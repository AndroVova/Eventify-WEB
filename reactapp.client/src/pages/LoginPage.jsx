import { fetchToken, fetchUser } from "../clients/auth.client";

import { Login } from "../components/auth/Login/Login";
import { login } from "../reducers/auth.reducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const LoginPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <form onSubmit={e => handleSubmit(e, dispatch, navigate, t)}>
            <Login />
        </form>
    );
}

async function handleSubmit(e, dispatch, navigate, t) {
    e.preventDefault();
    const userForm = new FormData(e.target);

    const email = userForm.get('email');
    const password = userForm.get('password');

    const loginData = {
        email: email,
        password: password
    };

    const tokenRespone = await fetchToken(loginData)
    const token = tokenRespone.token;
    if (token === undefined) {
        alert(t("Incorrect e-mail address and (or) password."));
        return;
    }

    const user = await fetchUser(token, loginData)
    dispatch(login(user, token));
    navigate('/map', { replace: true });
}
