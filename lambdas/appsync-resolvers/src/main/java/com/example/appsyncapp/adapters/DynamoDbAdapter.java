package com.example.appsyncapp.adapters;

import com.example.appsyncapp.models.FlightManifest;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;

public class DynamoDbAdapter {
  private static DynamoDbEnhancedClient dynamoDbEnhancedClient;

  public DynamoDbAdapter() {
    if (dynamoDbEnhancedClient == null) {
      dynamoDbEnhancedClient = DynamoDbEnhancedClient.create();
    }
  }

  public DynamoDbEnhancedClient getDynamoDbEnhancedClient() {
    return dynamoDbEnhancedClient;
  }

  public void getFlightManifest(FlightManifest flightManifestRequest) {

  }
}