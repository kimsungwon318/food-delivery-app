export interface GooglePlacesSearchResponse {
  places?: PlaceSearchResult[];
}

export interface PlaceSearchResult {
  id: string;
  displayName?: {
    languageCode?: string;
    text?: string;
  };
  primaryType?: string;
  photos?: PlacePhoto[];
}

export interface PlacePhoto {
  name?: string;
}

export interface Restaurant {
  id: string;
  restaurantName?: string;
  primaryType?: string;
  photoUrl: string;
}

export interface RestaurantSuggestion {
  type: string;
  placeId?: string;
  placeName: string;
}

export interface GooglePlacesAutocompleteApiResponse {
  suggestions?: {
    placePrediction?: {
      place?: string;
      placeId?: string;
      text?: {
        text?: string;
      };
      structuredFormat?: {
        mainText?: {
          text?: string;
        };
        secondaryText?: {
          text?: string;
        };
      };
    };
    queryPrediction?: {
      text?: {
        text?: string;
      };
    };
  }[];
}
