import { ChangeEvent, useEffect, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/layout/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IActivity } from "../../../app/layout/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";

const ActivityForm = () => {
  const { activityStore } = useStore();
  const {
    createActivity,
    updateActivity,
    loading,
    loadActivity,
    loadingInitial,
  } = activityStore;

  const { id } = useParams();

  const navigate = useNavigate();

  const [activity, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    date: "",
    category: "",
    description: "",
    city: "",
    venue: "",
  });

  useEffect(() => {
    if (id) loadActivity(id).then((activity) => setActivity(activity!));
  }, [id, loadActivity]);

  function handleSubmit() {
    if (!activity.id) {
      activity.id = crypto.randomUUID();
      createActivity(activity).then(() =>
        navigate(`/activities/${activity.id}`)
      );
    } else {
      updateActivity(activity).then(() =>
        navigate(`/activities/${activity.id}`)
      );
    }
  }

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    //Spreding existing properties of activities (with initialState)
    setActivity({ ...activity, [name]: value }); //setting property with key "name" to value what ever that is
  }

  if (loadingInitial) return <LoadingComponent content="Loading activity..." />;

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
          type="date"
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
        <Button
          loading={loading}
          floated="right"
          positive
          type="submit"
          content="Submit"
        />
        <Button
          as={Link}
          to={`/activities/${activity.id}`}
          floated="right"
          type="button"
          content="Cancel"
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
