import { observer } from "mobx-react-lite";
import { Grid } from "semantic-ui-react";
import { useStore } from "../../../app/layout/stores/store";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";

export default observer(function ActivitityDashboard() {
  const { activityStore } = useStore();
  const { selectedActivity, editMode, activitiesByDates } = activityStore;

  return (
    <Grid>
      <Grid.Column width="10">
        {activitiesByDates && <ActivityList />}
      </Grid.Column>
      <Grid.Column width="6">
        {selectedActivity && !editMode && <ActivityDetails />}
        {editMode && <ActivityForm />}
      </Grid.Column>
    </Grid>
  );
});
