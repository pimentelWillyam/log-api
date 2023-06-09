import { type Request, type Response } from 'express'

import type IUserController from '../interface/IUserController'
import type IUserRepository from '../interface/IUserRepository'
import type IUserValidator from '../interface/IUserValidator'

enum UserError {
  USER_INVALID_REQUEST = 'A requisição inserida foi considerada inválida',
  USER_LIST_ERROR = 'Houve um erro quando tentamos buscar a lista',
  USER_NOT_FOUND = 'Não foi possível encontrar este usuário',
  USER_NOT_UPDATED = 'Não foi possível atualizar este usuário',
  USER_NOT_DELETED = 'Não foi possível deletar este usuário',
}
class UserController implements IUserController {
  constructor (readonly userRepository: IUserRepository, readonly userValidator: IUserValidator) {
    this.userRepository = userRepository
    this.userValidator = userValidator
  }

  async create (req: Request, res: Response): Promise<void> {
    try {
      if (this.userValidator.isUserValid(req.body.login, req.body.password, req.body.permission)) {
        const user = await this.userRepository.create(req.body.login, req.body.password, req.body.permission)
        res.status(200).json(user)
      } else {
        res.status(400).send(UserError.USER_INVALID_REQUEST)
      }
    } catch (erro) {
      console.error(erro)
      res.status(400).send(UserError.USER_INVALID_REQUEST)
    }
  }

  async getAll (res: Response): Promise<void> {
    try {
      const listaUsers = await this.userRepository.getAll()
      res.status(200).json(listaUsers)
    } catch (erro) {
      console.error(erro)
      res.status(400).send(UserError.USER_INVALID_REQUEST)
    }
  }

  async get (req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userRepository.get(parseInt(req.params.id))
      if (user != null) {
        res.status(200).json(user)
      } else {
        res.status(404).send(UserError.USER_NOT_FOUND)
      }
    } catch (erro) {
      res.status(400).send(UserError.USER_INVALID_REQUEST)
    }
  }

  async update (req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userRepository.update(parseInt(req.params.id), req.body)
      if (user !== undefined) {
        res.status(200).json(user)
      } else {
        res.status(404).send(UserError.USER_NOT_UPDATED)
      }
    } catch (erro) {
      console.log(erro)
      res.status(400).send(UserError.USER_INVALID_REQUEST)
    }
  }

  async delete (req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userRepository.delete(parseInt(req.params.id))
      if (user != null) {
        res.status(200).json(user)
      } else {
        res.status(404).send(UserError.USER_NOT_DELETED)
      }
    } catch (erro) {
      console.error(erro)
      res.status(400).send(UserError.USER_INVALID_REQUEST)
    }
  }
}

export default UserController
