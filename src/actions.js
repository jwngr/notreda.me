// Router location changed action from redux-little-router.
export const ROUTER_LOCATION_CHANGED = 'ROUTER_LOCATION_CHANGED';

export const TOGGLE_NAV_MENU = 'OPEN_NAV_MENU';

export function toggleNavMenu() {
  return {
    type: TOGGLE_NAV_MENU,
  };
}
