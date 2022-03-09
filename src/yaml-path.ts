import { Document, YAMLMap } from 'yaml'

export interface YamlPath {
  index?: number
  path: string
  /**
   * Only element name without index or expression filters like '$.`element-name`[1]'
   */
  elName: string
  /**
   * Element index when is an path for collection with index like `$.field[2]`
   */
  elIndex?: number
  token: {
    start: number
    end: number
  }
}

function getEndToken(src: string, start: number, endToken: string) {
  const close = src.indexOf(endToken, start + 1)
  if (close === -1) {
    throw `Sintax error: expected close token '${endToken}' at position ${start}.`
  }
  return close
}

export function parsePath(path: string) {
  let token = ''
  let startToken = 0
  const result: YamlPath[] = []
  let closeToken: number

  for (let i = 0; i < path.length; i++) {
    const c = path[i]
    switch (c) {
      case '\\':
        token += path[i + 1]
        i++
        continue
      case '.':
        result.push(mashalToken(token, startToken, i))
        token = ''
        startToken = i + 1
        continue
      case "'":
      case '"':
        closeToken = getEndToken(path, i, c)
        token += path.substring(i + 1, closeToken)
        i = closeToken + 1
        continue
      case '[':
        closeToken = getEndToken(path, i, ']')
        token += path.substring(i, closeToken + 1)
        i = closeToken + 1
        continue
    }
    token += c
  }

  return [...result, mashalToken(token, startToken, path.length)]
}

function mashalToken(token: string, start: number, end: number): YamlPath {
  const matches = /([^\[]+)(\[(\d+)\])?/.exec(token)
  const elName = matches[1]
  const elIndex = parseInt(matches[3])

  return {
    token: { start, end },
    elName,
    elIndex,
    path: token
  }
}

/**
 * Parse raw yaml path and get exacly node element raw value
 * @param path yaml path like `$.node-one.sub-node-one`
 * @param document parsed document {@see yaml.parseDocument}
 * @returns raw value of yaml document
 */
export function get(path: string, document: Document) {
  const levels = parsePath(path)
  let currentNode = document.get(levels[1].elName)
  for (let i = 2; i < levels.length; i++) {
    const { elName } = levels[i]
    if (!currentNode['get'](elName)) return undefined
    currentNode = currentNode['get'](elName)
  }
  return currentNode
}

/**
 * Set raw value to yaml path, if not exists, all path will be created
 * @param path yaml path like `$.node-one.sub-node-one`
 * @param value new raw value do node element
 * @param document parsed document {@see yaml.parseDocument}
 * @returns {void}
 */
export function set(path: string, value: any, document: Document): void {
  const levels = parsePath(path)
  let currentNode = document.get(levels[1].elName)
  for (let i = 2; i < levels.length - 1; i++) {
    const { elName } = levels[i]
    if (!currentNode['has'](elName)) {
      const newNode = document.createPair(elName, new YAMLMap())
      currentNode['add'](newNode)
    }
    currentNode = currentNode['get'](elName)
  }
  if (currentNode) {
    currentNode['set'](levels[levels.length - 1].elName, value)
  }
}
