export class UserService {
  metadata = {
    actions: ['updateUserPosition'],
    emitEvents: ['userPositionUpdate'],
  };

  constructor() {
    this.user = {
      pos: null, // based on position from leaflet
    };
  }

  init(gameModel) {
    this.gameModel = gameModel;
  }

  dispose() {}

  dispatch(action, onDefaultAction) {
    if (action.type === 'updateUserPosition') {
      this._setUserPosition(action.pos);
      return;
    }
    onDefaultAction(action);
  }

  _setUserPosition(pos) {
    this.user.pos = pos;
    this.gameModel.emit('userPositionUpdate', this.user);
  }
}
