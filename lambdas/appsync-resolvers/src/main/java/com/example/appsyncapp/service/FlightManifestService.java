package com.example.appsyncapp.service;

import com.example.appsyncapp.adapters.DynamoDbAdapter;
import com.example.appsyncapp.models.FlightManifest;
import com.example.appsyncapp.models.FlightReservation;

import java.util.List;

public class FlightManifestService {
  private final DynamoDbAdapter DynamoDbAdapter;
  private final String tableName = System.getenv("DATA_TABLE");

  public FlightManifestService() {
    this.DynamoDbAdapter = new DynamoDbAdapter();
  }

   public boolean generateFlightManifests(List<FlightManifest> flightManifestRequests) {
      for (FlightManifest flightManifestrequest: flightManifestRequests) {
          boolean isManifestGenerated = this.generateFlightManifest(flightManifestrequest);
      }
   }

   private boolean generateFlightManifest(FlightManifest flightManifestRequest) {
      return false;
   }

}
