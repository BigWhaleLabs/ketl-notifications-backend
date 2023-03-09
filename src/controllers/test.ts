import { Body, Controller, Ctx, Delete, Get, Post, Query } from 'amala'
import { Context } from 'koa'
import { TokenModel } from '@/models/Token'
import { badRequest } from '@hapi/boom'
import { verifyMessage } from 'ethers'
import Signature from '@/validators/Signature'
import Token from '@/validators/Token'

@Controller('/test')
export default class TestController {
  @Get('/')
  async addToken() {
    await console.log('sdjhfsdjkfhsdjkfhkdjsfhkj')
  }
}
