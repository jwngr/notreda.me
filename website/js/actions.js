// Action types
export const TOGGLE_NAV_MENU = 'OPEN_NAV_MENU';
export const CHANGE_SELECTED_GAME_INDEX = 'CHANGE_SELECTED_GAME_INDEX';

// Action creators
export function toggleNavMenu() {
  return {
    type: TOGGLE_NAV_MENU
  };
}

export function changeSelectedGameIndex(index) {
  return {
    index,
    type: CHANGE_SELECTED_GAME_INDEX
  };
}
