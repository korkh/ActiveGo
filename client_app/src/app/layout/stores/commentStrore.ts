import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment } from "../models/comment";
import { store } from "./store";

export default class CommentStore {
  comments: ChatComment[] = [];
  hubConnection: HubConnection | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  //Creating connection
  createHubConnection = (activityId: string) => {
    if (store.activityStore.selectedActivity) {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl("http://localhost:5000/chat?activityId=" + activityId, {
          accessTokenFactory: () => store.userStore.user?.token!,
        })
        .withAutomaticReconnect() //helps to recoonect if loosing connection
        .configureLogging(LogLevel.Information) //logging
        .build();

      //start connection
      this.hubConnection
        .start()
        .catch((error) =>
          console.log("Error to establish the collection: ", error)
        );

      //Load comments after connection was established
      this.hubConnection.on("LoadComments", (comments: ChatComment[]) => {
        //update observable inside store, so using runInactoion
        runInAction(() => {
          comments.forEach((comment) => {
            comment.createdAt = new Date(comment.createdAt + "Z"); //to make date in UTC comming from database
          });
          this.comments = comments;
        });
      });

      //Recieving connection
      this.hubConnection.on("ReceiveComment", (comment: ChatComment) => {
        runInAction(() => {
          comment.createdAt = new Date(comment.createdAt); //here no need "Z" it comes already in UTC format
          this.comments.unshift(comment); //unshift will place a comment in the start of the array
        });
      });
    }
  }; //creating connection

  //Stop connection
  stopHubConnection = () => {
    this.hubConnection
      ?.stop()
      .catch((error) => console.log("Error stopping connection ", error));
  };

  //Clear all comments
  clearComments = () => {
    this.comments = [];
    this.stopHubConnection();
  };

  addComment = async (values: any) => {
    values.activityId = store.activityStore.selectedActivity?.id;
    try {
      await this.hubConnection?.invoke("SendComment", values); //matches the Task name in ChatHub. Sending values in the body as part of POST request
    } catch (error) {
      console.log(error);
    }
  };
}
