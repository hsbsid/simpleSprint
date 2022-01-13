import { LOAD_ALL_BOARDS, BOARD_ERROR, LOAD_BOARD } from '../actions/types';

const initialState = { boards: [], board: { loading: true }, loading: true };

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOAD_BOARD:
      return { ...state, board: { ...payload, loading: false } };
    case LOAD_ALL_BOARDS:
      return { ...state, boards: payload, loading: false };
    case BOARD_ERROR:
      return {
        ...state,
        boards: [],
        board: { loading: false },
        loading: false,
      };
    default:
      return state;
  }
}
