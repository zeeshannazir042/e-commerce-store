import { PRODUCT_URL, UPLOAD_URL } from "../constance";
import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get products with keyword
    getProducts: builder.query({
      query: (keyword = "") => ({
        url: `${PRODUCT_URL}`,
        method: "GET",
        params: keyword ? { keyword } : {},
      }),
      providesTags: ["Products"],
    }),

    // Get product by ID
    getProductById: builder.query({
      query: (id) => ({
        url: `${PRODUCT_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    // ✅ Product details (same as getProductById, but separate hook)
    getProductDetails: builder.query({
      query: (id) => ({
        url: `${PRODUCT_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    // Get all products
    getAllProducts: builder.query({
      query: () => ({
        url: `${PRODUCT_URL}/allProducts`,
        method: "GET",
      }),
      providesTags: ["Products"],
    }),

    // Create product
    createProduct: builder.mutation({
      query: (productData) => ({
        url: `${PRODUCT_URL}`,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Products"],
    }),

    // Update product
    updateProduct: builder.mutation({
      query: (formData) => ({
        url: `${PRODUCT_URL}/${formData.get("_id")}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),

    // Delete product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `${PRODUCT_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    // Upload product image
    uploadProductImage: builder.mutation({
      query: (formData) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),

    // Review product
    reviewProduct: builder.mutation({
      query: ({ id, review }) => ({
        url: `${PRODUCT_URL}/${id}/reviews`,
        method: "POST",
        body: review,
      }),
      invalidatesTags: ["Products"],
    }),

    // Top products
    getTopProducts: builder.query({
      query: () => ({
        url: `${PRODUCT_URL}/top`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),

    // New products
    getNewProducts: builder.query({
      query: () => ({
        url: `${PRODUCT_URL}/new`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),

    getFilteredProducts: builder.query({
  query: ({ checked = [], radio = [] }) => ({
    url: `${PRODUCT_URL}/filtered-products`,
    method: "POST",
    body: { checked, radio },
  }),
}),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductDetailsQuery,
  useGetAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useReviewProductMutation,
  useGetTopProductsQuery,
  useGetNewProductsQuery,
  useUploadProductImageMutation,
  useGetFilteredProductsQuery,
} = productApiSlice;
