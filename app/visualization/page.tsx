"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Gauge } from "@mui/x-charts/Gauge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DataPoint {
  time: string;
  temperature: number;
  pressure: number;
  co2: number;
  aqi: number;
}

export default function VisualizationPage() {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3001/data");
        const json = await res.json();

        setData((prev) => {
          const newData = [
            ...prev,
            {
              time: new Date().toLocaleTimeString(),
              temperature: json.temperature,
              pressure: json.pressure,
              co2: json.co2,
              aqi: json.aqi,
            },
          ];
          return newData.slice(-30); // keep last 30
        });
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const latest = data[data.length - 1];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation (like Global Weather) */}
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
                Visualization
              </h1>
            </div>
            <div className="flex space-x-6">
              <Link
                href="/global-weather"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Global Weather
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Temperature */}
        <Card>
          <CardHeader>
            <CardTitle>Temperature (°C)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="time" hide />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pressure */}
        <Card>
          <CardHeader>
            <CardTitle>Pressure (hPa)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="time" hide />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="pressure"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* CO2 */}
        <Card>
          <CardHeader>
            <CardTitle>CO₂ (ppm)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="time" hide />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="co2"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AQI Gauge */}
        <Card>
          <CardHeader>
            <CardTitle>AQI</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-64">
            {latest ? (
              <Gauge
                value={latest.aqi}
                valueMin={0}
                valueMax={400}
                text={`${latest.aqi} AQI`}
              />
            ) : (
              <p className="text-muted-foreground">No data yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
