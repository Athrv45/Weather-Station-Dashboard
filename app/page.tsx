import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CloudSun, Thermometer, Droplets, Wind } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="font-heading text-xl font-bold text-foreground">Smart Weather Dashboard</h1>
              <div className="hidden md:flex space-x-6">
                <Link href="/" className="text-primary font-medium">
                  Home
                </Link>
                <Link href="/global-weather" className="text-muted-foreground hover:text-foreground transition-colors">
                  Global Weather
                </Link>
                <Link href="/live-data" className="text-muted-foreground hover:text-foreground transition-colors">
                  Live Data
                </Link>
                <Link href="/visualization" className="text-muted-foreground hover:text-foreground transition-colors">
                  Visualization
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6">
            Smart Weather & Air Quality Dashboard
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Track global weather and live sensor data in one place. Get real-time updates from your Arduino sensors
            alongside comprehensive weather forecasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/global-weather">View Global Weather</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-muted bg-transparent"
            >
              <Link href="/live-data">Check Live Sensors</Link>
            </Button>
             <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/visualization">Visualize Your Data</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-center text-foreground mb-12">
            Weather Data at Your Fingertips
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <CloudSun className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="font-heading text-card-foreground">Global Weather</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-muted-foreground">
                  Access weather data for any city worldwide with detailed forecasts and conditions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Thermometer className="w-12 h-12 text-accent mx-auto mb-4" />
                <CardTitle className="font-heading text-card-foreground">Temperature Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-muted-foreground">
                  Monitor real-time temperature readings from your Arduino sensors with trend analysis.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Droplets className="w-12 h-12 text-chart-2 mx-auto mb-4" />
                <CardTitle className="font-heading text-card-foreground">Humidity & Air Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-muted-foreground">
                  Track humidity levels and air quality index with alerts for unhealthy conditions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Wind className="w-12 h-12 text-chart-4 mx-auto mb-4" />
                <CardTitle className="font-heading text-card-foreground">Wind & Pressure</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-muted-foreground">
                  Monitor wind speed and atmospheric pressure with weather prediction alerts.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-center text-foreground mb-12">
            Current Conditions Overview
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card border-border text-center">
              <CardHeader>
                <CardTitle className="font-heading text-2xl text-primary">24°C</CardTitle>
                <CardDescription className="text-muted-foreground">Current Temperature</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border text-center">
              <CardHeader>
                <CardTitle className="font-heading text-2xl text-accent">65%</CardTitle>
                <CardDescription className="text-muted-foreground">Humidity Level</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border text-center">
              <CardHeader>
                <CardTitle className="font-heading text-2xl text-chart-2">Good</CardTitle>
                <CardDescription className="text-muted-foreground">Air Quality</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted border-t border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">
            Smart Weather & Air Quality Dashboard - Real-time environmental monitoring
          </p>
        </div>
      </footer>
    </div>
  )
}
