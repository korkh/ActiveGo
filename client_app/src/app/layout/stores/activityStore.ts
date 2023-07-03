import { makeAutoObservable, runInAction } from "mobx";
import agent from "../../../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/profile";

export default class ActivityStore {
  // activities: Activity[] = []; //depricated. Updated with Map usage
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
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
    //Get array of objects {[key: string] : Activity[]}
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
      }, {} as { [key: string]: Activity[] })
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
        // this.activities.push(activity); //comes from activities: Activity[] = [] and by that we mutating our state in MobX
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

  private setActivity = (activity: Activity) => {
    const user = store.userStore.user;

    if (user) {
      activity.isGoing = activity.attendees!.some(
        (a) => a.userName === user.userName
      );

      activity.isHost = activity.hostUsername === user.userName;
      activity.host = activity.attendees?.find(
        (u) => u.userName === activity.hostUsername
      );
    }
    activity.date = new Date(activity.date!); //separate date from time "T"
    this.activityRegistry.set(activity.id, activity);
  };

  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  createActivity = async (activity: ActivityFormValues) => {
    activity.id = crypto.randomUUID();
    const user = store.userStore.user;
    const attendee = new Profile(user!);

    try {
      await agent.Activities.create(activity);
      //To remove any wornings when working with async code
      // https://mobx.js.org/actions.html
      const newActivity = new Activity(activity);
      newActivity.hostUsername = user!.userName;
      newActivity.attendees = [attendee]; //array of const attendee = new Profile(user!);
      this.setActivity(newActivity);
      runInAction(() => {
        this.selectedActivity = newActivity;
      });
    } catch (error) {
      console.log(error);
    }
  };

  updateActivity = async (activity: ActivityFormValues) => {
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        if (activity.id) {
          let updatedActivity = {
            ...this.getActivity(activity.id),
            ...activity,
          };
          this.activityRegistry.set(activity.id, updatedActivity as Activity);
          this.selectedActivity = updatedActivity as Activity;
        }
      });
    } catch (error) {
      console.log(error);
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

  updateAttendance = async () => {
    const user = store.userStore.user;
    this.loading = true; //set loading flag
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        if (this.selectedActivity?.isGoing) {
          //removing attendee object if we cancelling activity
          this.selectedActivity.attendees =
            this.selectedActivity.attendees?.filter(
              (a) => a.userName !== user?.userName
            ); //by filter we are removing currently logged in user from attendees array
          this.selectedActivity.isGoing = false;
        } else {
          //add attendee object if we joining an activity
          const attendee = new Profile(user!);
          this.selectedActivity?.attendees?.push(attendee);
          this.selectedActivity!.isGoing = true;
        }
        //we take an oppotunitiy to set an activity registry in the same time
        this.activityRegistry.set(
          this.selectedActivity!.id,
          this.selectedActivity!
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false)); //switching off loading flag
    }
  };

  cancelActivityToggle = async () => {
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        this.selectedActivity!.isCancelled =
          !this.selectedActivity?.isCancelled; //used ! to indicate that we sure that it will be not undefined activity
        this.activityRegistry.set(
          this.selectedActivity!.id,
          this.selectedActivity!
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  }; //cancelActivityToggle

  clearSelectedActivity = () => {
    this.selectedActivity = undefined;
  }; //clearSelectedActivity
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
