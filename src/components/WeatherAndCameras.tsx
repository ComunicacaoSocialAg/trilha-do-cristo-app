import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, AlertTriangle, Camera, Thermometer, Wind, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const METEOBLUE_API_KEY = 'lKCoNk4bWfXInjM5';
const POCOS_DE_CALDAS_COORDS = { lat: -21.7887, lon: -46.5656 };

interface WeatherData {
  day: string;
  temp: string;
  condition: string;
  icon: any;
  humidity: string;
  wind: string;
}

const getWeatherIcon = (code: number) => {
  if (code === 1) return Sun;
  if (code >= 2 && code <= 3) return Cloud;
  if (code >= 4 && code <= 9) return CloudRain;
  return Cloud;
};

const getWeatherCondition = (code: number) => {
  const conditions: { [key: number]: string } = {
    1: 'Ensolarado',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    4: 'Chuva leve',
    5: 'Chuva',
    6: 'Chuva forte',
    7: 'Neve leve',
    8: 'Neve',
    9: 'Tempestade'
  };
  return conditions[code] || 'Indefinido';
};

const mockAlerts = [
  { type: 'warning', message: 'Consulte a previsão atualizada antes de iniciar a trilha' },
  { type: 'info', message: 'Dados fornecidos por Meteoblue para Poços de Caldas' }
];

const mockCameras = [
  { id: 1, name: 'Entrada da Trilha', status: 'online', lastUpdate: '2 min atrás' },
  { id: 2, name: 'Mirante do Cristo', status: 'online', lastUpdate: '1 min atrás' },
  { id: 3, name: 'Ponte de Madeira', status: 'offline', lastUpdate: '15 min atrás' },
  { id: 4, name: 'Cachoeira Principal', status: 'online', lastUpdate: '3 min atrás' }
];

export function WeatherAndCameras() {
  const [selectedCamera, setSelectedCamera] = useState(1);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://my.meteoblue.com/packages/basic-1h_basic-day?lat=${POCOS_DE_CALDAS_COORDS.lat}&lon=${POCOS_DE_CALDAS_COORDS.lon}&asl=1186&format=json&apikey=${METEOBLUE_API_KEY}`
        );
        
        if (response.ok) {
          const data = await response.json();
          
          const days = ['Hoje', 'Amanhã', 'Depois', 'Sexta', 'Sábado', 'Domingo'].slice(0, 5);
          const processedData: WeatherData[] = data.data_day.time.slice(0, 5).map((date: string, index: number) => {
            const temp = Math.round(data.data_day.temperature_max[index]);
            const humidity = data.data_day.relativehumidity_mean[index];
            const wind = Math.round(data.data_day.windspeed_mean[index] * 3.6); // Convert m/s to km/h
            const weatherCode = data.data_day.pictocode[index];
            
            return {
              day: days[index],
              temp: `${temp}°C`,
              condition: getWeatherCondition(weatherCode),
              icon: getWeatherIcon(weatherCode),
              humidity: `${humidity}%`,
              wind: `${wind} km/h`
            };
          });
          
          setWeatherData(processedData);
        }
      } catch (error) {
        console.error('Erro ao buscar dados meteorológicos:', error);
        // Fallback to mock data on error
        setWeatherData([
          { day: 'Hoje', temp: '28°C', condition: 'Ensolarado', icon: Sun, humidity: '65%', wind: '12 km/h' },
          { day: 'Amanhã', temp: '25°C', condition: 'Parcialmente nublado', icon: Cloud, humidity: '70%', wind: '15 km/h' },
          { day: 'Sexta', temp: '22°C', condition: 'Chuva leve', icon: CloudRain, humidity: '85%', wind: '18 km/h' },
          { day: 'Sábado', temp: '26°C', condition: 'Ensolarado', icon: Sun, humidity: '60%', wind: '10 km/h' },
          { day: 'Domingo', temp: '24°C', condition: 'Nublado', icon: Cloud, humidity: '75%', wind: '14 km/h' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Weather Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-primary" />
            Previsão do Tempo - Próximos 5 Dias
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">Carregando previsão do tempo...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {weatherData.map((weather, index) => {
              const IconComponent = weather.icon;
              return (
                <div key={index} className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="font-semibold text-sm text-muted-foreground mb-2">
                    {weather.day}
                  </div>
                  <IconComponent className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="font-bold text-lg mb-1">{weather.temp}</div>
                  <div className="text-xs text-muted-foreground mb-3">{weather.condition}</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-center gap-1">
                      <Droplets className="h-3 w-3" />
                      {weather.humidity}
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Wind className="h-3 w-3" />
                      {weather.wind}
                    </div>
                  </div>
                </div>
              );
             })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weather Alerts */}
      {mockAlerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Alertas Meteorológicos
          </h3>
          {mockAlerts.map((alert, index) => (
            <Alert key={index} variant={alert.type === 'warning' ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Trail Cameras */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Câmeras da Trilha em Tempo Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Camera List */}
            <div className="space-y-3">
              <h4 className="font-medium">Pontos de Monitoramento</h4>
              {mockCameras.map((camera) => (
                <Button
                  key={camera.id}
                  variant={selectedCamera === camera.id ? "default" : "outline"}
                  className="w-full justify-start h-auto p-3"
                  onClick={() => setSelectedCamera(camera.id)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="text-left">
                      <div className="font-medium">{camera.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {camera.lastUpdate}
                      </div>
                    </div>
                    <Badge 
                      variant={camera.status === 'online' ? 'default' : 'secondary'}
                      className={camera.status === 'online' ? 'bg-green-500' : ''}
                    >
                      {camera.status}
                    </Badge>
                  </div>
                </Button>
              ))}
            </div>

            {/* Camera View */}
            <div className="lg:col-span-2">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
                <div className="text-center">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="font-medium mb-2">
                    {mockCameras.find(c => c.id === selectedCamera)?.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Transmissão ao vivo indisponível no momento
                  </p>
                  <Button variant="outline" size="sm">
                    Tentar Reconectar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}