import max7219
import network
from machine import Pin, SPI
from time import sleep

# before flashing, set the SSID and the PASS for your network
SSID = ''
PASS = ''

sck = Pin(18, Pin.OUT)
mosi = Pin(23, Pin.OUT)
miso = Pin(19, Pin.IN)
cs = Pin(2, Pin.OUT)

spi = SPI(baudrate=40000000, polarity=0, phase=0, sck=sck, mosi=mosi, miso=miso)

# defined display as global to be able to access the object in main.py
global display
display = max7219.Matrix8x8(spi, cs, 4)
display.brightness(15)

# drawing a wifi symbol on the matrix
display.line(12, 1, 22, 1, 1)
display.line(14, 3, 20, 3, 1)
display.line(15, 5, 18, 5, 1)
display.line(16, 7, 17, 7, 1)
display.show()

sta_if = network.WLAN(network.STA_IF)

if not sta_if.isconnected():
    print('connecting to', SSID, '...')
    sta_if.active(True)
    sta_if.connect(SSID, PASS)
    while not sta_if.isconnected():
        pass

print('connected!')
print(sta_if.ifconfig())

# drawing a ok symbol on the matrix
display.fill(0)
display.line(12, 4, 15, 7, 1)
display.line(16, 6, 21, 1, 1)
display.line(12, 3, 15, 6, 1)
display.line(16, 5, 20, 1, 1)
display.show()
sleep(1)
