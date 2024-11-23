import Noco from '~/Noco';
import { extractProps } from '~/helpers/extractProps';
import {
  CacheGetType,
  CacheScope,
  MetaTable,
  RootScopes,
} from '~/utils/globals';
import NocoCache from '~/cache/NocoCache';
import { NcError } from 'src/helpers/catchError';

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
    const condition = extractProps(params, ['id', 'view_id', 'custom_path']);

    const customUrl = await ncMeta.metaGet2(
      RootScopes.ROOT,
      RootScopes.ROOT,
      MetaTable.CUSTOM_URLS,
      condition,
    );

    return customUrl && new CustomUrl(customUrl);
  }

  public static async getOriginUrlByCustomPath(
    customPath: string,
    ncMeta = Noco.ncMeta,
  ) {
    let customUrl = await NocoCache.get(
      `${CacheScope.CUSTOM_URLS}:${customPath}`,
      CacheGetType.TYPE_OBJECT,
    );

    if (!customUrl) {
      customUrl = await ncMeta.metaGet2(
        RootScopes.ROOT,
        RootScopes.ROOT,
        MetaTable.CUSTOM_URLS,
        {
          custom_path: customPath,
        },
      );

      if (customUrl) {
        NocoCache.set(`${CacheScope.CUSTOM_URLS}:${customPath}`, customUrl);
      }
    }

    if (!customUrl) {
      NcError.notFound();
    }

    return customUrl?.original_path;
  }

  public static async insert(
    customUrl: Partial<CustomUrl>,
    ncMeta = Noco.ncMeta,
  ) {
    const insertData = extractProps(customUrl, [
      'fk_workspace_id',
      'base_id',
      'fk_model_id',
      'view_id',
      'original_path',
      'custom_path',
    ]);

    const insertedCustomUrl = await ncMeta.metaInsert2(
      RootScopes.ROOT,
      RootScopes.ROOT,
      MetaTable.CUSTOM_URLS,
      insertData,
    );

    return insertedCustomUrl && new CustomUrl(insertedCustomUrl);
  }

  public static async list(
    params: Pick<CustomUrl, 'fk_workspace_id' | 'base_id' | 'fk_model_id'>,
    ncMeta = Noco.ncMeta,
  ) {
    const condition = extractProps(params, [
      'fk_workspace_id',
      'base_id',
      'fk_model_id',
    ]);

    const customUrlList = await ncMeta.metaList2(
      RootScopes.ROOT,
      RootScopes.ROOT,
      MetaTable.CUSTOM_URLS,
      {
        condition,
      },
    );

    return customUrlList.map((customUrl) => new CustomUrl(customUrl));
  }

  public static async update(
    id: string,
    customUrl: Partial<CustomUrl>,
    ncMeta = Noco.ncMeta,
  ) {
    const updateData = extractProps(customUrl, [
      'original_path',
      'custom_path',
    ]);

    return await ncMeta.metaUpdate(
      RootScopes.ROOT,
      RootScopes.ROOT,
      MetaTable.CUSTOM_URLS,
      updateData,
      id,
    );
  }

  public static async checkAvailability(
    params: Pick<CustomUrl, 'id' | 'custom_path'>,
    ncMeta = Noco.ncMeta,
  ) {
    const condition = extractProps(params, ['custom_path']);

    const customUrlList = await ncMeta.metaList2(
      RootScopes.ROOT,
      RootScopes.ROOT,
      MetaTable.CUSTOM_URLS,
      {
        condition,
        xcCondition: params.id
          ? {
              _not: {
                id: {
                  neq: params.id,
                },
              },
            }
          : null,
      },
    );

    return !!customUrlList.length;
  }

  static async delete(
    customUrl: Pick<CustomUrl, 'id' | 'view_id'>,
    ncMeta = Noco.ncMeta,
  ) {
    const condition = extractProps(customUrl, ['id', 'view_id']);

    const res = await ncMeta.metaDelete(
      RootScopes.ROOT,
      RootScopes.ROOT,
      MetaTable.CUSTOM_URLS,
      condition,
    );

    return res;
  }
}
