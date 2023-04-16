import type { Repository, EntityTarget, ObjectLiteral, DataSource } from 'typeorm'

import type IUserRepository from '../interface/IUserRepository'

import UserEntity from '../entity/UserEntity'
import type IUser from '../interface/IUser'

class UserRepository implements IUserRepository {
  readonly resource: Repository<ObjectLiteral>

  constructor (dataSource: DataSource, userEntity: EntityTarget<ObjectLiteral>) {
    this.resource = dataSource.getRepository(UserEntity)
  }

  async create (login: string, password: string, permission: string): Promise<ObjectLiteral> {
    const user: IUser = { login, password, permission }
    await this.resource.save(user)
    return user
  }

  async getAll (): Promise<ObjectLiteral[] | null> {
    const listaTodosUsers = await this.resource.find()
    return listaTodosUsers
  }

  async get (id: number): Promise<ObjectLiteral | null> {
    const user = await this.resource.findBy({ id })
    return user[0]
  }

  async update (id: number, body: ObjectLiteral): Promise<ObjectLiteral> {
    const user = await this.resource.findBy({ id })
    if (user[0] === undefined) {
      return user[0]
    }
    if (body.password !== undefined) {
      user[0].password = body.password
    }
    if (body.permission !== undefined) {
      user[0].permission = body.permission
    }
    await this.resource.save(user[0])
    return user[0]
  }

  async delete (id: number): Promise<ObjectLiteral | null> {
    const user = await this.resource.findBy({ id })
    if (user[0] === undefined) {
      return user[0]
    } else {
      await this.resource.remove(user[0])
      return user[0]
    }
  }
}

export default UserRepository