const Collection = require('./Collection')

describe('Collection', function() {
  it('can append items to the dictionary', function() {
    const coll = new Collection()
    coll.append('a', 'first')
    coll.append('b', 'second')
    expect(Array.from(coll)).toEqual(['first', 'second'])
  })

  it('can prepend items to the dictionary', function() {
    const coll = new Collection()
    coll.prepend('a', 'first')
    coll.prepend('b', 'second')
    expect(Array.from(coll)).toEqual(['second', 'first'])
  })

  it('can delete items from the dictionary', function() {
    const coll = new Collection()
    coll.append('a', 'first')
    coll.append('b', 'second')
    coll.append('c', 'third')
    coll.append('d', 'fourth')
    expect(Array.from(coll)).toEqual(['first', 'second', 'third', 'fourth'])
    coll.delete('a')
    expect(Array.from(coll)).toEqual(['second', 'third', 'fourth'])
    coll.delete('c')
    expect(Array.from(coll)).toEqual(['second', 'fourth'])
    coll.delete('d')
    expect(Array.from(coll)).toEqual(['second'])
    coll.delete('b')
    expect(Array.from(coll)).toEqual([])
  })

  it('does not change the order when updating an existing item', function() {
    const coll = new Collection()
    coll.append('a', 'first')
    coll.append('b', 'second')
    expect(Array.from(coll)).toEqual(['first', 'second'])
    coll.update('a', 'third')
    expect(Array.from(coll)).toEqual(['third', 'second'])
    coll.update('b', 'fourth')
    expect(Array.from(coll)).toEqual(['third', 'fourth'])
  })

  it('errors when updating a non-existing item', function() {
    const coll = new Collection()
    expect(() => coll.update('a', 'second')).toThrow(new Error(`"a" not in collection`));
  })

  it('can access items by their name', function() {
    const coll = new Collection()
    coll.append('a', 'first')
    coll.append('b', 'second')
    expect(coll.get('a')).toEqual('first')
    expect(coll.get('a')).toEqual('first')
    expect(coll.get('b')).toEqual('second')
  })

  it('knows if it has an item', function() {
    const coll = new Collection()
    expect(coll.has('a')).toEqual(false)
    coll.append('a', 'first')
    expect(coll.has('a')).toEqual(true)
    coll.delete('a')
    expect(coll.has('a')).toEqual(false)
  })

  it('errors if attempting to get an item that is not in the collection', function() {
    const coll = new Collection()
    expect(() => coll.get('a')).toThrow(new Error(`"a" not in collection`));
  })

  it('appending an existing item will move it to the end of the order and update its value', function() {
    const coll = new Collection()
    coll.append('a', 'first')
    coll.append('b', 'second')
    coll.append('c', 'third')
    expect(Array.from(coll)).toEqual(['first', 'second', 'third'])
    coll.append('a', 'first-again')
    expect(Array.from(coll)).toEqual(['second', 'third', 'first-again'])
  })

  it('prepending an existing item will move it to the beginning of the order and update its value', function() {
    const coll = new Collection()
    coll.append('a', 'first')
    coll.append('b', 'second')
    coll.append('c', 'third')
    expect(Array.from(coll)).toEqual(['first', 'second', 'third'])
    coll.prepend('c', 'third-again')
    expect(Array.from(coll)).toEqual(['third-again', 'first', 'second'])
  })
})
