"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

export default function LiveDataPage() {
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
    aqi: 0,
    co2: 0,
    pressure: 0,
    altitude: 0,
    lastUpdated: new Date(),
  });

  const [temperatureHistory, setTemperatureHistory] = useState<number[]>([]);
  const [aqiHistory, setAqiHistory] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3001/data");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();

        setSensorData({
          ...data,
          lastUpdated: new Date(),
        });

        setTemperatureHistory((prev) =>
          [...prev.slice(-9), data.temperature] // keep last 10 readings
        );
        setAqiHistory((prev) => [...prev.slice(-9), data.aqi]);
      } catch (err) {
        console.error("Failed to fetch live data:", err);
      }
    };

    fetchData(); // first call immediately
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return { status: "Good", color: "text-accent" };
    if (aqi <= 100) return { status: "Moderate", color: "text-chart-4" };
    return { status: "Unhealthy", color: "text-destructive" };
  };

  const getPressureAlert = (pressure: number) => {
    if (pressure < 1010) return "Rain likely soon";
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              <h1 className="font-heading text-xl font-bold text-foreground">
                Live Arduino Data
              </h1>
            </div>
            <div className="flex space-x-6">
              <Link
                href="/visualization"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Visualization
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Header */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle className="font-heading text-card-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Real-time Sensor Readings
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Last updated: {sensorData.lastUpdated.toLocaleTimeString()}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Alerts */}
        {(sensorData.aqi > 100 || getPressureAlert(sensorData.pressure)) && (
          <Card className="bg-destructive/10 border-destructive/20 mb-8">
            <CardHeader>
              <CardTitle className="font-heading text-destructive flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Weather Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sensorData.aqi > 100 && (
                  <div className="text-destructive">
                    ⚠️ Unhealthy Air Quality (AQI:{" "}
                    {Math.round(sensorData.aqi)})
                  </div>
                )}
                {getPressureAlert(sensorData.pressure) && (
                  <div className="text-destructive">
                    🌧️ {getPressureAlert(sensorData.pressure)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sensor Data Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Temperature
              </CardTitle>
              <Thermometer className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {sensorData.temperature.toFixed(1)}°C
              </div>
              <p className="text-xs text-muted-foreground">
                Arduino sensor reading
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Humidity
              </CardTitle>
              <Droplets className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-2">
                {Math.round(sensorData.humidity)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Relative humidity level
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Air Quality Index
              </CardTitle>
              <Gauge className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  getAQIStatus(sensorData.aqi).color
                }`}
              >
                {Math.round(sensorData.aqi)}
              </div>
              <p className="text-xs text-muted-foreground">
                {getAQIStatus(sensorData.aqi).status} air quality
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                CO₂ Level
              </CardTitle>
              <Gauge className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-4">
                {sensorData.co2.toFixed(1)} PPM
              </div>
              <p className="text-xs text-muted-foreground">
                Measured CO₂ concentration
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pressure
              </CardTitle>
              <Gauge className="h-4 w-4 text-chart-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-5">
                {sensorData.pressure.toFixed(1)} hPa
              </div>
              <p className="text-xs text-muted-foreground">
                Atmospheric pressure
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Altitude
              </CardTitle>
              <Wind className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-1">
                {sensorData.altitude.toFixed(1)} m
              </div>
              <p className="text-xs text-muted-foreground">
                Approx. above sea level
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Simple Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-card-foreground">
                Temperature Trend
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Last 10 readings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-end justify-between gap-1">
                {temperatureHistory.map((temp, index) => (
                  <div
                    key={index}
                    className="bg-primary rounded-t flex-1 transition-all duration-300"
                    style={{
                      height: `${((temp - 15) / 15) * 100}%`,
                      minHeight: "4px",
                    }}
                    title={`${temp.toFixed(1)}°C`}
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-card-foreground">
                AQI Trend
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Last 10 readings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-end justify-between gap-1">
                {aqiHistory.map((aqi, index) => (
                  <div
                    key={index}
                    className={`rounded-t flex-1 transition-all duration-300 ${
                      aqi <= 50
                        ? "bg-accent"
                        : aqi <= 100
                        ? "bg-chart-4"
                        : "bg-destructive"
                    }`}
                    style={{
                      height: `${(aqi / 500) * 100}%`,
                      minHeight: "4px",
                    }}
                    title={`AQI: ${Math.round(aqi)}`}
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
