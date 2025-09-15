"use client";

import { useRouter, useSearchParams } from "next/navigation";
import CarouselContainer from "./carousel-container";
import Category from "./category";

export interface CategoryType {
  categoryName: string;
  type: string;
  imageUrl: string;
}

export default function Categories() {
  const categories = [
    {
      categoryName: "ファーストフード",
      type: "fast_food_restaurant",
      imageUrl: "/images/categories/fastfood.png",
    },
    {
      categoryName: "日本料理",
      type: "japanese_restaurant",
      imageUrl: "/images/categories/icons8-rice-cracker-96.png",
    },
    {
      categoryName: "ラーメン",
      type: "ramen_restaurant",

      imageUrl: "/images/categories/icons8-ramen-96.png",
    },
    {
      categoryName: "寿司",
      type: "sushi_restaurant",
      imageUrl: "/images/categories/icons8-sushi-96.png",
    },
    {
      categoryName: "中華料理",
      type: "chinese_restaurant",

      imageUrl: "/images/categories/icons8-gyoza-96.png",
    },
    {
      categoryName: "コーヒ-",
      type: "cafe",
      imageUrl: "/images/categories/icons8-coffee-96.png",
    },
    {
      categoryName: "イタリアン",
      type: "italian_restaurant",
      imageUrl: "/images/categories/icons8-pizza-96.png",
    },
    {
      categoryName: "フランス料理",
      type: "french_restaurant",
      imageUrl: "/images/categories/icons8-baguette-bread-96.png",
    },

    {
      categoryName: "ピザ",
      type: "pizza_restaurant",
      imageUrl: "/images/categories/icons8-pizza-96.png",
    },

    {
      categoryName: "韓国料理",
      type: "korean_restaurant",
      imageUrl: "/images/categories/icons8-kimchi-96.png",
    },
    {
      categoryName: "インド料理",
      type: "indian_restaurant",
      imageUrl: "/images/categories/icons8-naan-96.png",
    },
  ];

  const searchParams = useSearchParams();
  const router = useRouter();
  const currentCategory = searchParams.get("category");

  const searchRestaurantsOfCategory = (category: string) => {
    console.log("category", category);

    const params = new URLSearchParams(searchParams);

    if (currentCategory === category) {
      router.replace("/");
    } else {
      params.set("category", category);
      router.replace(`/search?${params.toString()}`);
    }
  };

  return (
    <CarouselContainer slideToShow={10}>
      {categories.map((category) => (
        <Category
          key={category.type}
          category={category}
          onClick={searchRestaurantsOfCategory}
          select={category.type === currentCategory}
        />
      ))}
    </CarouselContainer>
  );
}
