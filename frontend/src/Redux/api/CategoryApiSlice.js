import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "../constance";

export const categoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => `${CATEGORY_URL}/categories`,
            keepUnusedDataFor: 5,
            providesTags: ['Category'],
        }),
        createCategory: builder.mutation({
            query: (data) => ({
                url: CATEGORY_URL,  
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Category'],
        }),
        updateCategory: builder.mutation({
            query: ({id, ...data}) => ({
                url: `${CATEGORY_URL}/${id}`,  
                method: 'PUT',  
                body: data,
            }),
            invalidatesTags: ['Category'],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `${CATEGORY_URL}/${id}`,  
                method: 'DELETE',  
            }),
            invalidatesTags: ['Category'],
        }),
    }),
});
export const {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApiSlice;