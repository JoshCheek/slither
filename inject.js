// remove obnoxious shit -.-
;['iframe[src="/social-box/"]', '#fbh', '#twth'].forEach(sel => {
  const el = document.querySelector(sel)
  el && el.remove()
})

window.josh = {}

// generally useful stuff, I guess
  josh.util = {
    // format position
    fPos: (x, y) => `(${Math.round(x)}, ${Math.round(y)})`
  }

// my updater
  josh.updater = (() => {
    const updater = {
      id:      null, // for setInterval identification
      updates: [],   // list of names which should also be properties mapping to functions on this array
      start:   freq => updater.id = setInterval(updater.perform, freq),
      stop:    ()   => clearInterval(updater.id),
      perform: ()   => updater.updates.forEach(name => updater.updates[name]()),
      prepend(name, fn) {
        updater.delete(name)
        updater.updates[name] = fn
        updater.updates.unshift(name)
      },
      append(name, fn) {
        updater.delete(name)
        updater.updates[name] = fn
        updater.updates.push(name)
      },
      delete(name) {
        const updates = updater.updates
        for(let i = updates.length-1; 0 <= i; --i)
          if (updates[i] === name)
            updates.splice(i, 1)
        delete updates[name]
      },
    }
    return updater
  })()

// for the HUD
  josh.hud = (({updater}) => {
    const $container              = document.createElement("div")
    $container.style.display      = 'none' // initially off
    $container.style.position     = "fixed"
    $container.style.left         = "10px"
    $container.style.top          = "10px"
    // $container.style.width        = "220px"
    // $container.style.height       = "210px"
    $container.style.background   = "rgba(0, 0, 0, .8)"
    $container.style.color        = "#80FF80"
    $container.style.fontFamily   = "Verdana"
    $container.style.zIndex       = 999999
    $container.style.fontSize     = "11px"
    $container.style.padding      = "10px"
    $container.style.borderRadius = "10px"

    // where the game writes its stats
    pfd = document.createElement("div")
    // $container.appendChild(pfd)

    // where we'll write our stats (we can't share b/c they replace the innerHTML)
    $ours = document.createElement("div")
    $container.appendChild($ours)

    document.body.appendChild($container)
    const hud = {
      container: $container,
      pfd:       pfd,
      dom:       $ours,
      info:      {}, // the key/values of this thing will be displayed in our HUD
      updater:   () => {
        let lines = []
        for(let name in hud.info)
          lines.push(`${name}: ${hud.info[name]}`)
        hud.dom.innerHTML = lines.join('<br />')
      },
      on: () => {
        hud.container.style.display = 'block'
        // testing = true // tells the game to start writing its stats
        updater.append('hud', hud.updater)
      },
      off: () => {
        hud.container.style.display = 'none'
        // testing = false // the game stops writing its data
        updater.delete('hud')
      },
    }

    return hud
  })({updater: josh.updater})

// add xy loc to the minimap
josh.minimap_xy = (({container, fPos}) => {
  const $dom = document.createElement('div')
  $dom.style.color     = 'white'
  $dom.style.position  = 'absolute'
  $dom.style.bottom    = '-10px'
  $dom.innerText = 'n/a'
  container.appendChild($dom)
  const minimap_xy = {
    dom: $dom,
    update(x, y) {
      minimap_xy.dom.innerText = fPos(x, y)
    },
  }
  return minimap_xy
})({container: loch, fPos: josh.util.fPos})

josh.hold = {
  id: null,
  deltaRadians: 0.01,
  on() {
    josh.hold.id = requestAnimationFrame(josh.hold.perform)
  },
  perform() {
    if(!snake) return
    requestAnimationFrame(josh.hold.perform)
    const radians = snake.ang + josh.hold.deltaRadians
    const radius  = 200
    xm = radius * Math.cos(radians)
    ym = radius * Math.sin(radians)
  },
}
window.hold = josh.hold.on


josh.deathBanner = {
  displayed: true,
  snakes: [],
  x: 0,
  y: 0,
}

// some stuff for the HUD
  josh.updater.prepend('hudValues', () => {
    josh.hud.info['ws'] = ws ? ws.url : 'n/a'
    if(snake)
      josh.minimap_xy.update(snake.xx, snake.yy)
    josh.hud.info['mouse pos'] = josh.util.fPos(xm, ym)

    // my snake length:
    let len = 'n/a'
    if(snake) len = Math.floor(15 * (fpsls[snake.sct] + snake.fam / fmlts[snake.sct] - 1) - 5) / 1
    josh.hud.info['length'] = len

    if(snakes && snakes.length) josh.deathBanner.snakes = snakes

    if(snake) {
      josh.deathBanner.displayed = false
      const info = josh.hud.info
      info.want_e = want_e
      info.ang    = snake.ang
      info.wang   = snake.wang
      info['preys.length'] = preys.length
      josh.deathBanner.x = snake.xx
      josh.deathBanner.y = snake.yy
    } else if(!josh.deathBanner.displayed) {
      josh.deathBanner.displayed = true
      const container = document.getElementById('lastscore')
      const deathBanner = document.createElement('div')
      deathBanner.innerHTML = `
        <span style="color: #aaa">(</span>
        <span style="color: #fff">${josh.deathBanner.x}<span>
        <span style="color: #aaa">,</span>
        <span style="color: #fff">${josh.deathBanner.y}<span>
        <span style="color: #aaa">)</span>
        <br />
        ${josh.deathBanner.snakes.map(s => s.nk).join("<br />")}
      `
      container.appendChild(deathBanner)
    }

    // mostly just distracting
    // if(snake && snakes) {
    //   const nicks = snakes.map(s => s.nk)
    //   nicks.splice(nicks.indexOf(snake.nk), 1)
    //   josh.hud.info['snakes'] = nicks.join('<br />')
    // }
  })


// turn it all on
  josh.updater.start(100) // update 10 times per second
  josh.hud.on()           // flip on the HUD
