// Demo for getting individual unified sensor data from the MPU6050
#include <Adafruit_MPU6050.h>
#include <LiquidCrystal.h>
#include <dht11.h>

enum CODES { CLEAR, TURBULENT };

Adafruit_MPU6050 mpu;
Adafruit_Sensor *mpu_accel;
dht11 DHT11;

float prev_x = 0, prev_y = 0, prev_z = 0;
int counter_delay = 11;

const int DELAY = 10;
const int buzzer = 13, dht = 7, rs = 12, en = 11, d4 = 5, d5 = 4, d6 = 3, d7 = 2;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);

void send_serial_data (sensors_event_t* accel) {
  /* Display the results (acceleration is measured in m/s^2) */
  Serial.print(accel->acceleration.x);
  Serial.print(",");
  Serial.print(accel->acceleration.y);
  Serial.print(",");
  Serial.print(accel->acceleration.z);
  Serial.println();
  Serial.print(DHT11.humidity);
  Serial.print(",");
  Serial.print(DHT11.temperature);
  Serial.println();
}

void play_warning_sound() {
  // buzz 3 times
  digitalWrite(buzzer, HIGH);
  delay(50);
  digitalWrite(buzzer, LOW);
  delay(50);
  digitalWrite(buzzer, HIGH);
  delay(50);
  digitalWrite(buzzer, LOW);
  delay(50);
  digitalWrite(buzzer, HIGH);
  delay(50);
  digitalWrite(buzzer, LOW);
}

void print_lcd_accel (sensors_event_t* accel) {
  lcd.setCursor(0, 1);
  // print the number of seconds since reset:
  lcd.print(accel->acceleration.x);
  lcd.print(",");
  lcd.print(accel->acceleration.y);
  lcd.print(",");
  lcd.print(accel->acceleration.z);
  lcd.println();
}

void setup(void) {
  pinMode(buzzer, OUTPUT);
  // LCD
  lcd.begin(16, 2);
  
  Serial.begin(9600);
  while (!Serial)
    delay(10); // will pause Zero, Leonardo, etc until serial console opens

  // Serial.println("Adafruit MPU6050 test!");

  if (!mpu.begin()) {
    // Serial.println("Failed to find MPU6050 chip");
    while (1) {
      delay(10);
    }
  }

  // Serial.println("MPU6050 Found!");
  mpu_accel = mpu.getAccelerometerSensor();
}

void loop() {
  int chk = DHT11.read(dht);
  
  //  /* Get a new normalized sensor event */
  sensors_event_t accel;
  mpu_accel->getEvent(&accel);
  // Serial.println(Serial.read(), DEC);

  // control
  if (Serial.available() > 0) {
    switch (Serial.read()) {
      case TURBULENT:
        counter_delay = 0;
        break;
      default:
        break;
    }
  }

  if (counter_delay < DELAY) {
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("TURBULENCE!");
    digitalWrite(buzzer, HIGH);
    counter_delay++;
  }
  
  send_serial_data(&accel);
  print_lcd_accel(&accel);

  prev_x = accel.acceleration.x, prev_y = accel.acceleration.y, prev_z = accel.acceleration.z;

  delay(100);
  digitalWrite(buzzer, LOW);
  lcd.setCursor(0,0);
  lcd.print("NO TURBULENCE!");
}
