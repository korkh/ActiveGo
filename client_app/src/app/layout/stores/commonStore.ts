import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore {
  error: ServerError | null = null;
  token: string | null = localStorage.getItem("jwt");
  appLoaded = false;

  constructor() {
    makeAutoObservable(this);
    //making reaction for particular observable (here is token)
    //reaction will not execute if there is no change in value of token in localStorage
    reaction(
      () => this.token,
      (token) => {
        if (token) {
          localStorage.setItem("jwt", token); //during login
        } else {
          localStorage.removeItem("jwt"); //during logout
        }
      }
    );
  }

  setServerError(error: ServerError) {
    this.error = error;
  }

  setToken = (token: string | null) => {
    this.token = token;
  };

  setAppLoaded = () => {
    this.appLoaded = true;
  };
}
