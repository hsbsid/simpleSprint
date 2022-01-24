import {
  LOAD_ALL_BOARDS,
  BOARD_ERROR,
  LOAD_BOARD,
  BOARD_CREATED,
  BOARD_DELETED,
  CARD_CREATED,
  EDIT_CARD,
  CARD_DELETED,
  BOARD_LOADING,
} from '../actions/types';

const initialState = {
  boards: [],
  board: { loading: true },
  loading: true,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case BOARD_LOADING:
      return { ...state, loading: true };
    case LOAD_BOARD:
      return { ...state, board: { ...payload, loading: false } };
    case LOAD_ALL_BOARDS:
      return { ...state, boards: payload, loading: false };
    case BOARD_CREATED:
      return { ...state, boards: [...state.boards, payload] };
    case BOARD_DELETED:
      return {
        ...state,
        boards: [...state.boards.filter((b) => b._id !== payload)],
        board: { loading: false },
      };
    case CARD_CREATED:
      return {
        ...state,
        board: { ...state.board, cards: [...state.board.cards, payload] },
      };
    case EDIT_CARD:
      return {
        ...state,
        board: {
          ...state.board,
          cards: state.board.cards.map((card) =>
            card._id === payload._id ? { ...card, ...payload } : { ...card }
          ),
        },
      };
    case CARD_DELETED:
      return {
        ...state,
        board: {
          ...state.board,
          cards: state.board.cards.filter((card) => card._id !== payload._id),
        },
      };
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
