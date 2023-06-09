import { createEntityAdapter } from "@reduxjs/toolkit";
import apiSlice from "../api/apiSlice";

const campaignsAdapter = createEntityAdapter({});

const initialState = campaignsAdapter.getInitialState({});

export const campaignsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCampaigns: builder.query({
      query: (undefined) => ({
        url: `/campaigns/`,
        method: "GET",
        validateStatus: (response, result) => {
          return response.status === 200 && !result?.isError;
        },
      }),
      transformResponse: (responseData) => {
        if (responseData) {
          return campaignsAdapter.setAll(initialState, responseData);
        }
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Campaign", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Campaign", id })),
          ];
        } else return [{ type: "Campaign", id: "LIST" }];
      },
    }),
    addNewCampaign: builder.mutation({
      query: (campaign) => ({
        url: "/campaigns/",
        method: "POST",
        body: {
          ...campaign,
        },
      }),
      invalidatesTags: [{ type: "Campaign", id: "LIST" }],
    }),
  }),
});

export const { useGetCampaignsQuery, useAddNewCampaignMutation } = campaignsApiSlice;

export const { selectAll: selectAllCampaigns } = campaignsAdapter.getSelectors();
