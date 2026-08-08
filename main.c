#include <stdio.h>
#include <stdlib.h>
#include <time.h>

typedef struct {
    float altitude;
    float temperature;
    float battery;
    float speed;
} Telemetry;

Telemetry read_telemetry(void)
{
    Telemetry data;

    data.altitude = 100.0f + (rand() % 500) / 10.0f;
    data.temperature = 20.0f + (rand() % 150) / 10.0f;
    data.battery = 100.0f - (rand() % 300) / 10.0f;
    data.speed = (rand() % 300) / 10.0f;

    return data;
}

void print_telemetry(const Telemetry *data)
{
    printf("\n========== LDOS TELEMETRY ==========\n");
    printf("Altitude     : %.1f m\n", data->altitude);
    printf("Temperature  : %.1f °C\n", data->temperature);
    printf("Battery      : %.1f %%\n", data->battery);
    printf("Speed        : %.1f m/s\n", data->speed);
    printf("====================================\n");
}

int main(void)
{
    srand((unsigned int)time(NULL));

    printf("LDOS Telemetry System\n");
    printf("---------------------\n");

    for (int i = 0; i < 10; i++) {
        Telemetry telemetry = read_telemetry();
        print_telemetry(&telemetry);
    }

    return 0;
}