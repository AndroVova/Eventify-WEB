import { createAction, createReducer } from "@reduxjs/toolkit";

import defaultImage from "../resources/default.png";

const storageName = 'auth';


let data = JSON.parse(localStorage.getItem(storageName));

if (data && Date.now() > data.tokenExpirationTime) {
    data = null;
    localStorage.removeItem(storageName);
}

const initialState = {
    user: {
        email: data?.user?.email || '',
        password: data?.user?.password || '',
        img: data?.user?.img === null || data?.user?.img === undefined ? defaultImage : data?.user?.img,
        name: data?.user?.userName || '',
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
