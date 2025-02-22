import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";

type FormData = {
  title: string;
  location: string;
  description: string;
  category: string;
  image: FileList;
};

const categories = [
  { value: "animal_welfare", label: "🐾 Animal Welfare & Environmental NGOs" },
  { value: "health", label: "🏥 Health & Medical NGOs" },
  { value: "education", label: "📚 Education & Child Welfare NGOs" },
  { value: "human_rights", label: "⚖️ Human Rights & Social Justice NGOs" },
  { value: "disaster_relief", label: "🚨 Disaster Relief & Emergency Services NGOs" },
  { value: "poverty", label: "💰 Poverty Alleviation & Economic Development NGOs" },
  { value: "senior_support", label: "👴 Senior Citizen & Disability Support NGOs" }
];

const Reportform: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", {
      ...data,
      image: data.image[0] ? data.image[0].name : "No image uploaded",
    });
  };

  const previewImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container">
      <h2>Report an Issue</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Title Field */}
        <div className="input-group">
          <input type="text" {...register("title", { required: "Title is required" })} placeholder=" " />
          <label>📌 Issue Title</label>
          {errors.title && <p className="error">{errors.title.message}</p>}
        </div>

        {/* Location Field */}
        <div className="input-group">
          <input type="text" {...register("location", { required: "Location is required" })} placeholder=" " />
          <label>📍 Location</label>
          {errors.location && <p className="error">{errors.location.message}</p>}
        </div>

        {/* Description Field */}
        <div className="input-group">
          <textarea {...register("description", { required: "Description is required" })} rows={4} placeholder=" "></textarea>
          <label>📝 Description</label>
          {errors.description && <p className="error">{errors.description.message}</p>}
        </div>

        {/* Category Dropdown */}
        <div className="input-group">
          <Controller
            name="category"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <select {...field}>
                <option value="" disabled>Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            )}
          />
        </div>

        {/* Image Upload */}
        <div className="file-upload" onClick={() => document.getElementById("image")?.click()}>
          Click to Upload Image
          <input type="file" id="image" {...register("image")} accept="image/*" onChange={previewImage} />
        </div>

        {/* Image Preview */}
        {imagePreview && <img src={imagePreview} className="file-preview" alt="Preview" />}

        {/* Submit Button */}
        <button type="submit">Submit Report</button>
      </form>
    </div>
  );
};

export default Reportform;
