import chai, { expect } from "chai"

import { configureTestStore } from "./helpers/server";

import alertReducer, { pop } from '../src/client/features/alerts/alertSlice'
import { ALERT_POP } from "../src/client/actions/alert";

const MESSAGE = "message"

chai.should()

describe('Fake redux test', () => {
  it('alert it', (done) => {
    const initialState = {}

    const store = configureTestStore(alertReducer, null, initialState)

    store.dispatch({ type: ALERT_POP, message: MESSAGE })
    expect(store.getState().message).to.equal(MESSAGE)

    done()
  });
});
