import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
} from "../../components/ui/command";
import { api } from "../../API/axiosConfig";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../context/authSlice";

export default function UpdateProfile() {
  const [profilePic, setProfilePic] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const allSkills = useSelector((state) => state.general.skills);
  const allCountries = useSelector((state) => state.general.countries);
  const [searchSkill, setSearchSkill] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "", // Pre-filled and unchangeable
      phoneNumber: "",
      bio: "",
      skills: [], // Changed from "" to an array
      location: "",
      country: "",
      dob: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      phoneNumber: Yup.string()
        .matches(/^[0-9]+$/, "Only numbers allowed")
        .required("Phone number is required"),
      bio: Yup.string().max(800, "Bio must be 800 characters or less"),
      skills: Yup.array().min(1, "At least one skill is required"),
      location: Yup.string().required("Location is required"),
      country: Yup.string().required("Country is required"),
      dob: Yup.date().required("Date of birth is required"),
    }),
    onSubmit: async (values) => {
      console.log("submit triggered");
      const formData = new FormData();

      // Append all form fields dynamically
      Object.entries(values).forEach(([key, value]) => {
        // For skills, we join the array into a comma-separated string
        if (key != "email")
          formData.append(key, key === "skills" ? value.join(",") : value);
      });

      // Append file if selected
      if (profileFile) {
        formData.append("profilePic", profileFile);
      }

      console.log("passed values frontend:->", formik.values);
      console.log("passed values in formdata:->", formData);

      try {
        const response = await api.put("/user/self", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        dispatch(setUser(response.data.user));
        console.log("Profile updated successfully   :", response.data);
        toast({
          title: response.data.message,
        });
        // navigate(`/profile/${user.id}`)
        navigate("/settings");
      } catch (error) {
        console.error(
          "Error updating profile:",
          error.response?.data || error.message
        );
      }
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileFile(file);
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleAutoFill = () => {
    if (user) {
      formik.setFieldValue("name", user.name || "");
      formik.setFieldValue("email", user.email || "");
      formik.setFieldValue("phoneNumber", user.phoneNumber || "");
      formik.setFieldValue("bio", user.bio || "");
      formik.setFieldValue("skills", user.skills || []); // Make sure to set as array
      formik.setFieldValue("location", user.location || "");
      formik.setFieldValue("country", user.country || "");
      formik.setFieldValue("dob", user.dob?.split("T")[0] || "");
      setProfilePic(user.profilePic);
    }
    console.log("in authfill formik values:->", formik.values);
  };

  useEffect(() => {
    handleAutoFill();
  }, [user]);

  useEffect(() => {
    console.log("Formik values:", formik.values);
    console.log("Formik errors:", formik.errors);
  }, [formik.values, formik.errors]);

  const handleSkillsSelection = ({ id }) => {
    // Ensure skills is an array
    const currentSkills = Array.isArray(formik.values.skills)
      ? formik.values.skills
      : [];

    // Add skill ID only if it's not already present
    if (!currentSkills.includes(id.toString())) {
      formik.setFieldValue("skills", [...currentSkills, id.toString()]);
    }
    setSearchSkill("");
  };

  const handleSkillDeletion = (id) => {
    // Ensure skills is an array
    const currentSkills = Array.isArray(formik.values.skills)
      ? formik.values.skills
      : [];

    // Remove the skill ID
    const updatedSkills = currentSkills.filter(
      (skillId) => skillId !== id.toString()
    );

    // Update Formik state
    formik.setFieldValue("skills", updatedSkills);
  };

  if (!user) {
    return <div>You need to Login...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <div className="w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">Upload</span>
              )}
            </div>
          </label>
        </div>

        {/* Name */}
        <label className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          {...formik.getFieldProps("name")}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-red-500 text-sm">{formik.errors.name}</p>
        )}

        {/* Email (Read-Only) */}
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          className="w-full p-2 border rounded bg-gray-200"
          value={formik.values.email}
          readOnly
        />

        {/* Phone Number */}
        <label className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          className="w-full p-2 border rounded"
          {...formik.getFieldProps("phoneNumber")}
        />
        {formik.touched.phoneNumber && formik.errors.phoneNumber && (
          <p className="text-red-500 text-sm">{formik.errors.phoneNumber}</p>
        )}

        {/* Bio */}
        <label className="block text-sm font-medium text-gray-700">
          Short Bio
        </label>
        <textarea
          name="bio"
          placeholder="Short Bio"
          className="w-full p-2 border rounded"
          {...formik.getFieldProps("bio")}
        />

        {/* Skills */}
        <label className="block text-sm font-medium text-gray-700">
          Skills
        </label>
        <Command className="border rounded-lg shadow-sm">
          <CommandInput
            placeholder="Type a skill..."
            onValueChange={(value) => {
              console.log("search input", value);
              setSearchSkill(value);
            }}
            value={searchSkill}
          />
          <CommandList
            className={`max-h-20 overflow-y-auto shadow-sm ${
              searchSkill ? "block" : "hidden"
            }`}
          >
            {allSkills
              ?.filter((skill) =>
                skill.name.toLowerCase().includes(searchSkill.toLowerCase())
              )
              .map((skill) => (
                <CommandItem
                  key={skill.id}
                  onSelect={() => handleSkillsSelection(skill)}
                  className="cursor-pointer"
                >
                  {skill.name}
                </CommandItem>
              ))}
          </CommandList>
        </Command>
        <div className="flex flex-wrap gap-2 px-3">
          {formik.values.skills.map((skill, index) => {
            return (
              <button
                key={index}
                type="button"
                className="rounded-full bg-slate-200 border border-gray-400 py-1 px-3 text-sm"
                onClick={() => handleSkillDeletion(skill)}
              >
                {(allSkills.find((s) => s.id == skill) || {})?.name}
              </button>
            );
          })}
        </div>

        {/* Location */}
        <label className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          name="location"
          placeholder="Location"
          className="w-full p-2 border rounded"
          {...formik.getFieldProps("location")}
        />
        {formik.touched.location && formik.errors.location && (
          <p className="text-red-500 text-sm">{formik.errors.location}</p>
        )}

        {/* Country */}
        <label className="block text-sm font-medium text-gray-700">
          Country
        </label>
        <select
          name="country"
          className="w-full bg-white border p-2 rounded"
          value={formik.values.country} // Bind selected country ID
          onChange={(e) => formik.setFieldValue("country", e.target.value)}
        >
          <option value="">Select a country</option> {/* Default placeholder */}
          {allCountries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>

        {/* Date of Birth */}
        <label className="block text-sm font-medium text-gray-700">
          Date of Birth
        </label>
        <input
          type="date"
          name="dob"
          className="w-full p-2 border rounded"
          {...formik.getFieldProps("dob")}
        />
        {formik.touched.dob && formik.errors.dob && (
          <p className="text-red-500 text-sm">{formik.errors.dob}</p>
        )}

        <button
          //   type="submit"
          type="button"
          onClick={formik.handleSubmit}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
