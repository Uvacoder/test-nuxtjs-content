export interface ContentObject {
  data: string
  meta: Record<string, string>
}

export interface ContentProvider {
  name: string
  get: (key: string) => Promise<ContentObject>
  getKeys: (base: string) => Promise<string[]>
}

export interface QueryOptions {
  only?: string[]
  without?: string[]
  where?: Record<string, string>
  sort?: Record<string, 'asc' | 'desc'>
  limit?: number
  skip?: number
}

export interface ContentIterator extends AsyncIterator<ContentObject> {
  next: () => Promise<IteratorResult<ContentObject>>,
  done: boolean
  value: ContentObject
  length: number
}

export interface Content {
  findOne: (key: string, options: QueryOptions) => Promise<ContentObject>
  find: (base: string, options: QueryOptions) => ContentIterator
}
