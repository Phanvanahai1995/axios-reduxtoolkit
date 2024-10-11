import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";
// import Cookies from "js-cookie";

export const login = createAsyncThunk(
  "user-login",
  async (body, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", body);

      //   console.log(data);

      localStorage.setItem(
        "token",
        JSON.stringify({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
      );

      return fulfillWithValue({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

export const getProfile = createAsyncThunk(
  "get-user",
  async (token, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return fulfillWithValue(data);
    } catch (err) {
      const token = JSON.parse(localStorage.getItem("token"));

      const { data } = await api.post("/auth/refresh", {
        refreshToken: token.refreshToken,
        expiresInMins: 30,
      });

      //   console.log(data);

      if (data?.accessToken) {
        localStorage.removeItem("token");
        localStorage.setItem("token", JSON.stringify(data));
        const { data: newData } = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
          },
        });

        return fulfillWithValue(newData);
      }

      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: "",
    token: "" || JSON.parse(localStorage.getItem("token")),
    successMessage: "",
    errorMessage: "",
    loadingUser: false,
  },
  reducers: {
    clearMessage(state, _) {
      state.successMessage = "";
      state.errorMessage = "";
    },
  },
  extraReducers(builder) {
    builder.addCase(login.fulfilled, (state, action) => {
      state.successMessage = "Login successfully";
      state.token = action.payload;
    });
    builder.addCase(login.rejected, (state, _) => {
      state.errorMessage = "Email or password invalid";
    });
    builder.addCase(getProfile.pending, (state, _) => {
      state.loadingUser = true;
    });
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.loadingUser = false;
      state.user = action.payload;
    });
    builder.addCase(getProfile.rejected, (state, _) => {
      state.loadingUser = false;
      state.token = "";
      state.errorMessage = "Fetching User fail!";
    });
  },
});

export const { clearMessage } = authSlice.actions;

export default authSlice.reducer;
