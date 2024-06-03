import {SERVICE_URL} from "./app.const";
import axios from "axios";

const GET_TOKEN = SERVICE_URL + "/Auth/login";

const GET_PROFILE = SERVICE_URL + '/Profile/get-profile?id=';

export async function fetchToken(userForm){

    return axios
    .post(GET_TOKEN, userForm)
    .then((response) => {
        if (response.data) {
            sessionStorage.setItem("token", JSON.stringify(response.data));
        }

        return response.data;
    }).catch((error) => {
        console.error("Error while fetching profile:", error);
      });
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export async function fetchUser(token) {
    const decodedToken = parseJwt(token);
    const userId = decodedToken.Id;

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    return await axios.get(`${GET_PROFILE}${userId}`, config)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error("Error while fetching profile:", error);
        });
}