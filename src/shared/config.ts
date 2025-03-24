import fs from 'fs'
import path from 'path'
import { IsNumber, IsString, validateSync } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { config } from 'dotenv'

config({
  path: '.env',
})

if (!fs.existsSync(path.resolve('.env'))) {
  console.error('No .env file found')
  process.exit(1)
}

class ConfigSchema {
  @IsNumber()
  PORT: number
  @IsString()
  DATABASE_URL: string
  @IsString()
  ACCESS_TOKEN_SECRET: string
  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string
  @IsString()
  REFRESH_TOKEN_SECRET: string
  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string
  @IsString()
  SECRET_API_KEY: string
}

// enableImplicitConversion: true is required to convert string values to their respective types
const configServer = plainToInstance(ConfigSchema, process.env, { enableImplicitConversion: true })

const errorArray = validateSync(configServer)

if (errorArray.length > 0) {
  console.error('The declared values in the .env file are not valid')

  const errors = errorArray.map((error) => {
    return {
      property: error.property,
      constraints: error.constraints,
      value: error.value,
    }
  })

  throw new Error(`Validation failed: ${JSON.stringify(errors)}`)
}

const envConfig = configServer

export default envConfig
