import React from "react";
import Section from "@/components/ui/section";
import RestaurantCard from "@/components/ui/restaurant-card";
import CarouselContainer from "@/components/ui/carousel-container";
import { fetchRamenRestaurants, fetchRestaurants } from "@/lib/restaurants/api";
import { Restaurant } from "@/types";
import RestaurantList from "@/components/ui/restaurant-list";
import Categories from "@/components/ui/categories";

export default async function Home() {
  const { data: nearbyRamenRestaurants, error: nearbyRamenRestaurantsError } =
    await fetchRamenRestaurants();
  const { data: nearbyRestaurants, error: nearbyRestaurantsError } =
    await fetchRestaurants();

  if (nearbyRamenRestaurantsError) {
    console.error(nearbyRamenRestaurantsError);
  }

  return (
    <>
      <Categories />

      {/* レストラン情報表示 */}
      {!nearbyRestaurants ? (
        <p>{nearbyRestaurantsError}</p>
      ) : nearbyRestaurants.length > 0 ? (
        <Section
          title="近くのレストラン"
          expandedContent={<RestaurantList restaurants={nearbyRestaurants} />}
        >
          <CarouselContainer slideToShow={4}>
            {nearbyRestaurants.map((restaurant: Restaurant, index: number) => (
              <RestaurantCard key={index} restaurant={restaurant} />
            ))}
          </CarouselContainer>
        </Section>
      ) : (
        <p>近くにレストランがありません</p>
      )}
      {!nearbyRamenRestaurants ? (
        <p>{nearbyRamenRestaurantsError}</p>
      ) : nearbyRamenRestaurants.length > 0 ? (
        <Section
          title="近くのラーメン店"
          expandedContent={
            <RestaurantList restaurants={nearbyRamenRestaurants} />
          }
        >
          <CarouselContainer slideToShow={4}>
            {nearbyRamenRestaurants.map(
              (restaurant: Restaurant, index: number) => (
                <RestaurantCard key={index} restaurant={restaurant} />
              )
            )}
          </CarouselContainer>
        </Section>
      ) : (
        <p>近くにラーメン店がありません</p>
      )}
    </>
  );
}
