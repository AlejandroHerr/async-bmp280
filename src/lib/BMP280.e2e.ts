import { Bus } from 'async-i2c-bus';

import BMP280 from './BMP280';
import { REGISTERS } from './constants';

describe('BMP280', () => {
  it('should interface with device', async () => {
    const busNumber = 1;
    const bus = Bus({ busNumber });

    await bus.open();

    const bmp280 = BMP280({ bus });

    await bmp280.writeByte(REGISTERS.RESET, 0xb6);

    await bmp280.init();

    expect(bmp280.readByte(REGISTERS.CTRL_MEAS)).resolves.toBe(0b00101111);
    expect(bmp280.readControlMeasurement()).resolves.toBe({
      temperatureOversampling: 'x1',
      pressureOversampling: 'x4',
      mode: 'NORMAL',
    });
    expect(bmp280.readByte(REGISTERS.CONFIG)).resolves.toBe(0b00011100);
    expect(bmp280.readConfig()).resolves.toBe({
      standbyTime: '500ms',
      iirFilter: 'x4',
    });

    const temperature = await bmp280.readTemperature();

    console.log(`Temperature: ${temperature}°C`);

    expect(temperature).toBeGreaterThan(0);
    expect(temperature).toBeLessThan(40);

    const pressure = await bmp280.readTemperature();

    console.log(`Pressure: ${pressure}Pa`);

    expect(pressure).toBeGreaterThan(900);
    expect(pressure).toBeLessThan(1100);

    await bmp280.writeByte(REGISTERS.RESET, 0xb6);
  });
});
