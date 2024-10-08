# AirGradient
Join Us in the Fight Against Air Pollution
Seven million people die every year due to air pollution. Monitoring air quality enables people worldwide to better protect themselves.

We are on a mission to bring accurate and affordable air quality monitoring to every corner of the planet and we are supported by a community of more than 10,000 engaged citizens who have already deployed an AirGradient monitor.

To maximize our impact, we have completely open-sourced and shared our monitor design so that others can build upon it.

## Capabilities Reported
The Homey Sensors have the following measurements reported as capabilities

| Measurement          | Description                | Units  | Available Settings               |
|----------------------|----------------------------|--------|-------------------------------|
| PM1          | Particulate Matter 1.0     | µg/m³  |                               |
| PM25         | Particulate Matter 2.5     | µg/m³  |  [x]  Use Corrected Value     |
| PM10         | Particulate Matter 10      | µg/m³  |                               |
| CO2          | Carbon Dioxide             | ppm    |                               |
| PM0.3 Count      | Particulate Matter 0.3 Count |  |                               |
| Temperature  | Temperature                | °C     |  [x]  Use Corrected Value (only Open Air outdoor model)     |
| Humidity     | Relative Humidity          | %      |  [x]  Use Corrected Value (only Open Air outdoor model)     |
| VOC Index          | Senisiron VOC (Volatile Organic Compounds) Index | idx    |                               |
| VOC Raw      | VOC Raw Value               | ticks  |                               |
| NOx Index          | Senisiron NOx (Nitrogen Oxides) Index   | idx    |                               |
| NOx Raw      | NOx Raw Value               | ticks  |                               |

## VOC/NOx Index
![VOC/NOx Index Scale Diagram](https://raw.githubusercontent.com/airgradienthq/airgradient-homey/main/vocnoxindex.png)
For more information see:
https://sensirion.com/media/documents/5FE8673C/61E96F50/Sensirion_Gas_Sensors_Datasheet_SGP41.pdf
