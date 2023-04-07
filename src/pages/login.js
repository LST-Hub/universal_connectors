import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { getSession, signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import ParticlesAuth from "@/utils/ParticlesAuth";
import TkInput from "@/globalComponents/TkInput";
import TkLabel from "@/globalComponents/TkInput";
import TkRow, { TkCol } from "@/globalComponents/TkRow";
import TkCard, { TkCardBody } from "@/globalComponents/TkCard";
import TkContainer from "@/globalComponents/TkContainer";
import TkButton from "@/globalComponents/TkButton";
import TkPageHead from "@/globalComponents/TkPageHead";
import FormErrorText from "@/globalComponents/ErrorText";
import {
  API_BASE_URL,
  MaxEmailLength,
  MaxPasswordLength,
  MinEmailLength,
  MinPasswordLength,
} from "@/utils/Constants";
import {
  TkToastError,
  TkToastSuccess,
} from "@/globalComponents/TkToastContainer";
import GoogleLoginBtn from "@/globalComponents/googleLoginBtn";
import TkForm from "@/globalComponents/TkForm";
// import { ToastContainer, toast, Slide } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@tanstack/react-query";
import tkFetch from "@/utils/fetch";
import { AuthContext } from "@/utils/Contexts";
import useGlobalStore from "@/utils/globalStore";
// "use client";

// *** using firebase ***
import { app } from "../firebase";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Spinner } from "reactstrap";
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const schema = Yup.object({
  email: Yup.string()
    .email("Email must be valid.")
    .min(MinEmailLength, `Email must be at least ${MinEmailLength} characters.`)
    .max(MaxEmailLength, `Email must be at most ${MaxEmailLength} characters.`)
    .required("Email is required"),

  password: Yup.string()
    .min(
      MinPasswordLength,
      `Password should contain at least ${MinPasswordLength} character`
    )
    .max(
      MaxPasswordLength,
      `Password cannot contain more than ${MaxPasswordLength} character`
    )
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#^()+!%*?&])[A-Za-z\d@$#^()+!%*?&]{8,32}$/,
      "Password must have One Uppercase, One Lowercase, One Number and one Special Character. \n Special Characters can be on of @ $ # ^ ( ) + ! % * ? &"
    )
    .required("Password is required"),

  // rememberMe: Yup.boolean(),
}).required();

const Login = () => {
  const router = useRouter();
  const [loginUserDetails, setLoginUserDetails] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("loginCredentials");
    console.log("token", token);

    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["user", loginUserDetails],
    queryFn: tkFetch.get(`${API_BASE_URL}/login`, {
      params: loginUserDetails,
    }),
    enabled: !!loginUserDetails,
  });

  console.log("loggedInUser", data);
  console.log("isError", isError);
  console.log("isLoading", isLoading);
  console.log("error", error);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (userData) => {
    setLoginUserDetails({
      email: userData.email,
      password: userData.password,
    });
  };
  if (data) {
    console.log("user logged in successfully");
    sessionStorage.setItem("loginCredentials", data[0].token);
    sessionStorage.setItem("userId", JSON.stringify(data[0].userId));
    router.push("/dashboard");
  } else if (isError) {
    TkToastError("Invalid Credentials");
  }

  const googleLoginHabdler = async () => {
    await signIn("google", { callbackUrl: "/dashboard" }); // it redirects use to dashboard after signIn
  };

  // *** using firebase ***
  const googleLogin = () => {
    console.log("google login");
    signInWithPopup(auth, googleProvider);
    const user = app.auth;
    if (user) {
      console.log("d", user);
    }
  };

  return (
    <>
      {/* {isLoading && (
        <div className="d-flex align-item-center justify-content-center">
          <Spinner /> */}
      <TkPageHead>
        <title>{`Login - ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
      </TkPageHead>
      <ParticlesAuth>
        <div className="auth-page-content">
          <TkContainer>
            <TkRow>
              <TkCol lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <div>
                    <Link href="/" className="d-inline-block auth-logo">
                      <h2 className="logo-text text-light">
                        {process.env.NEXT_PUBLIC_APP_NAME}
                      </h2>
                    </Link>
                  </div>
                </div>
              </TkCol>
            </TkRow>

            <TkRow className="justify-content-center">
              <TkCol md={8} lg={6} xl={5}>
                <TkCard className="mt-4">
                  <TkCardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">Welcome!</h5>
                      <p className="text-muted">Login to continue</p>
                    </div>
                    <div className="p-2 mt-4">
                      <TkForm onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                          {/* TODO: add validation taht it is required */}
                          <TkInput
                            {...register("email")}
                            labelName="Email"
                            type="email"
                            name="email"
                            id="email"
                            requiredStarOnLabel={true}
                            placeholder="Enter Email"
                          />
                          {errors.email?.message ? (
                            <FormErrorText>
                              {errors.email?.message}
                            </FormErrorText>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <div className="float-end">
                            <Link
                              href="/forgot-password"
                              className="text-muted"
                            >
                              Forgot password?
                            </Link>
                          </div>
                          <TkInput
                            {...register("password")}
                            labelName="Password"
                            id="password"
                            name="password"
                            type="password"
                            requiredStarOnLabel={true}
                            placeholder="Enter Password"
                          />
                          {errors.password?.message ? (
                            <FormErrorText>
                              {errors.password?.message}
                            </FormErrorText>
                          ) : null}
                        </div>

                        {/* <div className="form-check">
                          <TkCheckBox
                            {...register("rememberMe")}
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="auth-remember-check"
                          />
                          <TkLabel className="form-check-label" id="auth-remember-check">
                            Remember me
                          </TkLabel>
                        </div> */}

                        <div className="mt-4">
                          <TkButton
                            color="success"
                            className="btn btn-success w-100"
                            type="submit"
                          >
                            Login
                          </TkButton>
                        </div>
                      </TkForm>

                      <div className="mt-4 text-center">
                        <div className="signin-other-title">
                          <h5 className="fs-13 mb-4 title">OR</h5>
                        </div>
                        <div>
                          <GoogleLoginBtn
                            onClick={googleLogin}
                            // onClick={googleLoginHabdler}
                            btnText={"Login with Google"}
                          />
                        </div>
                      </div>
                    </div>
                  </TkCardBody>
                </TkCard>

                <div className="mt-4 text-center">
                  <p className="mb-0">
                    Don&apos;t have an account ?
                    <Link
                      href="/signup"
                      className="fw-semibold text-primary text-decoration-underline"
                    >
                      Signup
                    </Link>
                  </p>
                </div>
              </TkCol>
            </TkRow>
          </TkContainer>
        </div>
      </ParticlesAuth>
      {/* </div>
      )} */}
    </>
  );
};

export default Login;

// Login.noLayout = true;
