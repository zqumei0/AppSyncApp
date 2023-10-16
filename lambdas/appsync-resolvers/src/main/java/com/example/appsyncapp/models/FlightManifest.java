package com.example.appsyncapp.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
@AllArgsConstructor
public class FlightManifest {
    private int flightNumber;

    public int getFlightNumber() { return this.flightNumber; }

    public void setFlightNumber(int flightNumber) { this.flightNumber = flightNumber; }
}
