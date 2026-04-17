import { Azkar as AzkarType, AzkarCreateData } from '../types.js';

class Azkar implements AzkarType {
  id: number;
  text: string;
  category: 'morning' | 'evening' | 'after_prayer';
  count: number;
  arabic: string;

  constructor(
    id: number,
    text: string,
    category: 'morning' | 'evening' | 'after_prayer',
    count: number,
    arabic: string
  ) {
    this.id = id;
    this.text = text;
    this.category = category;
    this.count = count;
    this.arabic = arabic;
  }

  static async find(): Promise<AzkarType[]> {
    return [];
  }

  static async findByCategory(_category: string): Promise<AzkarType[]> {
    return [];
  }

  static async create(data: AzkarCreateData): Promise<AzkarType> {
    return new Azkar(
      Date.now(),
      data.text,
      data.category,
      data.count,
      data.arabic || ''
    );
  }

  static async findById(_id: number): Promise<AzkarType | null> {
    return null;
  }

  static async update(_id: number, _data: Partial<AzkarCreateData>): Promise<AzkarType | null> {
    return null;
  }

  static async delete(_id: number): Promise<boolean> {
    return true;
  }
}

export default Azkar;
