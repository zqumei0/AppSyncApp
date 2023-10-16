package com.example.appsyncapp.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbAttribute;

@DynamoDbBean
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightReservation {
  private String reservationId;
  private String passengerName;
  private int flightNumber;
  private String departureDate;
  private String departureTime;
  private String arrivalDate;
  private String arrivalTime;
  private String origin;
  private String destination;
  private String seatNumber;

  @DynamoDbPartitionKey
  @DynamoDbAttribute("reservationId")
  public String getReservationId() {
    return this.reservationId;
  }

  public void setReservationId(String reservationId) {
    this.reservationId = reservationId;
  }

  public String getPassengerName() {
    return this.passengerName;
  }

  public void setPassengerName(String passengerName) {
    this.passengerName = passengerName;
  }

  public int getFlightNumber() {
    return this.flightNumber;
  }

  public void setFlightNumber(int flightNumber) {
    this.flightNumber = flightNumber;
  }

  public String getDeparture_date() {
    return this.departureDate;
  }

  public void setDeparture_date(String departure_date) {
    this.departureDate = departure_date;
  }

  public String getDeparture_time() {
    return this.departureTime;
  }

  public void setDeparture_time(String departure_time) {
    this.departureTime = departure_time;
  }

  public String getArrival_date() {
    return this.arrivalDate;
  }

  public void setArrival_date(String arrival_date) {
    this.arrivalDate = arrival_date;
  }

  public String getArrival_time() {
    return this.arrivalTime;
  }

  public void setArrival_time(String arrival_time) {
    this.arrivalTime = arrival_time;
  }

  public String getOrigin() {
    return this.origin;
  }

  public void setOrigin(String origin) {
    this.origin = origin;
  }

  public String getDestination() {
    return this.destination;
  }

  public void setDestination(String destination) {
    this.destination = destination;
  }

  public String getSeatNumber() {
    return this.seatNumber;
  }

  public void setSeatNumber(String seatNumber) {
    this.seatNumber = seatNumber;
  }
}
