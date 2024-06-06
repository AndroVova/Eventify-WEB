import { createAction, createReducer } from "@reduxjs/toolkit";

import defaultImage from "../resources/default.png";
import { parseJwt } from "../clients/auth.client";

const storageName = 'auth';

let data = JSON.parse(localStorage.getItem(storageName));

if (data && Date.now() > data.tokenExpirationTime) {
    console.error("Local Data is deleted");
    data = null;
}

let userRole = "";

if (data?.tokenValue) {
    const decodedToken = parseJwt(data?.tokenValue);
    if (decodedToken) {
        userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "";
    }
}

const initialState = {
    user: {
        email: data?.user?.email || '',
        password: data?.user?.password || '',
        img: data?.user?.img === null || data?.user?.img === undefined ? defaultImage : data?.user?.img,
        userName: data?.user?.userName || '',
        phoneNumber: data?.user?.phoneNumber || '',
        id: data?.user?.id || '',
        role: userRole,
        settings: data?.user?.settings || '',
        likedEvents: data?.user?.likedEvents || '',
        tags: data?.user?.tags || '',
    },
    tokenValue: data?.tokenValue || '',
    tokenExpirationTime: data?.tokenExpirationTime || 0,
};

export const login = createAction("LOGIN", (profile, token) => {
    const expirationTime = Date.now() + 3600000;
    return {
        payload: {
            user: {
                ...profile,
                img: profile.img === null || profile.img === undefined ? defaultImage : profile.img,
                role: parseJwt(token)["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
            },
            tokenValue: token,
            tokenExpirationTime: expirationTime,
        },
    };
});

export const logout = createAction("LOGOUT");

export const changeProfile = createAction("CHANGE_PROFILE", (d) => {
    return {
        payload: {
            user: {
                ...d,
                img: d.img === null || d.img === undefined ? defaultImage : d.img,
            },
        },
    };
});

export const updateUserImage = createAction("UPDATE_USER_IMAGE", (imageUrl) => {
    return {
        payload: imageUrl,
    };
});

export default createReducer(initialState, (builder) => {
    builder
        .addCase(login, (state, action) => {
            state.user = action.payload.user;
            state.tokenValue = action.payload.tokenValue;
            state.tokenExpirationTime = action.payload.tokenExpirationTime;

            localStorage.setItem(storageName, JSON.stringify(state));
        })
        .addCase(logout, (state) => {
            state.user = null;
            state.tokenValue = null;
            state.tokenExpirationTime = null;

            localStorage.clear();
        })
        .addCase(changeProfile, (state, action) => {
            state.user = { ...state.user, ...action.payload.user };

            localStorage.setItem(storageName, JSON.stringify(state));
        })
        .addCase(updateUserImage, (state, action) => {
            if (state.user) {
                state.user.img = action.payload;
            }

            localStorage.setItem(storageName, JSON.stringify(state));
        });
});
