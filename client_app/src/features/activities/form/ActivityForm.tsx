import { ChangeEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/layout/models/activity";

interface Props {
  activity: IActivity | undefined;
  closeForm: () => void;
  createOrEdit: (activity: IActivity) => void;
}

const ActivityForm = ({
  activity: selectedActivity,
  closeForm,
  createOrEdit,
}: Props) => {
  //if activity is null ( ?? )
  const initialState = selectedActivity ?? {
    id: "",
    title: "",
    date: "",
    category: "",
    description: "",
    city: "",
    venue: "",
  };

  //Populate initial state and store insode component states
  //we ca make through the useState hook
  const [activity, setActivity] = useState(initialState);

  function handleSubmit() {
    createOrEdit(activity);
  }

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    //Spreding existing properties of activities (with initialState)
    setActivity({ ...activity, [name]: value }); //setting property with key "name" to value what ever that is
  }

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit} autoComplete="off">
        <Form.Input
          placeholder="Title"
          name="title"
          value={activity.title}
          onChange={handleInputChange}
        />
        <Form.TextArea
          placeholder="Description"
          value={activity.description}
          name="description"
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder="Category"
          name="category"
          value={activity.category}
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder="Date"
          name="date"
          value={activity.date}
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder="City"
          name="city"
          value={activity.city}
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder="Venue"
          name="venue"
          value={activity.venue}
          onChange={handleInputChange}
        />
        <Button floated="right" positive type="submit" content="Submit" />
        <Button
          onClick={closeForm}
          floated="right"
          type="button"
          content="Cancel"
        />
      </Form>
    </Segment>
  );
};

export default ActivityForm;
