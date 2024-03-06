import appConfig from '../../app.config';

export type QueryParamsType = Record<string | number, any>;
export interface FullRequestParams {
  path: string;
  method?: string;
  query?: QueryParamsType;
  body?: BodyInit | null;
}

export async function request(options: FullRequestParams) {
  const formatedOptions: RequestInit = {
    method: options.method,
    headers: {
      Authorization: `Bearer ${appConfig.accessToken}`,
    },
    body: options.body,
  };

  const response = await fetch(
    `${appConfig.apiBaseUrl}${options.path}`,
    formatedOptions
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}
