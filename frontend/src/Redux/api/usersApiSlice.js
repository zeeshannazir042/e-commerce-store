import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constance";
import { logout } from "../features/auth/authSlice";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method: "POST",
                body: data,
            }),

        }),

        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: "POST",
            }),
        }),

        Register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: "POST",
                body: data,
            }),
        }),

        profile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: "PUT",
                body: data,
            }),
        }),

      // ✅ Get all users (admin protected)
    getUsers: builder.query({
      query: () => ({
        url: `${USERS_URL}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // ✅ Delete user by ID (admin protected)
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // ✅ Get user details by ID (admin protected)
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // ✅ Update user by ID (admin protected)
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${USERS_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
  }),
});




export const { useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useProfileMutation,
   useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,

} = userApiSlice;