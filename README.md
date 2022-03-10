# node-yaml-path

Simple yaml-path to `yaml` library.

## Using `get`

```ts
import { Document, parseDocument } from 'yaml'
import { get, set } from 'node-yaml-path'

const yaml = `
metadata: 
  annotations: 
    simple-annotation: "string value"
`
doc = parseDocument(content)
const path = '$.metadata.annotations.simple-annotation'
const result = get(path, doc)
console.log(result)
// > 'string value'

```

## Using `set`

```ts
import { Document, parseDocument } from 'yaml'
import { get, set } from 'node-yaml-path'

const yaml = `
metadata: 
  annotations: 
    simple-annotation: "string value"
`

const newValue = 'new string value'
set(path, newValue, doc)
const newDoc = parseDocument(doc.toString())
const newResult = get(path, newDoc)
console.log(newResult)
// > 'new string value'

console.log(newDoc.toString())
// > '
//   metadata: 
//     annotations: 
//       simple-annotation: "new string value"
'

```
