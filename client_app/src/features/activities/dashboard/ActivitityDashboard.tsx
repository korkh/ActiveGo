import { Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/layout/models/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";

interface Props {
  activities: IActivity[];
  selectedActivity: IActivity | undefined;
  selectActivity: (id: string) => void;
  cancelSelectActivity: () => void;
  editMode: boolean;
  openForm: (id: string) => void;
  closeForm: () => void;
  createOrEdit: (activity: IActivity) => void;
  deleteActivity: (id: string) => void;
}

export default function ActivitityDashboard({
  activities,
  selectedActivity,
  selectActivity,
  cancelSelectActivity,
  openForm,
  closeForm,
  editMode,
  createOrEdit,
  deleteActivity,
}: Props) {
  return (
    <Grid>
      <Grid.Column width="10">
        {activities && (
          <ActivityList
            activities={activities}
            selectActivity={selectActivity}
            deleteActivity={deleteActivity}
          />
        )}
      </Grid.Column>
      <Grid.Column width="6">
        {selectedActivity && !editMode && (
          <ActivityDetails
            activity={selectedActivity}
            cancelSelectActivity={cancelSelectActivity}
            openForm={openForm}
          />
        )}
        {editMode && (
          <ActivityForm
            closeForm={closeForm}
            activity={selectedActivity}
            createOrEdit={createOrEdit}
          />
        )}
      </Grid.Column>
    </Grid>
  );
}
