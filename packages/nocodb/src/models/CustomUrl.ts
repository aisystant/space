import Noco from '~/Noco';

export default class CustomUrl {
  id?: string;
  fk_workspace_id?: string;
  base_id?: string;
  fk_model_id?: string;
  view_id?: string;
  original_path?: string;
  custom_path?: string;

  constructor(customUrl: Partial<CustomUrl>) {
    Object.assign(this, customUrl);
  }

  public static async get(
    _params: Pick<CustomUrl, 'id' | 'view_id' | 'custom_path'>,
    _ncMeta = Noco.ncMeta,
  ) {
    return {} as CustomUrl;
  }

  public static async getOriginUrlByCustomPath(
    _customPath: string,
    _ncMeta = Noco.ncMeta,
  ) {
    return '';
  }

  public static async insert(
    _customUrl: Partial<CustomUrl>,
    _ncMeta = Noco.ncMeta,
  ) {
    return {} as CustomUrl;
  }

  public static async list(
    _params: Pick<CustomUrl, 'fk_workspace_id' | 'base_id' | 'fk_model_id'>,
    _ncMeta = Noco.ncMeta,
  ) {
    return [] as CustomUrl[];
  }

  public static async update(
    _id: string,
    _customUrl: Partial<CustomUrl>,
    _ncMeta = Noco.ncMeta,
  ) {
    return {} as CustomUrl;
  }

  public static async checkAvailability(
    _params: Pick<CustomUrl, 'id' | 'custom_path'>,
    _ncMeta = Noco.ncMeta,
  ) {
    return false;
  }

  static async delete(
    _customUrl: Pick<CustomUrl, 'id' | 'view_id'>,
    _ncMeta = Noco.ncMeta,
  ): Promise<any> {
    return;
  }
}
