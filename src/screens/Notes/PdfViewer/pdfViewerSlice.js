import { createSlice } from "@reduxjs/toolkit";

const PdfData = createSlice({
    name: "PdfData",
    initialState: {
        PdfData: [],
        downloadProgress: 0,
        downloads: [],
        isDownloading: false
    },
    reducers: {
        updateDownloadProgress: (state, action) => {
            state.downloadProgress = action.payload;
        },
        setDownloadProgress: () => {
            state.downloadProgress = 0;
        },
        setDownloads: (state, action) => {
            state.downloads = action.payload;
        },
        setIsDownloading: (state, action) => {
            state.isDownloading = action.payload;
        }
    }
})

export const { updateDownloadProgress, setDownloadProgress, setDownloads, setIsDownloading } = PdfData.actions

export default PdfData.reducer;