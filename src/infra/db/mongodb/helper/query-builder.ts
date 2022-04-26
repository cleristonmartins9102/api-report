export class QueryBuilder {
  private readonly query: any = []
  constructor () {
    return this
  }

  match (data: any): QueryBuilder {
    this.query.push({
      $match: data
    })
    return this
  }

  unwind (data: any): QueryBuilder {
    this.query.push({
      $unwind: data
    })
    return this
  }

  group (data: any): QueryBuilder {
    this.query.push({
      $group: data
    })
    return this
  }

  addFields (data: any): QueryBuilder {
    this.query.push({
      $addFields: data
    })
    return this
  }

  project (data: any): QueryBuilder {
    this.query.push({
      $project: data
    })
    return this
  }

  lookup (data: any): QueryBuilder {
    this.query.push({
      $lookup: data
    })
    return this
  }

  sort (data: any): QueryBuilder {
    this.query.push({
      $sort: data
    })
    return this
  }

  map (data: any): QueryBuilder {
    this.query.push({
      $map: data
    })
    return this
  }

  mergeObjects (data: any): QueryBuilder {
    this.query.push({
      $mergeObjects: data
    })
    return this
  }

  cond (data: any): QueryBuilder {
    this.query.push({
      $cond: data
    })
    return this
  }

  if (data: any): QueryBuilder {
    this.query.push({
      if: data
    })
    return this
  }

  then (data: any): QueryBuilder {
    this.query.push({
      then: data
    })
    return this
  }

  else (data: any): QueryBuilder {
    this.query.push({
      else: data
    })
    return this
  }

  equal (data: any): QueryBuilder {
    this.query.push({
      $eq: data
    })
    return this
  }

  sum (data: any): QueryBuilder {
    this.query.push({
      $sum: data
    })
    return this
  }

  multiply (data: any): QueryBuilder {
    this.query.push({
      $multiply: data
    })
    return this
  }

  divide (data: any): QueryBuilder {
    this.query.push({
      $divide: data
    })
    return this
  }

  build (): any[] {
    return this.query
  }
}
