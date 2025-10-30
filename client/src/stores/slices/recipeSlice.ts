import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";
import { cldUrl, isCloudinaryUrl, postImageCloudinary } from "../../utils/cloudinary";
import type { IRecipe } from "../../utils/interface/Recipes";


type RecipeWithOpt = IRecipe & { imageOptimized?: string };

interface RecipesState {
  loading: boolean;
  list: RecipeWithOpt[];
  error: string | null;
}

const initialState: RecipesState = {
  loading: false,
  list: [],
  error: null,
};

// ⛳ Chỉnh cờ này nếu muốn auto-upload ảnh chưa phải Cloudinary
const AUTO_UPLOAD_NON_CLOUDINARY = false;

// optional: tuỳ kích thước UI của bạn
const DEFAULT_IMG_OPTS = {
  w: 640,
  h: 480 as const,
  c: "fill" as const,
  q: "auto",
  f: "auto",
};

export const getAllRecipes = createAsyncThunk<RecipeWithOpt[]>(
  "recipes/getAllRecipes",
  async () => {
    const res = await axiosInstance.get("recipes");
    const data = res.data as IRecipe[];

    // Xử lý ảnh song song
    const processed = await Promise.all(
      data.map(async (item) => {
        const raw = item.image ?? item.imageUrl ?? ""; // tự điều chỉnh nếu backend của bạn khác key
        if (!raw) return { ...item };

        // Trường hợp đã là Cloudinary URL hoặc public_id
        if (isCloudinaryUrl(raw) || !/^https?:\/\//.test(raw)) {
          return { ...item, imageOptimized: cldUrl(raw, DEFAULT_IMG_OPTS) };
        }

        // raw là URL ngoài hoặc dataURL
        if (!AUTO_UPLOAD_NON_CLOUDINARY) {
          // KHÔNG upload, giữ nguyên link ngoài (fallback), nhưng vẫn cố tối ưu nếu lỡ là public_id
          return { ...item, imageOptimized: raw };
        }

        // TỰ ĐỘNG UPLOAD lên Cloudinary rồi tối ưu
        try {
          const uploadedUrl = await postImageCloudinary(raw);
          return {
            ...item,
            imageOptimized: cldUrl(uploadedUrl, DEFAULT_IMG_OPTS),
          };
        } catch {
          // fallback an toàn
          return { ...item, imageOptimized: raw };
        }
      })
    );

    return processed;
  }
);

const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(getAllRecipes.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(getAllRecipes.fulfilled, (s, a) => {
      s.loading = false;
      s.list = a.payload;
    });
    b.addCase(getAllRecipes.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message ?? "Failed to fetch recipes";
    });
  },
});

export default recipeSlice.reducer;
