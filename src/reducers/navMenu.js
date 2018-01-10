// Actions
import {TOGGLE_NAV_MENU} from '../actions';

export default function navMenu(state = {open: false}, action) {
  switch (action.type) {
    case TOGGLE_NAV_MENU:
      return {open: !state.open};
    default:
      return state;
  }
}
