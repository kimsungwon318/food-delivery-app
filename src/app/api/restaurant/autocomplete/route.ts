import {
  GooglePlacesAutocompleteApiResponse,
  RestaurantSuggestion,
} from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const input = searchParams.get("input");
  const sessionToken = searchParams.get("sessionToken");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  console.log("input", input);
  console.log("sessionToken", sessionToken);

  if (!input) {
    return NextResponse.json(
      { error: "文字を入力してください。" },
      { status: 400 }
    );
  }

  if (!sessionToken) {
    return NextResponse.json(
      { error: "セッショントークンは必須です" },
      { status: 400 }
    );
  }

  try {
    const url = "https://places.googleapis.com/v1/places:autocomplete";

    const apiKey = process.env.GOOGLE_API_KEY;
    const header = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey!,
    };
    const requestBody = {
      includeQueryPredictions: true,
      input: input,
      sessionToken: sessionToken,
      includedPrimaryTypes: ["restaurant"],
      locationBias: {
        circle: {
          center: {
            latitude: lat,
            longitude: lng,
          },
          radius: 1000.0,
        },
      },
      languageCode: "ja",
      //   includedRegionCodes: ["jp"],
      regionCode: "jp",
    };

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: header,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData);
      return NextResponse.json(
        {
          error: `Autocompleリクエスト失敗:${response.status}`,
        },
        { status: 500 }
      );
    }

    const data: GooglePlacesAutocompleteApiResponse = await response.json();
    console.log("data", JSON.stringify(data, null, 2));

    const suggestions = data.suggestions ?? [];

    const results = suggestions
      .map((suggestion) => {
        if (
          suggestion.placePrediction &&
          suggestion.placePrediction.placeId &&
          suggestion.placePrediction.structuredFormat?.mainText?.text
        ) {
          return {
            type: "placePrediction",
            placeId: suggestion.placePrediction.placeId,
            placeName:
              suggestion.placePrediction.structuredFormat?.mainText?.text,
          };
        } else if (
          suggestion.queryPrediction &&
          suggestion.queryPrediction.text?.text
        ) {
          return {
            type: "queryPrediction",
            placeName: suggestion.queryPrediction.text?.text,
          };
        }
      })
      .filter(
        (suggestion): suggestion is RestaurantSuggestion =>
          suggestion !== undefined
      );

    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "予期せぬエラーが発生しました" },
      { status: 500 }
    );
  }
}
