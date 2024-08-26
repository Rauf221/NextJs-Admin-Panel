"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';


const loginValidationSchema = Yup.object().shape({
  logemail: Yup.string().required('Username is required'),
  logpass: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const signupValidationSchema = Yup.object().shape({
  logname: Yup.string().required('Full Name is required'),
  logemail: Yup.string().email('Invalid email').required('Email is required'),
  logpass: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginSignUP: React.FC = () => {
 
    const [isSignUp, setIsSignUp] = useState(false);

    const { trigger: loginservice, isMutating: loading, error: isErr } = useRequestMutation(
        "login",
        {
            method: "POST",
            module: "devApi",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (values: { logemail: string; logpass: string }) => {
    try {
      // POST request simulation
      const postResponse = await axios.post('http://localhost:3001/users', {
        email: values.logemail,
        password: values.logpass,
      });

      // Assuming the POST request returns a status 200 on success
      if (postResponse.status === 200) {
        const users = postResponse.data.users;
        
        // Find user by email and password
        const user = users.find(
          (u: { username: string; password: string }) => 
            u.username === values.logemail && u.password === values.logpass
        );

        if (user) {
          // Check user role
          if (user.role === 'admin') {
            router.push('/tables');
          } else {
            router.push('/preview');
          }
        } else {
          setError('Invalid username or password.');
        }
      }
    } catch (err) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="section w-full">
      <div className="container mx-auto flex justify-center items-center">
        <div className="row full-height flex justify-center items-center">
          <div className="col-12 text-center py-5">
            <div className="section pb-5 pt-5 pt-sm-2 text-center">
              <h6 className="mb-0 pb-3">
                <span>Log In</span>
                <span>Sign Up</span>
              </h6>
              <input className="checkbox" type="checkbox" id="reg-log" name="reg-log" />
              <label htmlFor="reg-log"></label>
              <div className="card-3d-wrap mx-auto">
                <div className="card-3d-wrapper">
                  <div className="card-front">
                    <div className="center-wrap">
                      <div className="section text-center">
                        <h4 className="mb-4 pb-3">Log In</h4>
                        <Formik
                          initialValues={{ logemail: '', logpass: '' }}
                          validationSchema={loginValidationSchema}
                          onSubmit={handleLogin}
                        >
                          {() => (
                            <Form>
                              <div className="form-group">
                                <Field
                                  type="text"
                                  name="logemail"
                                  className="form-style"
                                  placeholder="Your Username"
                                  autoComplete="off"
                                />
                                <FaEnvelope className="input-icon" />
                                <ErrorMessage name="logemail">
                                  {(msg: string) => <div className="error-message text-red-500">{msg}</div>}
                                </ErrorMessage>
                              </div>
                              <div className="form-group mt-2">
                                <Field
                                  type="password"
                                  name="logpass"
                                  className="form-style"
                                  placeholder="Your Password"
                                  autoComplete="off"
                                />
                                <FaLock className="input-icon" />
                                <ErrorMessage name="logpass">
                                  {(msg: string) => <div className="error-message text-red-500">{msg}</div>}
                                </ErrorMessage>
                              </div>
                              {error && <div className="error-message text-red-500 mt-2">{error}</div>}
                              <button type="submit" className="btn mt-4">
                                Submit
                              </button>
                            </Form>
                          )}
                        </Formik>
                        <p className="mb-0 mt-4 text-center">
                          <a href="#0" className="link">
                            Forgot your password?
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card-back">
                    <div className="center-wrap">
                      <div className="section text-center">
                        <h4 className="mb-4 pb-3">Sign Up</h4>
                        <Formik
                          initialValues={{ logname: '', logemail: '', logpass: '' }}
                          validationSchema={signupValidationSchema}
                          onSubmit={async (values: { logname: string; logemail: string; logpass: string }) => {
                            console.log('Sign Up values:', values);
                            router.push('/preview');
                          }}
                        >
                          {() => (
                            <Form>
                              <div className="form-group">
                                <Field
                                  type="text"
                                  name="logname"
                                  className="form-style"
                                  placeholder="Your Full Name"
                                  autoComplete="off"
                                />
                                <FaUser className="input-icon" />
                                <ErrorMessage name="logname">
                                  {(msg: string) => <div className="error-message text-red-500">{msg}</div>}
                                </ErrorMessage>
                              </div>
                              <div className="form-group mt-2">
                                <Field
                                  type="email"
                                  name="logemail"
                                  className="form-style"
                                  placeholder="Your Email"
                                  autoComplete="off"
                                />
                                <FaEnvelope className="input-icon" />
                                <ErrorMessage name="logemail">
                                  {(msg: string) => <div className="error-message text-red-500">{msg}</div>}
                                </ErrorMessage>
                              </div>
                              <div className="form-group mt-2">
                                <Field
                                  type="password"
                                  name="logpass"
                                  className="form-style"
                                  placeholder="Your Password"
                                  autoComplete="off"
                                />
                                <FaLock className="input-icon" />
                                <ErrorMessage name="logpass">
                                  {(msg: string) => <div className="error-message text-red-500">{msg}</div>}
                                </ErrorMessage>
                              </div>
                              <button type="submit" className="btn mt-4">
                                Submit
                              </button>
                            </Form>
                          )}
                        </Formik>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUP;
