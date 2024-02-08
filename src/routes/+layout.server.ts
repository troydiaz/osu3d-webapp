import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals: { getSession, getPermissions } }) => {
  return {
    session: getSession(),
    permissions: await getPermissions()
  }
}