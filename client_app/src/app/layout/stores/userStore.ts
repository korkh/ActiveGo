import { makeAutoObservable, runInAction } from "mobx";
import { IUser, IUserFormValues } from "../models/user";
import agent from "../../../api/agent";
import { store } from "./store";
import { router } from "../router/Routes";

export default class UserStore {
  user: IUser | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedInn() {
    return !!this.user; //It converts the following value into a boolean by negating it twice. It effectively coerces any truthy value to true and any falsy value to false.
  }

  login = async (credentials: IUserFormValues) => {
    try {
      const user = await agent.Account.login(credentials);
      store.commonStore.setToken(user.token);
      runInAction(() => (this.user = user));
      router.navigate("/activities");
      store.modalStore.closeModal();
    } catch (error) {
      throw error;
    }
  };

  register = async (credentials: IUserFormValues) => {
    try {
      const user = await agent.Account.register(credentials);
      store.commonStore.setToken(user.token);
      runInAction(() => (this.user = user));
      router.navigate("/activities");
      store.modalStore.closeModal();
    } catch (error) {
      throw error;
    }
  };

  logout = () => {
    store.commonStore.setToken(null);
    this.user = null;
    router.navigate("/");
  };

  getUser = async () => {
    try {
      const user = await agent.Account.current();
      store.commonStore.setToken(user.token);
      runInAction(() => (this.user = user));
    } catch (error) {
      console.log(error);
    }
  };

  setImage = (image: string) => {
    if (this.user) this.user.image = image;
  };

  setDisplayName = async (name: string) => {
    if (this.user) this.user.displayName = name;
  };
}
