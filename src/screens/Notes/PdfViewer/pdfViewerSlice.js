import { createSlice } from "@reduxjs/toolkit";

const PdfData = createSlice({
    name: "PdfData",
    initialState: {
        PdfData: [],
        downloadProgress: [],
        downloads: [],
        isDownloading: false,
        downloadingList: [],
        updateState: false
    },
    reducers: {
        updateDownloadProgress: (state, action) => {
            state.downloadProgress = action.payload;
        },
        setDownloadProgress: (state) => {
            state.downloadProgress = 0;
        },
        setDownloads: (state, action) => {
            state.downloads = action.payload;
        },
        setIsDownloading: (state, action) => {
            state.isDownloading = action.payload;
        },
        addItemToDownloadingList: (state, action) => {
            state.downloadingList.push(action.payload);
        },
        updateDownloadProgress: (state, action) => {
            const { url, progress } = action.payload;
            const itemIndex = state.downloadingList.findIndex(item => item.url === url);
            if (itemIndex !== -1) {
                state.downloadingList[itemIndex].progress = progress;
            }
        },
        removeItemFromDownloadingList: (state, action) => {
            const url = action.payload;
            const itemIndex = state.downloadingList.findIndex(item => item.url === url);
            if (itemIndex !== -1) {
                state.downloadingList.splice(itemIndex, 1);
            }
        }
    }
})

export const { updateDownloadProgress, setDownloadProgress, setDownloads, setIsDownloading, addItemToDownloadingList, removeItemFromDownloadingList } = PdfData.actions

export default PdfData.reducer;