export interface Spot {
  id: number
  name: string
  address: string
  neighborhood: string
  lng: number
  lat: number
  types: string[]   // e.g. ['bar'], ['shop'], ['bar', 'shop']
}