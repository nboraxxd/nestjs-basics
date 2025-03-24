import { JsonWebTokenError } from '@nestjs/jwt'
import { Prisma } from '@prisma/client'

export function isJsonWebTokenError(error: any): error is JsonWebTokenError {
  return error instanceof JsonWebTokenError
}

export function isUniqueConstraintPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
}

export function isNotFoundPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'
}
