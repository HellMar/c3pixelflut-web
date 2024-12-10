# Wie?

### Server IPs
~~Der Server an der Wand mit der IP **151.217.111.34** oder **2001:67c:20a1:1111:2051:5dff:feda:2983** lauscht auf dem TCP-Port **1234**~~
~~Der Server an der Wand oder der Chaos West Stage mit der IP **151.217.176.193** oder **2001:67c:20a1:1176:202:c9ff:fe5a:28f9** lauscht auf dem TCP-Port **1234**~~

Infos zu den IPs folgen sobald sie feststehen. 

::: warning
⚠️ Verbindungen aus dem WLAN werden blockiert️ ⚠️
:::

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
import sys
import socket
from PIL import Image

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect((sys.argv[1], int(sys.argv[2])))

def pixel(x,y,r,g,b,a=255):
  if a == 255:
    sock.send('PX %d %d %02x%02x%02x\n' % (x,y,r,g,b))
  else:
    sock.send('PX %d %d %02x%02x%02x%02x\n' % (x,y,r,g,b,a))

im = Image.open(sys.argv[3]).convert('RGBA')
_,_,w,h = im.getbbox()
for x in xrange(w):
  for y in xrange(h):
    r,g,b,a = im.getpixel((x,y))
    pixel(x,y,r,g,b,a)
```

#### Aufruf
``` bash
python3 client.py ip.ip.ip.ip 1234 picture.png
```
