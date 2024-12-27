# Wie?

### Server IPs
Den Server an der Wand erreicht ihr unter **wall.c3pixelflut.de** oder der IP **151.217.2.161** und lauscht auf dem TCP-Port **1337**

Der Server für Einsteiger ist erreichbar via **newcomer.c3pixelflut.de** oder der IP **151.217.2.166** und lauscht auf dem TCP-Port **1337**

<font size="5" style="color:red;">⚠️ Verbindungen aus dem WLAN werden blockiert️⚠️</font>

### Statistiken

Die Statistiken zu unserem Server findest du unter **[stats.c3pixelflut.de](https://stats.c3pixelflut.de)**

### Befehle

```
PX <x> <y> <rrggbb|aarrggbb> # Setze den Pixel an der Stelle x und y mit angegebener Hexadezimal Farbe
PX <x> <y>                   # Antwort des Servers entspricht dem Hexadezimal Farbe des Pixels
SIZE                         # Antwort des Servers entspricht der Spielfeldgröße auf dem Server
OFFSET <x> <y>               # Setze den offset für die zuküntigen Pixel der Connection
```

### Beispiel Python3

#### Script in Python3
``` python3
#!/usr/bin/python3

import sys
import socket
from PIL import Image

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect((sys.argv[1], int(sys.argv[2])))

def pixel(x, y, r, g, b, a=255):
    if a == 255:
        sock.send(b'PX %d %d %02x%02x%02x\n' % (x, y, r, g, b))
    else:
        sock.send(b'PX %d %d %02x%02x%02x%02x\n' % (x, y, r, g, b, a))

im = Image.open(sys.argv[3]).convert('RGBA')
_, _, w, h = im.getbbox()
for x in range(w):
    for y in range(h):
        r, g, b, a = im.getpixel((x, y))
        pixel(x, y, r, g, b, a)
```

#### Aufruf
``` bash
python3 client.py wall.c3pixelflut.de 1337 picture.png
```
