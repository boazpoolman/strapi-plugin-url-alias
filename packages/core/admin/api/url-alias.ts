import { getFetchClient } from '@strapi/strapi/admin';

import { UrlAliasEntity } from '../types/url-aliases';

export const useCreateUrlAlias = () => {
  const { post } = getFetchClient();

  const createUrlAlias = (body: { id: number }, slug: string) => {
    return post<UrlAliasEntity>('/webtools/url-alias/create', {
      data: {
        ...body,
        contenttype: slug,
      },
    });
  };

  return { createUrlAlias };
};

export const useUpdateUrlAlias = () => {
  const { put } = getFetchClient();
  const updateUrlAliases = (body: { id: number }, slug: string) => {
    return put<UrlAliasEntity>(`/webtools/url-alias/update/${body.id}`, {
      data: {
        ...body,
        contenttype: slug,
      },
    });
  };

  return { updateUrlAliases };
};


export const useDeleteUrlAlias = () => {
  const { post } = getFetchClient();

  const deleteUrlAlias = (body: { id: number }) => {
    return post(`/webtools/url-alias/delete/${body.id}`);
  };

  return { deleteUrlAlias };
};
