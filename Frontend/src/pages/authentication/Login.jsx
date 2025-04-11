import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../context/authSlice.js";
import { Loader2, Variable, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Loader from "../../components/Loader.jsx";

// 1. Create a form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  // role: z.string(),
  // type: z.string(),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.loading.loadingStates.login);
  const { toast } = useToast();

  // 2. Define the form with react-hook-form and zodResolver
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      // role: "Developer",
      // type: "Individual",
    },
  });

  const { handleSubmit, setValue, watch, register } = form;
  const roleValue = watch("role");

  // 3. Build the form
  const onSubmit = (values) => {
    dispatch(
      loginUser({
        ...values,
        role: roleValue === "Developer" ? "Developer" : "Employer",
      })
    )
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        // Ensure you handle the error based on the structure you set in the thunk
        const message = err.message || "An error occurred";
        const status = err.status || 500;

        toast({
          variant: "destructive",
          title: `Error ${status}`,
          description: message,
          duration: 3000,
        });

        console.log("Error in login page:", message);
      });
  };

  const [pwvisible, setpwvisible] = useState(false);

  return (
    <Form {...form}>
      <p className="text-center font-bold text-2xl underline">Login</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormItem>
          <FormLabel>Email Address</FormLabel>
          <FormControl>
            <Input
              {...register("email")}
              type="email"
              placeholder="abc123@email.com"
              required
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <div className="flex justify-around items-center gap-2">
              <Input
                {...register("password")}
                type={pwvisible?"text":"password"}
                placeholder="••••••••"
                required
              />
              <span onClick={() => setpwvisible(!pwvisible)}>
                {pwvisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>

        <Link to="/verify/forgotpw" className="text-sm">Forgot Password?</Link>

        {isLoading ? (
          <Loader />
        ) : (
          <Button type="submit" className="w-full">
            Login
          </Button>
        )}

        <p className="text-center">
          New user?{" "}
          <Link to="/auth/signup" className="underline text-blue-700">
            SignUp
          </Link>
        </p>
      </form>
    </Form>
  );
}
