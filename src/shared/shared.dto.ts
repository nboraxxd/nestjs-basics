export class SuccessResDTO<T> {
  data: T
  statusCode: number
  message: string

  constructor(partial: Partial<SuccessResDTO<T>>) {
    Object.assign(this, partial)
  }
}
