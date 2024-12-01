import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: "adminApi",
  tagTypes: [
    "User", "Products", "Customers", "Transactions", "Geography",
    "Sales", "Admins", "Performance", "Dashboard", "Banks", "Transactions", "Expances"
  ],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `general/user/${id}`,
      providesTags: ["User"],
    }),
    getProducts: build.query({
      query: () => "client/products",
      providesTags: ["Products"],
    }),
    getCustomers: build.query({
      query: () => "client/customers",
      providesTags: ["Customers"],
    }),
    getTransactions: build.query({
      query: ({ page, pageSize, sort, search }) => ({
        url: "client/transactions",
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Transactions"],
    }),
    getGeography: build.query({
      query: () => "client/geography",
      providesTags: ["Geography"],
    }),
    getSales: build.query({
      query: () => "sales/sales",
      providesTags: ["Sales"],
    }),
    getAdmins: build.query({
      query: () => "management/admins",
      providesTags: ["Admins"],
    }),
    getUserPerformance: build.query({
      query: (id) => `management/performance/${id}`,
      providesTags: ["Performance"],
    }),
    getDashboard: build.query({
      query: () => "general/dashboard",
      providesTags: ["Dashboard"],
    }),
    getBanksByCurrency: build.query({
      query: (currency) => `accounts/accountbycurrency/${currency}`,
      providesTags: ["Banks"],
    }),
    addBankAccount: build.mutation({
      query: (newAccount) => ({
        url: "accounts/addAccount",
        method: "POST",
        body: newAccount,
      }),
      invalidatesTags: ["Banks"],
    }),
    addDeposit: build.mutation({
      query: (depositData) => ({
        url: "accounts/deposit",
        method: "POST",
        body: depositData,
      }),
      invalidatesTags: ["Banks"],
    }),
    editAccount: build.mutation({
      query: ({ id, updatedData }) => ({
        url: `accounts/edit/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["Banks"],
    }),
    deleteAccount: build.mutation({
      query: (id) => ({
        url: `accounts/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banks"],
    }),
    addExpance: build.mutation({
      query: (AddExpanceData) => ({
        url: "accounts/addexpance",
        method: "POST",
        body: AddExpanceData,
      }),
      invalidatesTags: ["Banks"],
    }),
    addTransaction: build.mutation({
      query: (newTransaction) => ({
        url: "transactions/add",
        method: "POST",
        body: newTransaction,
      }),
      invalidatesTags: ["Transactions"],
    }),
    cancelTransaction: build.mutation({
      query: (id) => ({
        url: `transactions/cancel/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Transactions"],
    }),
    getAllCompletedTransactions: build.query({
      query: () => "transactions/completed",
      providesTags: ["Transactions"],
    }),
    getAllCanceledTransactions: build.query({
      query: () => "transactions/canceled",
      providesTags: ["Transactions"],
    }),
    getDoneTransactionByCheckInCurrency: build.query({
      query: (currency) => `transactions/done/${currency}`,
      providesTags: ["Transactions"],
    }),
    getCanceledTransactionByCheckInCurrency: build.query({
      query: (currency) => `transactions/canceled/${currency}`,
      providesTags: ["Transactions"],
    }),
    fetchTransactionCount: build.query({
      query: () => "transactions/count",
      providesTags: ["Transactions"],
    }),
    // get all expance data
    getExpanceData: build.query({
      query: () => `accounts/getexpance/`,
      providesTags: ["Expances"],
    }),
    // get all acount 
    getAllAccounts: build.query({
      query: () => "/accounts/allaccounts",
      providesTags: ["Banks"],
    }),
    // delete transaction
    deleteTransaction: build.mutation({
      query: (id) => ({
        url: `transactions/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transactions"],
    }),
    // update transaction
    updateTransaction: build.mutation({
      query: ({ id, updatedData }) => ({
        url: `transactions/update/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["Transactions"],
    }),
    // delete expance
    deleteExpance: build.mutation({
      query: (id) => ({
        url: `accounts/deleteExpance/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expances"],
    }),
    // update expance
    updateExpance: build.mutation({
      query: ({ id, updatedData }) => ({
        url: `accounts/updateExpance/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["Expances"],
    }),
  }), 
});

export const {
  useGetUserQuery,
  useGetProductsQuery,
  useGetCustomersQuery,
  useGetTransactionsQuery,
  useGetGeographyQuery,
  useGetSalesQuery,
  useGetAdminsQuery,
  useGetUserPerformanceQuery,
  useGetDashboardQuery,
  useGetBanksByCurrencyQuery,
  useAddBankAccountMutation,
  useAddDepositMutation,
  useEditAccountMutation,
  useDeleteAccountMutation,
  useAddExpanceMutation,
  useAddTransactionMutation,
  useCancelTransactionMutation,
  useGetAllCompletedTransactionsQuery,
  useGetAllCanceledTransactionsQuery,
  useGetDoneTransactionByCheckInCurrencyQuery,
  useGetCanceledTransactionByCheckInCurrencyQuery,
  useFetchTransactionCountQuery,
  useGetExpanceDataQuery,
  useGetAllAccountsQuery,
  useDeleteTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteExpanceMutation,
  useUpdateExpanceMutation,
} = api;