import React from "react";
import Section from "@/components/ui/section";
import RestaurantCard from "@/components/ui/restaurant-card";
import CarouselContainer from "@/components/ui/carousel-container";
import { fetchRamenRestaurants } from "@/lib/restaurants/api";

export default async function Home() {
  await fetchRamenRestaurants();
  return (
    <Section title="近くのお店">
      <CarouselContainer slideToShow={4}>
        {Array.from({ length: 10 }).map((_, index) => (
          <RestaurantCard key={index} />
        ))}
      </CarouselContainer>
    </Section>
  );
}
