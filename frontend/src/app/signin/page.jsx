'use client'
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-hot-toast";

// Validation Schema
const SigninSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required')
    .matches(/[a-z]/, 'Lowercase letter is required')
    .matches(/[A-Z]/, 'Uppercase letter is required')
    .matches(/[0-9]/, 'Number is required')
    .matches(/\W/, 'Special character is required')
    .min(6, 'Minimum 6 characters are required'),
});

// Formik Setup
const Signin = () => {
  const signinForm = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    
    // Send data to backend API
    validationSchema: SigninSchema,
    onSubmit: (values, { resetForm }) => {
      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, values)
        .then((response) => {
          toast.success(response?.data?.message || "Login successfully");

          localStorage.setItem("token", response.data.token); 

          const fullName = response.data.name || ""; 
  const [fName, ...lName] = fullName.trim().split(" ");

  localStorage.setItem("userInfo", JSON.stringify({
     name: response.data.name,
        email: response.data.email
      }));
      setTimeout(() => {
        window.location.href = "/"; 
      }, 1000);
          resetForm();
        })
    .catch((error) => {
      console.error(error);
      toast.error('Invalid email or password');
    });
}
    
  });
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-neutral-950">
      <div className="w-full max-w-md mt-7 bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Sign in
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Don't have an account?{" "}
              <a
                className="text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500"
                href="/createaccount"
              >
                Sign up here
              </a>
            </p>
          </div>

          <div className="mt-5">
            {/* Google Sign In */}
           <div className="mt-5">
  {/* Google Sign Up */}
  <button
    type="button"
    onClick={() => window.location.href = "https://accounts.google.com/"} // Replace with your own Google Auth link
    className="w-full py-3 px-4 cursor-pointer inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow hover:bg-gray-50 active:bg-gray-100 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 transition"
  >
    {/* Google Icon */}
    <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.5-34.1-4.4-50.4H272v95.4h147.4c-6.4 34.5-25.5 63.7-54.3 83.2v68h87.7c51.4-47.4 80.7-117.3 80.7-196.2z" />
      <path fill="#34A853" d="M272 544.3c73.5 0 135.1-24.3 180.1-65.9l-87.7-68c-24.4 16.4-55.6 26-92.4 26-71.1 0-131.4-47.9-153-112.3H27.7v70.6C72.3 482.1 166.5 544.3 272 544.3z" />
      <path fill="#FBBC05" d="M119 324.1c-10.5-31.4-10.5-65.6 0-97H27.7v-70.6C72.3 62.2 166.5 0 272 0c59.8 0 113.6 21.3 155.9 56.2l-87.7 68c-24.3-16.3-55.5-26-92.3-26-71.1 0-131.4 47.9-153 112.3z" />
      <path fill="#EA4335" d="M533.5 278.4c0-17.4-1.5-34.1-4.4-50.4H272v95.4h147.4c-6.4 34.5-25.5 63.7-54.3 83.2v68h87.7c51.4-47.4 80.7-117.3 80.7-196.2z" />
    </svg>
    <span>Sign up with Google</span>
  </button>

  {/* Divider */}
  <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
    Or
  </div>
</div>

            {/* Form */}
            <form onSubmit={signinForm.handleSubmit}>
              <div className="grid gap-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm mb-2 dark:text-white">Email address</label>
                  <input
                   type="email"
                   name="email"
                   placeholder="Enter your email"
                   value={signinForm.values.email}
                   onChange={signinForm.handleChange}
                   onBlur={signinForm.handleBlur}
                   className="py-2.5 sm:py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm sm:text-base placeholder:text-sm sm:placeholder:text-base focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                 />

                
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm mb-2 dark:text-white">Password</label>
                
                  <input
                   type="password"
                   name="password"
                   placeholder="Enter your password"
                   value={signinForm.values.password}
                   onChange={signinForm.handleChange}
                   onBlur={signinForm.handleBlur}
                   className="py-2.5 sm:py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm sm:text-base placeholder:text-sm sm:placeholder:text-base focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                  />
                  {signinForm.touched.email && signinForm.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{signinForm.errors.email}</p>
                  )}

                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input type="checkbox" className="shrink-0 mt-0.5 border-gray-200 rounded-sm text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700" />
                    <label className="ms-2 text-sm dark:text-white">Remember me</label>
                  </div>
                  <a href="/forgetpassword" className="text-sm text-blue-600 hover:underline dark:text-blue-500">
                    Forgot password?
                  </a>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 inline-flex cursor-pointer justify-center items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;