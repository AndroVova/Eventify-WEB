import { createAction, createReducer } from "@reduxjs/toolkit";

const storageName = 'auth';
const defaultImage = "../resources/1.png";

let data = JSON.parse(localStorage.getItem(storageName));

if (data && Date.now() > data.tokenExpirationTime) {
    data = null;
    localStorage.removeItem(storageName);
}

const initialState = {
    user: {
        email: data?.user?.email || '',
        password: data?.user?.password || '',
        image: data?.user?.image || defaultImage,
    },
    tokenValue: data?.tokenValue || '',
    tokenExpirationTime: data?.tokenExpirationTime || 0,
};

export const login = createAction("LOGIN", (profile, token) => {
    const expirationTime = Date.now() + 3600000;
    return {
        payload: {
            user: profile,
            tokenValue: token,
            tokenExpirationTime: expirationTime,
        },
    };
});

export const logout = createAction("LOGOUT");

export const changeProfile = createAction("CHANGE_PROFILE", (d) => {
    return {
        payload: {
            user: d,
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

            console.log("Changing profile:", state);
            localStorage.setItem(storageName, JSON.stringify(state));
        })
        .addCase(updateUserImage, (state, action) => {
            if (state.user) {
                state.user.image = action.payload;
            }

            console.log("Updating user image:", state);
            localStorage.setItem(storageName, JSON.stringify(state));
        });
});
