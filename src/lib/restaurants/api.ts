import { GooglePlacesSearchResponse, Restaurant } from "@/types";
import { transformPlaceResults } from "./utils";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// 近くのレストランを習得
export async function fetchRestaurants(): Promise<{
  data: Restaurant[];
  error?: string;
}> {
  const desiredTypes = [
    "japanese_restaurant",
    "cafe",
    "cafeteria",
    "coffee_shop",
    "chinese_restaurant",
    "fast_food_restaurant",
    "hamburger_restaurant",
    "french_restaurant",
    "italian_restaurant",
    "pizza_restaurant",
    "ramen_restaurant",
    "sushi_restaurant",
    "korean_restaurant",
    "indian_restaurant",
  ];

  const url = "https://places.googleapis.com/v1/places:searchNearby";

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return { data: [], error: "GOOGLE_API_KEY is not set" };
  }
  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask":
      "places.id,places.displayName,places.types,places.primaryType,places.photos",
  };

  const requestBody = {
    includedTypes: desiredTypes,
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
    return {
      data: [],
      error: `Nearby Search のリクエストに失敗: ${response.status}`,
    };
  }

  const data: GooglePlacesSearchResponse = await response.json();
  console.log(data);
  if (!data.places) {
    return { data: [] };
  }
  const nearbyPlaces = data.places;
  console.log("nearbyPlaces", nearbyPlaces);

  const matchedPlaces = nearbyPlaces.filter(
    (place) => place.primaryType && desiredTypes.includes(place.primaryType)
  );

  console.log("matchedPlaces", matchedPlaces);

  const Restaurants = await transformPlaceResults(matchedPlaces);

  console.log("Restaurants", Restaurants);

  return { data: Restaurants };
}

// 近くのラーメン店を取得
export async function fetchRamenRestaurants(): Promise<{
  data: Restaurant[];
  error?: string;
}> {
  const url = "https://places.googleapis.com/v1/places:searchNearby";

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return { data: [], error: "GOOGLE_API_KEY is not set" };
  }
  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
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
    return {
      data: [],
      error: `Nearby Search のリクエストに失敗: ${response.status}`,
    };
  }

  const data: GooglePlacesSearchResponse = await response.json();
  // console.log(data);
  if (!data.places) {
    return { data: [] };
  }
  const nearbyRamenPlaces = data.places;

  const ramenRestaurants = await transformPlaceResults(nearbyRamenPlaces);

  return { data: ramenRestaurants };
}

export async function getPhotoUrl(name: string, maxWidthPx = 400) {
  "use cache";
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://places.googleapis.com/v1/${name}/media?maxWidthPx=${maxWidthPx}&key=${apiKey}`;
  return url;
}

// キーワードでレストランを検索
export async function fetchRestaurantsByKeyword(
  keyword: string,
  lat: number,
  lng: number
): Promise<{
  data: Restaurant[];
  error?: string;
}> {
  const url = "https://places.googleapis.com/v1/places:searchText";

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return { data: [], error: "GOOGLE_API_KEY is not set" };
  }

  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask":
      "places.id,places.displayName,places.primaryType,places.photos",
  };

  const requestBody = {
    textQuery: keyword,
    maxResultCount: 10,
    locationBias: {
      circle: {
        center: {
          latitude: lat,
          longitude: lng,
        },
        radius: 2000.0,
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
    return {
      data: [],
      error: `Text Search のリクエストに失敗: ${response.status}`,
    };
  }

  const data: GooglePlacesSearchResponse = await response.json();
  if (!data.places) {
    return { data: [] };
  }

  const searchResults = await transformPlaceResults(data.places);
  return { data: searchResults };
}

export async function fetchCategoryRestaurants(category: string): Promise<{
  data: Restaurant[];
  error?: string;
}> {
  const url = "https://places.googleapis.com/v1/places:searchNearby";

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return { data: [], error: "GOOGLE_API_KEY is not set" };
  }
  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask":
      "places.id,places.displayName,places.primaryType,places.photos",
  };
  const requestBody = {
    includedPrimaryTypes: [category],
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
    return {
      data: [],
      error: `Nearby Search のリクエストに失敗: ${response.status}`,
    };
  }

  const data: GooglePlacesSearchResponse = await response.json();
  // console.log(data);
  if (!data.places) {
    return { data: [] };
  }
  const categoryPlaces = data.places;

  const categoryRestaurants = await transformPlaceResults(categoryPlaces);

  // console.log(categoryRestaurants);

  return { data: categoryRestaurants };
}

export async function fetchLocation() {
  const DEFAULT_LOCATION = { lat: 35.6580382, lng: 139.6990609 };

  // 임시로 기본 위치만 반환 (profiles 테이블이 없으므로)
  return DEFAULT_LOCATION;

  /* TODO: profiles 테이블 생성 후 아래 코드 활성화
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  //選択中の住所の緯度と経度を取得
  const { data: seletedAddress, error: seletedAddressError } = await supabase
    .from("profiles")
    .select(
      `
  addresses (
    latitude,longitude
  )
`
    )
    .eq("id", user.id)
    .single();

  if (seletedAddressError) {
    console.error(
      "緯度と経度の取得に失敗しました。",
      seletedAddressError.message
    );
    // エラー時はデフォルト位置を返す
    return DEFAULT_LOCATION;
  }

  const lat = seletedAddress?.addresses?.[0]?.latitude ?? DEFAULT_LOCATION.lat;
  const lng = seletedAddress?.addresses?.[0]?.longitude ?? DEFAULT_LOCATION.lng;

  return { lat, lng };
  */
}
