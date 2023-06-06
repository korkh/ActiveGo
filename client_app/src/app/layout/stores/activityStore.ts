import { makeAutoObservable, runInAction } from "mobx";
import agent from "../../../api/agent";
import { IActivity } from "../models/activity";
import { format } from "date-fns";

export default class ActivityStore {
  // activities: IActivity[] = []; //depricated. Updated with Map usage
  activityRegistry = new Map<string, IActivity>();
  selectedActivity: IActivity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this);
  }

  //we need computed properties return activity by date
  get activitiesByDates() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    );
  }

  get groupedActivities() {
    //Get array of objects {[key: string] : IActivity[]}
    //and each object will have a key (activity.date) [key: string]
    //and each date will have an array of activities inside IActivities[]
    return Object.entries(
      this.activitiesByDates.reduce((activities, activity) => {
        const date = format(activity.date!, "dd MMMM yyyy");
        //returning group set of activities
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  //Using arrow function we no worried about binding actions inside the class (action.bound)
  //async is used if we want to manipulate promisies inside
  //async code we will hold inside try-catch but sync outside try-catch
  loadActivities = async () => {
    this.setLoadingInitial(true);
    try {
      const activities = await agent.Activities.list();
      //To remove any wornings when working with async code
      // https://mobx.js.org/actions.html
      //or we can make an action setLoadingInitial
      activities.forEach((activity) => {
        this.setActivity(activity);
        // this.activities.push(activity); //comes from activities: IActivity[] = [] and by that we mutating our state in MobX
      });
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };

  //Loading single activity by id
  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.setLoadingInitial(true);
      try {
        activity = await agent.Activities.details(id);
        this.setActivity(activity);
        runInAction(() => {
          this.selectedActivity = activity;
        });

        this.setLoadingInitial(false);
        return activity;
      } catch (error) {
        console.log(error);
        this.setLoadingInitial(false);
      }
    }
  };

  private setActivity = (activity: IActivity) => {
    activity.date = new Date(activity.date!); //separate date from time "T"
    this.activityRegistry.set(activity.id, activity);
  };

  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
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
