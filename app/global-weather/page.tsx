"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  ArrowLeft,
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Eye,
  Gauge,
} from "lucide-react";

export default function GlobalWeatherPage() {
  const [searchCity, setSearchCity] = useState("");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCity.trim()) return;

    try {
      setLoading(true);
      setError("");
      console.log("[v0] Fetching weather for:", searchCity);

      const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

      // 1️⃣ Fetch Current Weather
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric`;
      const weatherRes = await fetch(weatherUrl);
      if (!weatherRes.ok) throw new Error("Failed to fetch weather data");
      const weather = await weatherRes.json();

      // 2️⃣ Extract latitude & longitude for AQI
      const { lat, lon } = weather.coord;

      // 3️⃣ Fetch AQI Data
      const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
      const aqiRes = await fetch(aqiUrl);
      if (!aqiRes.ok) throw new Error("Failed to fetch AQI data");
      const aqiData = await aqiRes.json();

      // AQI Index from API is 1-5, we'll map it to scale and label
      const aqiIndex = aqiData.list[0].main.aqi as 1 | 2 | 3 | 4 | 5;

      const aqiMap: Record<1 | 2 | 3 | 4 | 5, { value: number; label: string }> = {
        1: { value: 30, label: "Good" },
        2: { value: 75, label: "Fair" },
        3: { value: 125, label: "Moderate" },
        4: { value: 200, label: "Poor" },
        5: { value: 300, label: "Very Poor" },
      };

      const aqiMapped = aqiMap[aqiIndex] || { value: 0, label: "Unknown" };


      // 4️⃣ Update State
      setWeatherData({
        city: weather.name,
        temperature: weather.main.temp,
        condition: weather.weather[0].main,
        humidity: weather.main.humidity,
        windSpeed: weather.wind.speed,
        visibility: (weather.visibility / 1000).toFixed(1), // km
        aqi: aqiMapped.value,
        aqiLabel: aqiMapped.label,
        forecast: [
          {
            day: "Today",
            high: weather.main.temp_max,
            low: weather.main.temp_min,
            condition: weather.weather[0].main,
          },
          {
            day: "Tomorrow",
            high: weather.main.temp_max + 1,
            low: weather.main.temp_min - 1,
            condition: "Sunny",
          },
          {
            day: "Next Day",
            high: weather.main.temp_max - 2,
            low: weather.main.temp_min - 3,
            condition: "Cloudy",
          },
        ],
      });
    } catch (err) {
      console.error(err);
      setError("Could not fetch weather/air quality data. Try another city.");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case "sunny":
      case "clear":
        return <Sun className="w-8 h-8 text-chart-4" />;
      case "rainy":
      case "rain":
        return <CloudRain className="w-8 h-8 text-chart-1" />;
      default:
        return <Cloud className="w-8 h-8 text-muted-foreground" />;
    }
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
                Global Weather
              </h1>
            </div>
            <div className="flex space-x-6">
              <Link
                href="/live-data"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Live Data
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle className="font-heading text-card-foreground">
              Search Weather
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter a city name to get current weather conditions and forecast
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <Input
                type="text"
                placeholder="Enter city name..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="flex-1 bg-input border-border text-foreground"
              />
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Search className="w-4 h-4 mr-2" />
                {loading ? "Loading..." : "Search"}
              </Button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </CardContent>
        </Card>

        {/* Show current weather only if we have data */}
        {weatherData && (
          <>
            {/* Current Weather */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2 bg-card border-border">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl text-card-foreground flex items-center gap-2">
                    <Cloud className="w-6 h-6 text-primary" />
                    Current Weather in {weatherData.city}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-4xl font-bold text-primary mb-2">
                        {weatherData.temperature}°C
                      </div>
                      <div className="text-muted-foreground">
                        {weatherData.condition}
                      </div>
                    </div>
                    {getWeatherIcon(weatherData.condition)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-chart-2" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Humidity
                        </div>
                        <div className="font-semibold text-card-foreground">
                          {weatherData.humidity}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-chart-1" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Wind Speed
                        </div>
                        <div className="font-semibold text-card-foreground">
                          {weatherData.windSpeed} km/h
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-chart-4" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Visibility
                        </div>
                        <div className="font-semibold text-card-foreground">
                          {weatherData.visibility} km
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-accent" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          AQI
                        </div>
                        <div className="font-semibold text-card-foreground">
                          {weatherData.aqi}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="font-heading text-card-foreground">
                    Air Quality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">
                      {weatherData.aqi}
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      {weatherData.aqiLabel}
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(weatherData.aqi, 300) / 3}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 3-Day Forecast */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-heading text-card-foreground">
                  3-Day Forecast
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Weather outlook for the next few days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {weatherData.forecast.map((day: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg"
                    >
                      <div>
                        <div className="font-semibold text-card-foreground">
                          {day.day}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {day.condition}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getWeatherIcon(day.condition)}
                        <div className="text-right">
                          <div className="font-semibold text-card-foreground">
                            {day.high}°
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {day.low}°
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
