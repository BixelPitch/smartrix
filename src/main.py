import math
import max7219
import socket

display.fill(0)
display.show()

def onData(msg):
    for i in range(len(msg)):
        display.pixel(i % 32, math.floor(i / 32), int(msg[i]))

    display.show()

addr = socket.getaddrinfo('0.0.0.0', 8080)[0][-1]

s = socket.socket()
s.bind(addr)
s.listen(1)

print('listening on', addr)

def parseData(data):
    parts = data.split(';')
    result = []

    if len(parts) == 1:
        return data

    for part in parts:
        partSplit = part.split('#')

        if len(partSplit) == 1 or len(partSplit[0]) != 4:
            result.append(part)
        else:
            if partSplit[0].lower() == 'data':
                onData(partSplit[1])
            elif partSplit[0].lower() == 'brig':
                display.brightness(int(partSplit[1]))
            else:
                print('Command not recognized: ' + partSplit[0])

    return ';'.join(result)

while True:
    cl, addr = s.accept()
    print('client connected from', addr)
    data = ''
    while True:
        buff = cl.recv(64)
        if buff:
            data = parseData(data + buff.decode('ascii'))
        else:
            break

    cl.close()