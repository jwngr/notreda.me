// Action types
export const TOGGLE_NAV_MENU = 'OPEN_NAV_MENU';
export const CHANGE_ROUTER_LOCATION = '@@router/LOCATION_CHANGE';

// Action creators
export function toggleNavMenu() {
  return {
    type: TOGGLE_NAV_MENU
  };
}
