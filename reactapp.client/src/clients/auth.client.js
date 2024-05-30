import {SERVICE_URL} from "./app.const";
import axios from "axios";

const GET_TOKEN = SERVICE_URL + "/Auth/login";

const GET_PROFILE = SERVICE_URL + '/profile/username/';

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

export async function fetchUser(token, userForm){
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    return await axios.get(GET_PROFILE + userForm.email, config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error while fetching profile:", error);
    });
}