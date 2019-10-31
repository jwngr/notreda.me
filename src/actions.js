// Router location changed action from react-router-dom.
export const ROUTER_LOCATION_CHANGED = '@@router/LOCATION_CHANGE';

export const TOGGLE_NAV_MENU = 'OPEN_NAV_MENU';

export function toggleNavMenu() {
  return {
    type: TOGGLE_NAV_MENU,
  };
}
