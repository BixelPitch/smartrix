import math
import max7219
import socket

display.fill(0)
display.show()

addr = socket.getaddrinfo('0.0.0.0', 8080)[0][-1]

s = socket.socket()
s.bind(addr)
s.listen(1)

print('listening on', addr)

while True:
    cl, addr = s.accept()
    data = ''
    while True:
        buff = cl.recv(33)
        if buff:
            display.brightness(buff[0])
            bs = bytearray(buff)
            display.buffer = bs[1:]
            display.show()
        else:
            break

    cl.close()
