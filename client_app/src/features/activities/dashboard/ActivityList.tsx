import { Button, Item, Label, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/layout/models/activity";
import { SyntheticEvent, useState } from "react";

interface Props {
  activities: IActivity[];
  selectActivity: (id: string) => void;
  deleteActivity: (id: string) => void;
  submitting: boolean;
}

const ActivityList = ({
  activities,
  selectActivity,
  deleteActivity,
  submitting,
}: Props) => {
  //To control buttons
  const [focus, setFocus] = useState("");

  const handleActivityDelete = (
    e: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    setFocus(e.currentTarget.name);
    deleteActivity(id);
  };

  return (
    <>
      {activities.length !== 0 ? (
        <Segment>
          <Item.Group divided>
            {activities.map((activity) => (
              <Item key={crypto.randomUUID()}>
                <Item.Content>
                  <Item.Header as="a">{activity.title}</Item.Header>
                  <Item.Meta>{activity.date}</Item.Meta>
                  <Item.Description>
                    <div>{activity.description}</div>
                    <div>
                      {activity.city}, {activity.venue}
                    </div>
                  </Item.Description>
                  <Item.Extra>
                    <Button
                      onClick={() => selectActivity(activity.id)}
                      floated="right"
                      content="View"
                      color="blue"
                    />
                    <Button
                      name={activity.id}
                      loading={submitting && focus === activity.id}
                      onClick={(e) => handleActivityDelete(e, activity.id)}
                      floated="right"
                      content="Delete"
                      color="red"
                    />
                    <Label basic content={activity.category} />
                  </Item.Extra>
                </Item.Content>
              </Item>
            ))}
          </Item.Group>
        </Segment>
      ) : (
        <h1 style={{ textAlign: "center" }}>NO ACTIVITIES FOUND</h1>
      )}
    </>
  );
};

export default ActivityList;
