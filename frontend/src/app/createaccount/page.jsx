'use client';
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";

const CreateAccount = () => {
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
      terms: Yup.boolean()
        .oneOf([true], "You must accept the terms and conditions")
        .required("You must accept the terms and conditions"),
    }),
    onSubmit: (values) => {
      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/register`, {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password
      })
      .then((response) => {
        if (response.status === 201 || response.status === 200) {
          toast.success(response?.data?.message || "Account created successfully");
        } else {
          toast.error(response?.data?.message || "Error creating account");
        }
      })
      .catch((error) => {
        const message = error.response?.data?.message || "Error creating account";
        toast.error(message);
      });
    }
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-neutral-950 p-4 ">
      <div className="w-full max-w-md my-4 sm:my-8 bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-900 dark:border-neutral-700 transition-all">
        <div className="p-5 sm:p-7">
          <div className="text-center">
            <h1 className="block text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
              Create an Account
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Already have an account?{" "}
              <a
                className="text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500 whitespace-nowrap"
                href="/signin"
              >
                Sign in here
              </a>
            </p>
          </div>

          <div className="mt-5">
            {/* Google Sign Up Button */}
            <button
              type="button"
              onClick={() => window.location.href = "https://accounts.google.com/"} 
              className="w-full py-2.5 px-4 cursor-pointer inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 active:bg-gray-100 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 transition-all min-h-[44px]"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.5-34.1-4.4-50.4H272v95.4h147.4c-6.4 34.5-25.5 63.7-54.3 83.2v68h87.7c51.4-47.4 80.7-117.3 80.7-196.2z" />
                <path fill="#34A853" d="M272 544.3c73.5 0 135.1-24.3 180.1-65.9l-87.7-68c-24.4 16.4-55.6 26-92.4 26-71.1 0-131.4-47.9-153-112.3H27.7v70.6C72.3 482.1 166.5 544.3 272 544.3z" />
                <path fill="#FBBC05" d="M119 324.1c-10.5-31.4-10.5-65.6 0-97H27.7v-70.6C72.3 62.2 166.5 0 272 0c59.8 0 113.6 21.3 155.9 56.2l-87.7 68c-24.3-16.3-55.5-26-92.3-26-71.1 0-131.4 47.9-153 112.3z" />
                <path fill="#EA4335" d="M533.5 278.4c0-17.4-1.5-34.1-4.4-50.4H272v95.4h147.4c-6.4 34.5-25.5 63.7-54.3 83.2v68h87.7c51.4-47.4 80.7-117.3 80.7-196.2z" />
              </svg>
              <span className="text-sm">Sign up with Google</span>
            </button>

            {/* Divider Typography */}
            <div className="py-4 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
              Or
            </div>

            {/* Account Creation Form */}
            <form onSubmit={formik.handleSubmit} noValidate>
              <div className="space-y-4">
                
                {/* Name Layout Row */}
                <div>
                  <label className="block text-sm font-medium mb-1.5 dark:text-white">Name</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        autoComplete="given-name"
                        {...formik.getFieldProps("firstName")}
                        className={`py-2.5 px-4 border ${formik.touched.firstName && formik.errors.firstName
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        } rounded-lg w-full text-sm outline-none bg-transparent transition dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300`}
                      />
                      {formik.touched.firstName && formik.errors.firstName && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        autoComplete="family-name"
                        {...formik.getFieldProps("lastName")}
                        className={`py-2.5 px-4 border ${formik.touched.lastName && formik.errors.lastName
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        } rounded-lg w-full text-sm outline-none bg-transparent transition dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300`}
                      />
                      {formik.touched.lastName && formik.errors.lastName && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.lastName}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1.5 dark:text-white">Email address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    {...formik.getFieldProps("email")}
                    className={`py-2.5 px-4 block w-full border ${formik.touched.email && formik.errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    } rounded-lg text-sm outline-none bg-transparent transition dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300`}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.email}</p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-1.5 dark:text-white">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    autoComplete="new-password"
                    {...formik.getFieldProps("password")}
                    className={`py-2.5 px-4 block w-full border ${formik.touched.password && formik.errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    } rounded-lg text-sm outline-none bg-transparent transition dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300`}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5 dark:text-white">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    autoComplete="new-password"
                    {...formik.getFieldProps("confirmPassword")}
                    className={`py-2.5 px-4 block w-full border ${formik.touched.confirmPassword && formik.errors.confirmPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    } rounded-lg text-sm outline-none bg-transparent transition dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300`}
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms and Conditions Checkbox Wrapper */}
                <div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5 mt-0.5">
                      <input
                        type="checkbox"
                        id="terms"
                        name="terms"
                        {...formik.getFieldProps("terms")}
                        className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 cursor-pointer h-4 w-4"
                      />
                    </div>
                    <label htmlFor="terms" className="ms-3 text-sm text-gray-600 dark:text-neutral-400 cursor-pointer select-none">
                      I accept the{" "}
                      <a href="#" className="text-blue-600 hover:underline font-medium dark:text-blue-500">
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                  {formik.touched.terms && formik.errors.terms && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.terms}</p>
                  )}
                </div>

                {/* Account Submit Processing Action */}
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="w-full mt-2 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer transition-all min-h-[46px] shadow-sm"
                >
                  {formik.isSubmitting ? "Creating account..." : "Create account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;