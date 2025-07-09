import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BackgroundState {
  imageUrl: string;
}

const initialState: BackgroundState = {
  imageUrl: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1744033332/ChatGPT_Image_19_44_47_7_thg_4_2025_ms7d1u.png",
};

const backgroundSlice = createSlice({
  name: "background",
  initialState,
  reducers: {
    updateBackgroundImage: (state, action: PayloadAction<string>) => {
      state.imageUrl = action.payload;
    },
  },
});

export const { updateBackgroundImage } = backgroundSlice.actions;
export default backgroundSlice.reducer;
