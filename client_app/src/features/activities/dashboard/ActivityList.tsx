import { Button, Item, Label, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/layout/models/activity";

interface Props {
  activities: IActivity[];
  selectActivity: (id: string) => void;
  deleteActivity: (id: string) => void;
}

const ActivityList = ({
  activities,
  selectActivity,
  deleteActivity,
}: Props) => {
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
                      onClick={() => deleteActivity(activity.id)}
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