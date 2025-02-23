import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MapPin, ImageIcon, Trash2 } from "lucide-react";
import ngoCategories from "@/assets/ngoCategories.json";
import { useLocation } from "@/hooks/useLocation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import apiUrl from "@/api/apiConfig";

const formSchema = z.object({
  title: z
    .string()
    .min(3, "*Title is too short")
    .nonempty("*This field is required"),
  desc: z
    .string()
    .min(10, "*Content is too short")
    .nonempty("*This field is required"),
  location: z.string().nonempty("*This field is required"),
  image: z.instanceof(File).optional(),
  category: z.string().nonempty("*This field is required"),
  subcategory: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Reportform: React.FC = () => {

  const { token } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const { location, setLocation, loading, error, fetchCurrentLocation } = useLocation();
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      desc: "",
      location: "",
      image: undefined,
      category: "",
      subcategory: "",
    },
  });

  useEffect(() => {
    if (location) {
      form.setValue("location", location, { shouldValidate: true });
    }
  }, [location]);

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("desc", data.desc);
      formData.append("location", data.location);
      formData.append("category", data.category);
      formData.append("subcategory", data.subcategory || "");
      if (data.image) formData.append("image", data.image);
  
      const response = await fetch(`${apiUrl}/api/report/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      const result = await response.json();
      if (response.ok) {
        alert("Report Submitted successfully");
        window.location.reload();
        navigate('/dashboard');
      } else {
        alert("Report submission unsuccessful: " + result.message);
      }
    } catch (error) {
      console.error("An error occurred, please try again!" + error);
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto p-4 border rounded-lg shadow mt-16">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-4">
            <div>
              <h1 className="font-bold text-2xl text-center p-2">Raise a Request</h1>
              <p className="text-xs pb-6">
                Report an Issue and Connect with NGOs for Quick Assistance
              </p>
            </div>

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

            <FormField
              name="desc"
              control={form.control}
              render={({ field }) => (
                <FormItem className="text-left w-full">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write a description of the issue"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="text-left w-full">
                  <FormLabel className="m-2">Location</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter the location"
                        {...field}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                      <Button
                        type="button"
                        onClick={fetchCurrentLocation}
                        disabled={loading}>
                        <MapPin />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                  {error && (
                    <p className="text-red-500 text-sm">
                      An error ocurred, please try again!
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="text-left w-full">
                  <FormLabel className="m-2">Category</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full p-2 border rounded"
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedCategory(e.target.value);
                      }}>
                      <option value="">Select Category</option>
                      {ngoCategories.map(({ category }) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {selectedCategory && (
              <FormField
                control={form.control}
                name="subcategory"
                render={({ field }) => (
                  <FormItem className="text-left w-full">
                    <FormLabel className="m-2">Subcategory</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full p-2 border rounded">
                        <option value="">Select Subcategory</option>
                        {ngoCategories
                          .find(({ category }) => category === selectedCategory)
                          ?.subcategories.map((sub) => (
                            <option key={sub} value={sub}>
                              {sub}
                            </option>
                          ))}
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <FormField
              name="image"
              control={form.control}
              render={() => (
                <FormItem className="text-left w-full">
                  <FormLabel>Upload Image</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-4">
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

                      <label
                        htmlFor="image"
                        className="cursor-pointer flex items-center px-4 py-2 border rounded-lg shadow-sm bg-gray-100 hover:bg-gray-200 transition">
                        <ImageIcon className="mr-2" size={18} />
                        Choose File
                      </label>

                      {preview && (
                        <div className="relative">
                          <img
                            src={preview}
                            alt="Preview"
                            className="h-12 w-12 rounded-lg border object-cover"
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-4 justify-center p-2 pt-6">
              <Button type="submit" className="w-full">
                Submit
              </Button>
              <Button
                className="text-sm font-light invert"
                onClick={() => navigate("/")}>
                Go back
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <Footer />
    </>
  );
};

export default Reportform;
