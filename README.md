# async-bmp280

[![Npm Package](https://img.shields.io/npm/v/async-bmp280.svg)](https://www.npmjs.com/package/async-bmp280) [![Dependencies](https://img.shields.io/david/AlejandroHerr/async-bmp280.svg?style=flat-square)](https://david-dm.org/alejandroherr/async-bmp280) [![Dev Dependencies](https://img.shields.io/david/dev/AlejandroHerr/async-bmp280.svg?style=flat-square)](https://david-dm.org/alejandroherr/async-bmp280?type=dev) ![CircleCI](https://img.shields.io/circleci/project/github/AlejandroHerr/async-bmp280/master.svg?style=flat-square&logo=circleci) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release) [![MIT License](https://img.shields.io/github/license/AlejandroHerr/async-bmp280.svg?style=flat-square)](https://github.com/AlejandroHerr/async-bmp280/blob/master/LICENSE.md)

JavaScript interface to control the temperature and pressure sensors [BMP280](https://ae-bst.resource.bosch.com/media/_tech/media/datasheets/BST-BMP280-DS001.pdf). The `BMP280Interface` extends the `DeviceInterface` of [async-i2c-bus](https://github.com/AlejandroHerr/async-i2c-bus).

## Installation

To use this library you will also have to install [async-i2c-bus](https://github.com/AlejandroHerr/async-i2c-bus).

Yarn:

```bash
yarn add async-i2c-bus async-i2c-bus
```

or npm:

```bash
npm i -P async-i2c-bus async-i2c-bus
```

And you're ready to go.

### Requirements

The package requires node `v8.10.x` or higher.
If you need a compatibility with lower versions of node, you can build it. To do so clone the repo in your workspace, and modify the `target` options in the `tsconfig.json`, e.g:

```js
{
  "compilerOptions": {
    "target": "es5", // <-- Line changed
    "outDir": "dist/main",
    "rootDir": "src",
    // ..
  }
}
```

And build the module with `yarn build` or `npm run build`.

## Usage

The `BMP280` takes as argument and instance of the `BusInterface`:

```javascript
function BMP280({ bus }: { bus: BusInterface }): BMP280Interface;
```

The next step is to `init` the device to reset, acquire temperature/pressure compensation and configure the device:

```javascript
init(params?: Partial<BMP280ControlMeasurement & BMP280Config>): Promise<BMP280Interface>;
```

After this step, the device is ready to `readTemperature` and to `readPressure`.

For more details, check the full auto-generated [documentation](https://alejandroherr.github.io/async-bmp280/) and get familiar with [BMP280 datasheet](https://ae-bst.resource.bosch.com/media/_tech/media/datasheets/BST-BMP280-DS001.pdf).

### Example of `NORMAL` usage

```javascript
import { Bus } from 'async-i2c-bus';
import { BMP280 } from 'async-i2c-bus';

const main = async () => {
  const busNumber = 1;
  const bus = Bus({ busNumber });

  await bus.open();

  const bmp280 = BMP280({ bus });

  await bmp280.init();

  let temperature = 0;
  let pressure = 0;

  /** Read temperature/pressure every second */
  while (1) {
    [temperature, pressure] = await Promise.all([bmp280.readTemperature(), bmp280.readPressure()]);

    console.log(`Temperature: ${temperature}°C`);
    console.log(`Pressure: ${pressure}Pa`);

    await new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }
};
```

### Example of `FORCED` usage

```javascript
import { Bus } from 'async-i2c-bus';
import { BMP280, IIR_FILTER, MODE, OVERSAMPLING } from 'async-i2c-bus';

const main = async () => {
  const busNumber = 1;
  const bus = Bus({ busNumber });

  await bus.open();

  const bmp280 = BMP280({ bus });

  // Use your values
  await bmp280.init({
    temperatureOversampling: OVERSAMPLING.x16,
    pressureOversampling: OVERSAMPLING.x16,
    mode: MODE.FORCED,
    iirFilter: IIR_FILTER.x0,
  });

  /** Read temperature/pressure once */
  const [temperature, pressure] = await Promise.all([bmp280.readTemperature(), bmp280.readPressure()]);

  console.log(`Temperature: ${temperature}°C`);
  console.log(`Pressure: ${pressure}Pa`);
};
```
