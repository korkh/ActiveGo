import { makeAutoObservable, runInAction } from "mobx";
import agent from "../../../api/agent";
import { IActivity } from "../models/activity";

export default class ActivityStore {
  // activities: IActivity[] = []; //depricated. Updated with Map usage
  activityRegistry = new Map<string, IActivity>();
  selectedActivity: IActivity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = true;

  constructor() {
    makeAutoObservable(this);
  }

  //we need computed properties return activity by date
  get activitiesByDates() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }

  //Using arrow function we no worried about binding actions inside the class (action.bound)
  //async is used if we want to manipulate promisies inside
  //async code we will hold inside try-catch but sync outside try-catch
  loadActivities = async () => {
    try {
      const activities = await agent.Activities.list();
      //To remove any wornings when working with async code
      // https://mobx.js.org/actions.html
      //or we can make an action setLoadingInitial
      activities.forEach((activity) => {
        activity.date = activity.date.split("T")[0]; //separate date from time "T"
        this.activityRegistry.set(activity.id, activity);
        // this.activities.push(activity); //comes from activities: IActivity[] = [] and by that we mutating our state in MobX
      });
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
  };

  cancelSelectActivity = () => {
    this.selectedActivity = undefined;
  };

  openForm = (id?: string) => {
    id ? this.selectActivity(id) : this.cancelSelectActivity();
    this.editMode = true;
  };

  closeForm = () => {
    this.editMode = false;
  };

  createActivity = async (activity: IActivity) => {
    this.loading = true;
    activity.id = crypto.randomUUID();

    try {
      await agent.Activities.create(activity);
      //To remove any wornings when working with async code
      // https://mobx.js.org/actions.html
      runInAction(() => {
        // this.activities.push(activity);
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateActivity = async (activity: IActivity) => {
    this.loading = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deleteActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        //To remove from right form after deletion
        if (this.selectedActivity?.id === id) this.cancelSelectActivity();
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
