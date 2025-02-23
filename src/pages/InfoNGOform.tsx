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
import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import ngoCategories from "@/assets/ngoCategories.json"
import { useLocation } from "@/hooks/useLocation";
import apiUrl from "@/api/apiConfig";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";


const formSchema = z.object({
  name: z
    .string()
    .min(3, "*Name is too short")
    .nonempty("*This field is required"),
  email: z.string().email("*Invalid email").nonempty("*This field is required"),
  contact_no: z.string().nonempty("*This field is required"),
  location: z.string().nonempty("*This field is required"),
  category: z.string().nonempty("*This field is required"),
  subcategory: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const InfoNGOform = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const { location, setLocation, loading, error, fetchCurrentLocation } = useLocation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      contact_no: "",
      location: "",
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
    try{
      const response = await fetch(`${apiUrl}/api/ngo/register-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if(response.ok){
        alert("NGO information registered");
        navigate("/login-ngo");
      }
      else{
        alert("Error: " + result.message);
      }
    }
    catch (error) {
      console.error("An error occured, Please try again!" + error);
    }
  };

  return (
    <>
    <Navbar />
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow mt-16">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-4">
          <h1 className="font-bold text-2xl text-center">Enter the Details of NGO</h1>
          <p className="text-xs pb-4 text-center">Enter information of your NGO to register to the community</p>

          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="text-left w-full">
                <FormLabel className="m-2">Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the name of NGO" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="text-left w-full">
                <FormLabel className="m-2">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter Email address"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Contact Number */}
          <FormField
            control={form.control}
            name="contact_no"
            render={({ field }) => (
              <FormItem className="text-left w-full">
                <FormLabel className="m-2">Contact No</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="Enter contact number"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Location */}
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
                    <Button type="button" onClick={fetchCurrentLocation} disabled={loading}>
                      <MapPin />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
                {error && <p className="text-red-500 text-sm">An error ocurred, please try again!</p>}
              </FormItem>
            )}
          />


          {/* Category Dropdown */}
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

          {/* Subcategory Dropdown */}
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
          <div className="flex flex-col gap-4 justify-center p-2">
						<Button type="submit" className="w-full">
						Submit
						</Button>
						<Button className="text-sm font-light invert" onClick={() => navigate('/register-ngo')}>Go back</Button>
					</div>
        </form>
      </Form>
    </div>
    <Footer />
    </>
  );
};

export default InfoNGOform;
