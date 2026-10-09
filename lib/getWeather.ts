// lib/getWeather.ts
export async function getWeather(city: string) {
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY; // store key in .env
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch weather data");
  }

  return res.json();
}
