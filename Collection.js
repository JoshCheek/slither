
const symOrder = Symbol("order")
const symNamed = Symbol("named")

class Collection {
  constructor() {
    this[symOrder] = []
    this[symNamed] = new Map()
  }

  has(name) {
    return this[symNamed].has(name)
  }

  append(name, value) {
    if(this.has(name))
      this.delete(name)
    this[symOrder].push(name)
    this[symNamed].set(name, value)
  }

  prepend(name, value) {
    if(this.has(name))
      this.delete(name)
    this[symOrder].unshift(name)
    this[symNamed].set(name, value)
  }

  delete(name) {
    this[symNamed].delete(name)
    const ordered = this[symOrder]
    const index   = ordered.indexOf(name)
    if(index !== -1)
      ordered.splice(index, 1)
  }

  update(name, value) {
    if(!this.has(name))
      throw new Error(`"${name}" not in collection`)
    this[symNamed].set(name, value)
  }

  get(name) {
    if(this.has(name))
      return this[symNamed].get(name)
    throw new Error(`"${name}" not in collection`)
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
  [Symbol.iterator]() {
    let   i = 0
    const order = this[symOrder]
    const named = this[symNamed]
    return {
      next: () => (i < order.length)
                  ? { done: false, value: named.get(order[i++]) }
                  : { done: true }
    }
  }
}

module.exports = Collection
