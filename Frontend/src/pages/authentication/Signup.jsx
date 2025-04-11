import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../context/authSlice.js";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import Loader from "../../components/Loader.jsx";

// 1. Create a form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["WORK", "HIRE"]),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.loading.loadingStates.signup);

  // 2. Define the form with react-hook-form and zodResolver
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "WORK",
    },
  });

  const { handleSubmit, register, watch } = form;
  const roleValue = watch("role");
  const { toast } = useToast();

  // 3. Build the form
  const onSubmit = (values) => {
    console.log(values);
    dispatch(signupUser(values))
      .unwrap()
      .then(() => {
        navigate("/verify/waitEmailVerify");
      })
      .catch((error) => {
        // Ensure you handle the error based on the structure you set in the thunk
        const message = error.message || "An error occurred";
        const status = error.status || 500;

        toast({
          variant: "destructive",
          title: `Error ${status}`,
          description: message,
          duration: 3000,
        });

        console.log("Error in login page:", message);
      });
  };

  return (
    <Form {...form}>
      <p className="text-center font-bold text-2xl underline">Signup</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Role Selector */}
        <div className="flex gap-1 bg-gray-200 p-1 rounded text-white my-6">
          <label
            className={`flex-1 p-1 text-center cursor-pointer rounded ${
              roleValue === "WORK" ? "bg-gray-600" : "bg-gray-400"
            }`}
          >
            <input
              type="radio"
              value="WORK"
              {...register("role")}
              className="hidden"
            />
            Work
          </label>
          <label
            className={`flex-1 p-1 text-center cursor-pointer rounded ${
              roleValue === "HIRE" ? "bg-gray-600" : "bg-gray-400"
            }`}
          >
            <input
              type="radio"
              value="HIRE"
              {...register("role")}
              className="hidden"
            />
            Hire
          </label>
        </div>

        {/* Email Input */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="abc123@email.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Input */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="••••••••" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isLoading ? (
          <Loader/>
        ) : (
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        )}

        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/auth/login" className="underline text-blue-700">
            Login
          </Link>
        </p>
      </form>
    </Form>
  );
}
