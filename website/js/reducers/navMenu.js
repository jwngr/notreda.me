import { OPEN_NAV_MENU, CLOSE_NAV_MENU } from '../actions/actions';

export default function navMenu(state = { open: false }, action) {
  switch (action.type) {
  case OPEN_NAV_MENU:
    return { open: true };
  case CLOSE_NAV_MENU:
    return { open: false };
  default:
    return state;
  }
}
