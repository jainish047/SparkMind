import React from "react";
import { Input } from "@/components/ui/input";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export default function InputField({
  name,
  label,
  type = "text",
  required,
  placeholder,
  register,
}) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          {...register(name)} // Connect to react-hook-form
          type={type}
          placeholder={placeholder}
          required={required}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
