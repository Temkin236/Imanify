import { User as UserType, UserCreateData } from '../types';

class User implements UserType {
  id: number;
  username: string;
  email: string;
  language: 'en' | 'ar' | 'am';
  ramadanMode: boolean;
  createdAt: Date;

  constructor(
    id: number,
    username: string,
    email: string,
    language: 'en' | 'ar' | 'am' = 'en',
    ramadanMode: boolean = false
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.language = language;
    this.ramadanMode = ramadanMode;
    this.createdAt = new Date();
  }

  static async findById(_id: number): Promise<UserType | null> {
    return null;
  }

  static async findByEmail(_email: string): Promise<UserType | null> {
    return null;
  }

  static async findByUsername(_username: string): Promise<UserType | null> {
    return null;
  }

  static async create(data: UserCreateData): Promise<UserType> {
    return new User(
      Date.now(),
      data.username,
      data.email,
      data.language || 'en',
      data.ramadanMode || false
    );
  }

  static async update(_id: number, _data: Partial<UserCreateData>): Promise<UserType | null> {
    return null;
  }

  static async delete(_id: number): Promise<boolean> {
    return true;
  }

  static async find(): Promise<UserType[]> {
    return [];
  }
}

export default User;
