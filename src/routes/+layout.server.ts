import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { getSession, getPermissions, getUserProfile } }) => {
  return {
    session: getSession(),
    permissions: await getPermissions(),
    profile: await getUserProfile()
  };
};
