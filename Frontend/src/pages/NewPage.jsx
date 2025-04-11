import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { useState } from "react";
import { Link } from "react-router-dom";

const Newpage = () => {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    skills : [],

  };

  const validationSchema = yup.object({
    firstName: yup
      .string()
      .min(2, "name to short")
      .max(50, "First name cannot exceed 50 characters.")
      .matches(/^[A-Za-z\s'-]+$/, "First name can only contain letters, spaces, apostrophes, and hyphens.")
      .required("please enter firstName"),
    phoneNumber: yup
      .string()
      .required("Phone number is required.")
      .matches(/^\d{10}$/, "Phone number contain only 10 number"),
    lastName: yup
      .string()
      .min(2, "name to short")
      .max(50, "Last name cannot exceed 50 characters.")
      .matches(/^[A-Za-z\s'-]+$/, "Last name can only contain letters, spaces, apostrophes, and hyphens.")
      .required("please enter lastName"),
    email: yup
      .string()
      .min(3, "email too short")
      .required("please enter user name"),
    password: yup
      .string()
      .min(6, "password too short")
      .required("enter password"),
    bio: yup.string()
      .optional() // Bio is optional
      .max(300, "Bio cannot exceed 300 characters.") // Limit to 300 characters
      .matches(/^[A-Za-z0-9\s.,'-]*$/, "Bio can only include letters, numbers, spaces, and basic punctuation."),
    skills: yup
    .array()
    .min(1, "You must select at least one skill.")
    .required("Skills are required."),
  });
  const skillsOptions = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Django",
    "Ruby",
    "PHP",
    "C++",
    "Java",
    "HTML/CSS",
  ];
  const onSubmit = (values) => {
    console.log(values);
  };
  return (
    <div className="flex justify-center items-center">
      <div className="shadow-lg rounded p-10  w-full md:w-2xl mt-10">
        <h1>Customize your Profile</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formikProps) => {
            return (
              <Form
                className="flex flex-col py-5 gap-6"
                onSubmit={formikProps.handleSubmit}
              >
                <InputField
                  label="First name"
                  type="text"
                  name="firstName"
                  placeholder="xyz"
                  required
                />
                
                <InputField
                  label="Last name"
                  type="text"
                  name="lastName"
                  placeholder="xyz"
                  required
                />
                <InputField
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="abc123@email.com"
                  required
                />
                <InputField
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="12345678"
                  required
                />
                <InputField
                   label="PhoneNumber"
                   type="text"
                   name="phoneNumber"
                   placeholder="1234567890"
                   required
                  />
                <InputField
                  label="BIO"
                  as="textarea"
                  name="bio"
                  placeholder="Describe your self....."
                  rows="5"
                  cols="5"
                /> 
                 <InputField
                  label="Skills"
                  name="skills"
                  type="checkbox"
                  options={skillsOptions}
                  required
                />
                <Button type="Continue" value="Continue" />
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default Newpage;