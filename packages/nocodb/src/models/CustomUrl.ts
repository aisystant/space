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
    params: Pick<CustomUrl, 'id' | 'view_id' | 'custom_path'>,
    ncMeta = Noco.ncMeta,
  ) {
    return {} as CustomUrl;
  }

  public static async getOriginUrlByCustomPath(
    customPath: string,
    ncMeta = Noco.ncMeta,
  ) {
    return '';
  }

  public static async insert(
    customUrl: Partial<CustomUrl>,
    ncMeta = Noco.ncMeta,
  ) {
    return {} as CustomUrl;
  }

  public static async list(
    params: Pick<CustomUrl, 'fk_workspace_id' | 'base_id' | 'fk_model_id'>,
    ncMeta = Noco.ncMeta,
  ) {
    return [] as CustomUrl[];
  }

  public static async update(
    id: string,
    customUrl: Partial<CustomUrl>,
    ncMeta = Noco.ncMeta,
  ) {}

  public static async checkAvailability(
    params: Pick<CustomUrl, 'id' | 'custom_path'>,
    ncMeta = Noco.ncMeta,
  ) {}

  static async delete(
    customUrl: Pick<CustomUrl, 'id' | 'view_id'>,
    ncMeta = Noco.ncMeta,
  ) {}
}
