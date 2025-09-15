// import Categories from "@/components/categories";
// import RestaurantList from "@/components/restaurant-list";
// import {
//   fetchCategoryRestaurants,
//   fetchLocation,
//   fetchRestaurantsByKeyword,
// } from "@/lib/restaurants/api";
import Categories from "@/components/ui/categories";
import RestaurantList from "@/components/ui/restaurant-list";
import {
  fetchCategoryRestaurants,
  fetchLocation,
  fetchRestaurantsByKeyword,
} from "@/lib/restaurants/api";
import { redirect } from "next/navigation";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ category: string; restaurant: string }>;
}) {
  const { category, restaurant } = await searchParams;
  console.log("restaurant", restaurant);

  const { lat, lng } = await fetchLocation();

  if (category) {
    const { data: categoryRestaurants, error: fetchError } =
      await fetchCategoryRestaurants(category);

    console.log("categoryRestaurants", categoryRestaurants);

    return (
      <>
        <div className="mb-4">
          <Categories />
        </div>
        {/* レストラン情報表示 */}
        {!categoryRestaurants ? (
          <p>{fetchError}</p>
        ) : categoryRestaurants.length > 0 ? (
          <RestaurantList restaurants={categoryRestaurants} />
        ) : (
          <p>
            カテゴリ<strong>{category}</strong>
            に一致するレストランが見つかりません
          </p>
        )}
      </>
    );
  } else if (restaurant) {
    const { data: restaurants, error: fetchError } =
      await fetchRestaurantsByKeyword(restaurant, lat, lng);
    console.log("text_search_results", restaurants);

    return (
      <>
        {!restaurants ? (
          <p className="text-destructive">{fetchError}</p>
        ) : restaurants.length > 0 ? (
          <>
            <div className="mb-4">
              {restaurant} の検索結果 {restaurants.length} 件の結果
            </div>
            <RestaurantList restaurants={restaurants} />
          </>
        ) : (
          <p>
            <strong>{restaurant}</strong>
            に一致するレストランが見つかりません
          </p>
        )}
      </>
    );
  } else {
    redirect("/");
  }
}
