Slither.io
==========

The stuff I was injecting is in `inject.js`, I started to pull common bits out
into their own file, but haven't put them back into the injection scrpit
(didn't feel like having to go mess with webpack again)

input control
-------------

```js
snake.wmd = true // turn on zoom (there's also a function, setAcceleration, which takes 0 or 1)
kd_l             // keydown left (ie it thinks you're pressing the left arrow)
kd_r             // keydown right (ie it thinks you're pressing the right arrow)
kd_u             // keydown up    (thinks you're pressing up, this also turns on zoom)
xm               // x position of the mouse relative to the middle of the board
ym               // y position of the mouse relative to the middle of the board
```


other snake info
----------------

```js
buf = new Uint8Array(nums.length)
"255,255,255,0,0,0,208,6,2,5,1,15,1,26,1,34,1,14,1,23,1,22,1,13,1,22,1,10,1,35,1,24,1,29,1,20,1,21,1,31,1,1,1,9,1,8,1,22,1,35,1,15,1,23,1,14,1,12,1,23,1,24,1,11,1,10,1,13,1,11,1,20,1,19,1,34,1,19,1,32,1,33,1,24,1,25,1,23,1,35,1,34,1,33"
  .split(",")
  .map(n => parseInt(n))
  .forEach((n, i) => buf[i] = n)
setSkin(snake, null, buf) // idk hwo this works exactly, but you can use this buffer thing to make really custom skins
setSkin(snake, 40)        // change your skin to prefab skin 40 (presumably only in your DOM)

snake.wmd   // setting to true will cause zoom
snake.ang   // the angle the snake is facing, 0 to 2π, 0 faces right, but π/2 faces DOWN (confusing b/c usually it faces up)
snake.nk    // nickname

snake.pts   // a bunch of point objects... maybe locations of the snake body bits?

snake.fxs   // 43 numbers, maybe y body bits?
snake.fys   // 43 numbers, maybe x body bits?
```


window stuff
------------

```js
ww     // window width
hh     // widow height
raf    // current browser's requestAnimationFrame
redraw // draws each frame
oef    // updates snake state? not really sure
mc     // main canvas
lbh    // leaderboard header
lbp    // leaderboard positions (ie rank)
lbn    // leaderboard names
lbs    // leaderboard scores
lbf    // your rank and position
loch   // minimap
```

IDK, other stuff I played with
------------------------------

```js
jws = new WebSocket(`ws://${sos[0].ip}:${sos[0].po}`)
jws.binaryType = "arraybuffer"
jws.addEventListener('open', function (event) { console.log("open", event) })
jws.addEventListener('mesage', function (event) { console.log("message", event) })

// to look at the websocket data
  josh.wsTheirs = ws.onmessage
  josh.wsMine = function(b) {
    josh.wsData = b
    ws.onmessage = josh.wsTheirs;
    return josh.wsTheirs(b)
  }
  ws.onmessage = josh.wsMine

// to control the mouse
  // moving the mouse sets xm and ym, which are the x and y of the mouse, relative to the middle of the screen
  // so you can control the snake by setting xm / ym (eg to make it go straight right: xm=100, ym=0)
  // small changes either don't get observed, or are seen as like "wiggle up a bit"

  // eg: wiggle
  josh.wiggle = function(times=10) {
    // init
    const duration = 150
    const distance = 50
    let count = 0
    function up() {
      if(count++ >= times) return
      ym -= distance
      setTimeout(down, duration)
    }
    function down() {
      if(count++ >= times) return
      ym += distance
      setTimeout(up, duration)
    }

    xm = 100
    ym = distance/2
    up()
  }
```
