import { get, parsePath, set } from '../yaml-path'
import fs from 'fs'
import { Document, parseDocument } from 'yaml'

describe('Yaml parsePath', () => {
  let content: string
  let doc: Document

  beforeAll(() => {
    content = fs.readFileSync('src/tests/mocks/catalog-info.yaml').toString()
    doc = parseDocument(content)
  })
  test('Parse simple path', () => {
    const segs = parsePath('$.single-field')
    expect(segs).toHaveLength(2)
    expect(segs[1].path).toEqual('single-field')
    expect(segs[1].elName).toEqual('single-field')
  })

  test('Parse indexed path', () => {
    const segs = parsePath('$.single-field[1]')
    expect(segs).toHaveLength(2)
    expect(segs[1].path).toEqual('single-field[1]')
    expect(segs[1].elName).toEqual('single-field')
    expect(segs[1].elIndex).toEqual(1)
  })

  test('Parse quoted node sintax', () => {
    const segs = parsePath('$."single-field"')
    expect(segs).toHaveLength(2)
    expect(segs[1].path).toEqual('single-field')
    expect(segs[1].elName).toEqual('single-field')
  })

  test('Parse sintax error', () => {
    expect(() => parsePath("$.'single-field")).toThrow()
  })

  test('Get simple node', () => {
    const path = '$.metadata.annotations.backstage\\.io/techdocs-ref'
    const result = get(path, doc)
    expect(result).toBeDefined()
  })

  test('Get simple node, not found', () => {
    const path = '$.metadata.annotations.not-found-element'
    const result = get(path, doc)
    expect(result).not.toBeDefined()
  })

  test('Set simple existing node', () => {
    const path = '$.metadata.annotations.backstage\\.io/techdocs-ref'
    const newValue = 'dfas fasdf asdf asfd asdf'
    set(path, newValue, doc)

    const newDoc = parseDocument(doc.toString())
    const newResult = get(path, newDoc)
    expect(newResult).toEqual(newValue)
  })

  test('Set simple NOT existing node ', () => {
    const path = '$.metadata.annotations.new-annotation.new-sub-annotation'
    const newValue = 'dfas fasdf asdf asfd asdf'
    set(path, newValue, doc)

    const newDoc = parseDocument(doc.toString())
    const newResult = get(path, newDoc)
    expect(newResult).toEqual(newValue)
  })
})
