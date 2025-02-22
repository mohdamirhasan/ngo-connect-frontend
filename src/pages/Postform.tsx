import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// ✅ Validation schema using Zod
const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    image: z
      .custom<FileList>((val) => val instanceof FileList && val.length > 0, {
        message: "Image is required",
      }),
  });
  

type FormValues = z.infer<typeof formSchema>;

const PostForm: React.FC = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      image: "",
    },
  });

  const { register, handleSubmit, control, formState: { errors } } = form;

  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
        <div>
          <h1 className="font-bold text-2xl p-2">Create a Post</h1>
          <p className="text-xs pb-6">Share your thoughts and updates</p>
        </div>

        {/* Title Field */}
        <FormField
          name="title"
          control={control}
          render={({ field }) => (
            <FormItem className="text-left w-full">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content Field */}
        <FormField
          name="content"
          control={control}
          render={({ field }) => (
            <FormItem className="text-left w-full">
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Write your post..." {...field} className="h-24" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload Field */}
        <FormField
  name="image"
  control={control}
  render={({ field: { onChange, ...rest } }) => (
    <FormItem className="text-left w-full">
      <FormLabel>Upload Image</FormLabel>
      <FormControl>
        <Input 
        type="file"
          onChange={(e) => onChange(e.target.files)}
          {...rest}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>


        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default PostForm;
