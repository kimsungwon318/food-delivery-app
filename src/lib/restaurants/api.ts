import { GooglePlacesSearchResponse } from "@/types";
import { transformPlaceResults } from "./utils";

export async function fetchRamenRestaurants() {
  const url = "https://places.googleapis.com/v1/places:searchNearby";

  const apiKey = process.env.GOOGLE_API_KEY;
  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey!,
    "X-Goog-FieldMask":
      "places.id,places.displayName,places.primaryType,places.photos",
  };
  const requestBody = {
    includedPrimaryTypes: ["ramen_restaurant"],
    maxResultCount: 10,
    locationRestriction: {
      circle: {
        center: {
          latitude: 35.6669248, //渋谷
          longitude: 139.6514163, //渋谷
        },
        radius: 1000.0,
      },
    },
    languageCode: "ja",
    rankPreference: "DISTANCE",
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: header,
    next: {
      revalidate: 86400,
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("エラーテキスト", errorText);
    return { error: `Nearby Search のリクエストに失敗: ${response.status}` };
  }

  const data: GooglePlacesSearchResponse = await response.json();
  // console.log(data);
  if (!data.places) {
    return {
      data: [],
    };
  }
  const nearybyRamenPlaces = data.places;

  const RamenRestaurants = await transformPlaceResults(nearybyRamenPlaces);
  console.log(RamenRestaurants);

  // return RamenRestaurants;
}

export async function getPhotoUrl(name: string, maxWidthPx = 400) {
  "use cache";
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://places.googleapis.com/v1/${name}/media?maxWidthPx=${maxWidthPx}&key=${apiKey}`;
  return url;
}
