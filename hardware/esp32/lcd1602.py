from machine import Pin
import time

class LCD1602_4bit:
    def __init__(self, rs, e, d4, d5, d6, d7):
        self.rs = Pin(rs, Pin.OUT)
        self.e = Pin(e, Pin.OUT)
        self.data_pins = [Pin(d4, Pin.OUT), Pin(d5, Pin.OUT), Pin(d6, Pin.OUT), Pin(d7, Pin.OUT)]
        self.init_lcd()

    def pulse_enable(self):
        self.e.off()
        time.sleep_us(1)
        self.e.on()
        time.sleep_us(1)
        self.e.off()
        time.sleep_us(100)

    def write4bits(self, value):
        for i in range(4):
            self.data_pins[i].value((value >> i) & 1)
        self.pulse_enable()

    def send(self, value, mode):
        self.rs.value(mode)
        self.write4bits(value >> 4)  # wysyłamy najpierw 4 starsze bity
        self.write4bits(value & 0x0F)  # potem 4 młodsze bity
        time.sleep_us(40)

    def command(self, cmd):
        self.send(cmd, 0)

    def write_char(self, char_val):
        self.send(char_val, 1)

    def init_lcd(self):
        time.sleep(0.05)  # czekaj po włączeniu
        self.rs.off()
        self.e.off()
        # Inicjalizacja zgodna z HD44780 w trybie 4-bit
        self.write4bits(0x03)
        time.sleep_ms(5)
        self.write4bits(0x03)
        time.sleep_us(150)
        self.write4bits(0x03)
        self.write4bits(0x02)  # ustaw tryb 4-bit
        self.command(0x28)  # funkcja: 2 linie, 5x8 font
        self.command(0x0C)  # wyświetlacz włączony, bez kursora
        self.command(0x06)  # przesuwanie kursora w prawo
        self.clear()

    def clear(self):
        self.command(0x01)  # wyczyść wyświetlacz
        time.sleep_ms(2)

    def set_cursor(self, col, row):
        row_offsets = [0x00, 0x40]
        self.command(0x80 | (col + row_offsets[row]))

    def write(self, col, row, text):
        self.set_cursor(col, row)
        for char in text:
            self.write_char(ord(char))
