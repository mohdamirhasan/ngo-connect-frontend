import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageIcon, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useUserInfo from "@/hooks/useUserInfo";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import apiUrl from "@/api/apiConfig";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  image: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PostForm: React.FC = () => {

  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const { token } = useAuth();
  const { isLoggedIn } = useUserInfo(token); 
  const [userType, setUserType] = useState<string | null>(null);
  
    useEffect(() => {
      setUserType(localStorage.getItem('userType'));
    }, [isLoggedIn]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      image: undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      if (data.image) formData.append("image", data.image);

      const response = await fetch(`${apiUrl}/api/post/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const result = await response.json();
      if (response.ok){
        alert("Posted successfully");
        window.location.reload();
        navigate('/');
      }
      else{
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("An error occurred, please try again" + error);
    }
  };

  return userType === "ngo" ? (
    <>
      <Navbar />
      <div className="max-w-md mx-auto p-4 border rounded-lg shadow mt-16">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-4 space-y-4">
            <div>
              <h1 className="font-bold text-2xl text-center p-2">Create a Post</h1>
              <p className="text-xs pb-6">Share a post in the community</p>
            </div>

            {/* Title Field */}
            <FormField
              name="title"
              control={form.control}
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

            {/* Image Upload Field */}
            <FormField
              name="image"
              control={form.control}
              render={() => (
                <FormItem className="text-left w-full">
                  <FormLabel>Upload Image</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <input
                        type="file"
                        accept="image/*"
                        id="image"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            form.setValue("image", file);
                            setPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                      <div className="flex flex-col space-y-3 w-full">
                        <label
                          htmlFor="image"
                          className="cursor-pointer w-full flex items-center px-4 py-2 border rounded-lg shadow-sm bg-gray-100 hover:bg-gray-200 transition">
                          <ImageIcon className="mr-2" size={22} />
                          Choose File
                        </label>

                        {preview && (
                          <div className="relative">
                            <img
                              src={preview}
                              alt="Preview"
                              className="h-full w-full rounded-lg border object-cover"
                            />

                            <button
                              type="button"
                              onClick={() => {
                                form.setValue("image", undefined);
                                setPreview(null);
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content Field */}
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem className="text-left w-full">
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your post..."
                      {...field}
                      className="h-24"
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
      </div>
      <Footer />
    </>
  ) : (
    <div>
      <h1 className="text-2xl text-center mt-16" onClick={() => navigate('/login-ngo')}>You are not authorized to access this page</h1>
    </div>
  ); 
};

export default PostForm;
