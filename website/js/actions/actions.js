export const OPEN_NAV_MENU = 'OPEN_NAV_MENU';
export const CLOSE_NAV_MENU = 'CLOSE_NAV_MENU';

export function openNavMenu() {
  return {
    type: OPEN_NAV_MENU
  };
}

export function closeNavMenu() {
  return {
    type: CLOSE_NAV_MENU
  };
}
