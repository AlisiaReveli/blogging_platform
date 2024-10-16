export interface IDatabaseConfig {
  development: IDatabaseConfigAttributes
  test: IDatabaseConfigAttributes
  production: IDatabaseConfigAttributes
}

export interface IDatabaseConfigAttributes {
  uri: string
}
