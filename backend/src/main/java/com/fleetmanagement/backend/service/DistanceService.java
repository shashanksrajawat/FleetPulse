package com.fleetmanagement.backend.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.json.JSONObject;
import org.json.JSONArray;

@Service
public class DistanceService {
    
    @Value("${geoapify.api.key}")
    private String apiKey;
    
    // Step 1: Convert address/place name to lat,lng
    private String geocode(String location) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = String.format(
                "https://api.geoapify.com/v1/geocode/search?text=%s&apiKey=%s",
                location.replace(" ", "%20"),
                this.apiKey
            );
            
            String response = restTemplate.getForObject(url, String.class);
            JSONObject json = new JSONObject(response);
            JSONArray features = json.getJSONArray("features");
            
            if (features.length() > 0) {
                JSONArray coordinates = features.getJSONObject(0)
                    .getJSONObject("geometry")
                    .getJSONArray("coordinates");
                
                // Geoapify returns [lng, lat], but routing needs lat,lng
                double lng = coordinates.getDouble(0);
                double lat = coordinates.getDouble(1);
                return lat + "," + lng;
            }
            return null;
        } catch (Exception e) {
            System.err.println("Geocoding Error: " + e.getMessage());
            return null;
        }
    }
    
    // Step 2: Get distance using coordinates
    public Double getDistanceInKm(String source, String destination) {
        try {
            // Convert both locations to coordinates
            String sourceCoords = geocode(source);
            String destCoords = geocode(destination);
            
            if (sourceCoords == null || destCoords == null) {
                System.err.println("Could not geocode locations");
                return 10.0;
            }
            
            RestTemplate restTemplate = new RestTemplate();
            String url = String.format(
                "https://api.geoapify.com/v1/routing?waypoints=%s|%s&mode=drive&apiKey=%s",
                sourceCoords,
                destCoords,
                this.apiKey
            );
            
            String response = restTemplate.getForObject(url, String.class);
            JSONObject json = new JSONObject(response);
            
            long distanceMeters = json.getJSONArray("features")
                    .getJSONObject(0)
                    .getJSONObject("properties")
                    .getLong("distance");
            
            return (double) distanceMeters / 1000;
        } catch (Exception e) {
            System.err.println("Distance API Error: " + e.getMessage());
            return 10.0;
        }
    }
}