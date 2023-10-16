package com.example.appsyncapp.handlers;

import java.util.Map;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.events.SQSEvent;
import com.amazonaws.services.lambda.runtime.events.SQSEvent.SQSMessage;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.example.appsyncapp.adapters.DynamoDbAdapter;
import com.example.appsyncapp.models.FlightManifest;
import com.example.appsyncapp.models.FlightReservation;
import com.example.appsyncapp.service.FlightManifestService;
// import com.example.appsyncapp.service.GenerateFlightManifestService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import java.util.List;

// public class GenerateFlightManifestHandler implements RequestHandler<Map<String, Object>, Void> {
public class GenerateFlightManifestHandler {
  private static LambdaLogger logger;
  private final ObjectMapper objectMapper;
  private final FlightManifestService flightManifestService;

  public GenerateFlightManifestHandler() {
    this.objectMapper = new ObjectMapper();
    this.flightManifestService = new FlightManifestService();
  }

  /**
   * 
   * @param event:
   * @param context
   * @return
   */
  public Void handleRequest(final SQSEvent event, final Context context) {
    logger = context.getLogger();
    logger.log("Event: " + event.toString());

    List<FlightManifest> flightManifestRequests = this.setRequestParameters(event.getRecords());
    this.flightManifestService.generateFlightManifests(flightManifestRequests);
    /*
    {
  Records=[
    {
      messageId=8f2b708d-c4dc-4510-8fa7-80b0597f97f1,
      receiptHandle=AQEBgMp/EZ3BV5pLruUlYpnpWqQ8UQzn435vbtMyzgUtVLm1DZDejMXRfbMbyCRh2WjppmwY4YHyI8FEfdDydcf04cIVgJlZb9yavui0H9KFr18Y29OYWmhtMVkYN059/uastDZ+hBXSd6htmHTulB//as/EJAhpwwX24LFmhU0NGZk5klztMboyGXa8Z+oH3NONXGK4/VlJfEnevfehsvpOo7k9GM8ItclDCZ02xzZIQI+KEnSxJK/b1IS4AQKyVgF+crycW31adE4cFMwBIEbIAm07eqecmUiLfQ4Km7P3k2Fi12VlSb99MfxYBNhhmtJ2mL0C0B19z8ehxuMr/C+z0ha2yEsK21KXpQUG3TJiT4Y5DLzl6PrtBMPGWuClOAOOaHS3C47fm961eqsE7zAR5w==,
      body={
        flightNumber=10
      },
      attributes={
        ApproximateReceiveCount=1,
        SentTimestamp=1696354980499,
        SenderId=AROASYCLHM3PZYIAHYZ2Z:APPSYNC_ASSUME_ROLE,
        ApproximateFirstReceiveTimestamp=1696354980509
      },
      messageAttributes={},
      md5OfBody=aad0742ee85ab6a402f807aa1042c88e,
      eventSource=aws:sqs,
      eventSourceARN=arn:aws:sqs:us-east-1:189136332511:AppSyncExample-ReportQueue,
      awsRegion=us-east-1
    }
  ]
}
     */
    return null;
  }

  @SuppressWarnings(value="unchecked")
  private List<FlightManifest> setRequestParameters(List<SQSMessage> records) {
    return (List<FlightManifest>) records.stream().map(message -> {
      try {
        return objectMapper.readValue(message.getBody(), FlightManifest.class);
      } catch (JsonProcessingException e) {
        throw new RuntimeException(e);
      }
    });
  }

}
