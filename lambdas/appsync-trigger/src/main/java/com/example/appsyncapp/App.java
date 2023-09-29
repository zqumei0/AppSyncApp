package com.example.appsyncapp;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.example.appsyncapp.models.FlightReservation;
import com.fasterxml.jackson.databind.ObjectMapper;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

public class App {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    private static final DynamoDbEnhancedClient enhancedClient = DynamoDbEnhancedClient.create();

    private static final String tableName = System.getenv("DATA_TABLE");

    private static final String dataFileName = System.getenv("DATA_FILE");

    private static LambdaLogger logger;

    public static void handler(Object event, Context context) {
        logger = context.getLogger();
        logger.log("Loading Java Lambda handler to create items.");

        List<FlightReservation> mockData = parseJson();
        logger.log("MockData: " + mockData);
        populateTable(mockData);
    }

    private static void populateTable(List<FlightReservation> mockData) {
        logger.log("Populating Table With Mock Data");
        DynamoDbTable<FlightReservation> table = enhancedClient.table(tableName, TableSchema.fromBean(FlightReservation.class));

        try {
            int uploads = 0;
            for (FlightReservation flightReservation : mockData) {
                logger.log("Uploading item: " + flightReservation);
                table.putItem(flightReservation);
                uploads++;
                if (uploads % 10 == 0) {
                    logger.log(uploads + "Items Uploaded.");
                }
            }
        } catch (Exception e) {
            logger.log(e.getMessage());
            e.printStackTrace();
        }
    }

    private static List<FlightReservation> parseJson() {
        logger.log("Parsing Mock Data From Data File");
        try {
            return Arrays.asList(objectMapper.readValue(Paths.get(dataFileName).toFile(), FlightReservation[].class));
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
