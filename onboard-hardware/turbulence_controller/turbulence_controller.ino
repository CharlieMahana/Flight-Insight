// Demo for getting individual unified sensor data from the MPU6050
#include <Adafruit_MPU6050.h>
#include <LiquidCrystal.h>

Adafruit_MPU6050 mpu;
Adafruit_Sensor *mpu_accel;

float prev_x = 0, prev_y = 0, prev_z = 0;
bool turbulence_flag = false;
int counter_delay = 11;

const int TURBULENCE_TOLERANCE = 6;
const int buzzer = 13, rs = 12, en = 11, d4 = 5, d5 = 4, d6 = 3, d7 = 2;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);

void send_serial_data (sensors_event_t* accel) {
  /* Display the results (acceleration is measured in m/s^2) */
  Serial.print(accel->acceleration.x);
  Serial.print(",");
  Serial.print(accel->acceleration.y);
  Serial.print(",");
  Serial.print(accel->acceleration.z);
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
  turbulence_flag = !turbulence_flag;

  
  //  /* Get a new normalized sensor event */
  sensors_event_t accel;
  mpu_accel->getEvent(&accel);
  bool is_turbulent = abs(prev_x - accel.acceleration.x) >= TURBULENCE_TOLERANCE 
                  || abs(prev_y - accel.acceleration.y) >= TURBULENCE_TOLERANCE 
                  || abs(prev_z - accel.acceleration.z) >= TURBULENCE_TOLERANCE;

  if (is_turbulent) {
    counter_delay = 0;
  }

  if (counter_delay < 10) {
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
