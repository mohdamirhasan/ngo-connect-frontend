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
import apiUrl from "@/api/apiConfig";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const formSchema = z.object({
    name: z.string().min(2, "*Name is too short").nonempty("This field is required"),
	email: z.string().email("*Invalid email").nonempty("*This field is required"),
	password: z.string().min(6, "*Password must be atleast of 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const RegisterUser = () => {

	const navigate = useNavigate();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
            name: '',
			email: '',
			password: '',
		}
	})

	const onSubmit = async (data: FormValues) => {
		try{
			const response = await fetch(`${apiUrl}/api/users/login`, {
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json',
			  },
			  body: JSON.stringify(data),
			});
	  
			const result = await response.json();
			if(response.ok){
			  alert(result.message);
			  navigate('/login-user');
			}
			else{
			  alert("Error: " + result.message);
			}
		  }
		  catch (error) {
			console.error("An error occured, Please try again!" + error);
		  }
	}

	return (
		<>
		<Navbar />
		<div className="max-w-md mx-auto my-auto p-4 border rounded-lg shadow mt-16">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="p-5 space-y-5">
					<h1 className="font-bold text-2xl text-center">Register Yourself</h1>
					<p className="text-xs pb-4 text-center">Enter your details to register yourself to the community</p>
                    <FormField
						control={form.control}
						name="name"
						render={({ field }) => (
						<FormItem className="text-left w-full">
							<FormLabel className="m-2">Name</FormLabel>
							<FormControl>
							<Input
								type="text"
								placeholder="Enter your name"
								{...field}
							/>
							</FormControl>
							<FormMessage className="text-xs"/>
						</FormItem>
						)}
					/>
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
							<FormMessage className="text-xs"/>
						</FormItem>
						)}
					/>
					 <FormField
						control={form.control}
						name="password"
						render={({ field }) => (
						<FormItem className="text-left w-full">
							<FormLabel className="m-2">Create Password</FormLabel>
							<FormControl>
							<Input
								type="password"
								placeholder="Enter password"
								{...field}
							/>
							</FormControl>
							<FormMessage className="text-xs"/>
						</FormItem>
						)}
					/>
					<div className="flex flex-col gap-4 justify-center p-2">
						<Button type="submit" className="w-full">
						Register
						</Button>
						<Button className="text-sm font-light invert" onClick={() => navigate('/login-user')}>Already Registered? Log in</Button>
					</div>
				</form>
			</Form>
		</div>
		<Footer />
		</>
	)
}

export default RegisterUser
