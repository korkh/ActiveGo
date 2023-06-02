import { observer } from "mobx-react-lite";
import { Header, Item, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/layout/stores/store";
import ActivityListItem from "./ActivityListItem";
import { Fragment } from "react";

const ActivityList = () => {
  const { activityStore } = useStore();
  const { groupedActivities } = activityStore;

  return (
    <>
      {groupedActivities.length !== 0 ? (
        <>
          {groupedActivities.map(([group, activities]) => (
            <Fragment key={group}>
              <Header sub color="teal">
                {group}
              </Header>
              {activities.map((activity) => (
                <ActivityListItem activity={activity} key={activity.id} />
              ))}
            </Fragment>
          ))}
        </>
      ) : (
        <h1 style={{ textAlign: "center" }}>NO ACTIVITIES FOUND</h1>
      )}
    </>
  );
};

export default observer(ActivityList);
